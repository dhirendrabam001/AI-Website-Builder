const mongoose = require("mongoose");
const { User } = require("../models/user.models");
const { Project } = require("../models/project.models");
const { runAgents } = require("../services/ai.service");
const { validateFiles } = require("../services/sanitize");
const { maxMessageLength } = require("../config/ai");

const MAX_VERSIONS = 10;
const MAX_MESSAGES = 60;

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

// Take one credit atomically so two parallel requests can't overspend.
const takeCredit = (userId) =>
  User.findOneAndUpdate(
    { _id: userId, aiCredits: { $gt: 0 } },
    { $inc: { aiCredits: -1 } },
    { returnDocument: "after" },
  );
const refundCredit = (userId) =>
  User.updateOne({ _id: userId }, { $inc: { aiCredits: 1 } });


// Live progress: when the client asks for text/event-stream we stream the
// agents' steps, then the final result. Otherwise it is one plain JSON reply.
const wantsStream = (req) => (req.headers.accept || "").includes("text/event-stream");

const openStream = (req, res) => {
  if (!wantsStream(req)) {
    return { emit: () => {}, done: (status, body) => res.status(status).json(body) };
  }
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  const send = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  return {
    emit: (data) => send("agent", data),
    done: (status, body) => {
      send(status < 400 ? "result" : "failure", { status, ...body });
      res.end();
    },
  };
};

const validId = (id) => mongoose.isValidObjectId(id);

// Never leak other users' projects: always filter by owner.
const findOwned = (id, userId) => Project.findOne({ _id: id, owner: userId });

const plainFiles = (files) => files.map(({ path, content }) => ({ path, content }));

const summary = (p) => ({
  id: p._id,
  title: p.title,
  prompt: p.prompt,
  updatedAt: p.updatedAt,
});

const detail = (p) => ({
  ...summary(p),
  files: plainFiles(p.files),
  messages: p.messages.map((m) => ({
    role: m.role,
    content: m.content,
    createdAt: m.createdAt,
  })),
  versions: p.versions.map((v, index) => ({
    index,
    label: v.label,
    createdAt: v.createdAt,
  })),
});

const titleFrom = (prompt) => {
  const t = prompt.replace(/\s+/g, " ").trim();
  return t.length > 60 ? `${t.slice(0, 57)}…` : t;
};

const readMessage = (value) => (typeof value === "string" ? value.trim() : "");

const messageError = (text) => {
  if (!text) return "Please describe what you want to build";
  if (text.length > maxMessageLength) {
    return `Message must be under ${maxMessageLength} characters`;
  }
  return null;
};

// Push a snapshot for Undo and keep the arrays bounded.
const commit = (project, label) => {
  project.versions.push({ label, files: plainFiles(project.files) });
  if (project.versions.length > MAX_VERSIONS) {
    project.versions = project.versions.slice(-MAX_VERSIONS);
  }
  if (project.messages.length > MAX_MESSAGES) {
    project.messages = project.messages.slice(-MAX_MESSAGES);
  }
};

const generate = async (req, res) => {
  const userId = req.user.id;
  const prompt = readMessage(req.body.prompt);
  const problem = messageError(prompt);
  if (problem) return fail(res, 400, problem);

  const user = await takeCredit(userId);
  if (!user) return fail(res, 402, "You have no AI credits left");

  const stream = openStream(req, res);
  try {
    const { reply, files } = await runAgents({
      files: [],
      history: [],
      message: prompt,
      emit: stream.emit,
    });
    const project = new Project({
      owner: userId,
      title: titleFrom(prompt),
      prompt,
      files,
      messages: [
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ],
    });
    commit(project, "Initial version");
    await project.save();
    return stream.done(201, {
      success: true,
      message: "Website generated",
      data: { project: detail(project), aiCredits: user.aiCredits },
    });
  } catch (error) {
    await refundCredit(userId);
    console.error("Generate error", error);
    return stream.done(502, {
      success: false,
      message: "The AI could not build your site. Please try again.",
    });
  }
};

// Chat turn: the agent reads the current files and returns the changed ones.
const chat = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const message = readMessage(req.body.message);

  if (!validId(id)) return fail(res, 404, "Project not found");
  const problem = messageError(message);
  if (problem) return fail(res, 400, problem);

  const project = await findOwned(id, userId);
  if (!project) return fail(res, 404, "Project not found");

  const user = await takeCredit(userId);
  if (!user) return fail(res, 402, "You have no AI credits left");

  const stream = openStream(req, res);
  try {
    const { reply, files } = await runAgents({
      files: plainFiles(project.files),
      history: project.messages.map((m) => ({ role: m.role, content: m.content })),
      message,
      emit: stream.emit,
    });
    project.files = files;
    project.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: reply },
    );
    commit(project, message.slice(0, 60));
    await project.save();
    return stream.done(200, {
      success: true,
      message: "Project updated",
      data: { project: detail(project), aiCredits: user.aiCredits },
    });
  } catch (error) {
    await refundCredit(userId);
    console.error("Chat error", error);
    return stream.done(502, {
      success: false,
      message: "The AI could not apply that change. Please try again.",
    });
  }
};

// Manual edits made in the code editor.
const saveFiles = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validId(id)) return fail(res, 404, "Project not found");

    const project = await findOwned(id, req.user.id);
    if (!project) return fail(res, 404, "Project not found");

    let files;
    try {
      files = validateFiles(req.body.files);
    } catch (error) {
      return fail(res, 400, error.message);
    }

    project.files = files;
    commit(project, "Manual edit");
    await project.save();
    return res
      .status(200)
      .json({ success: true, message: "Saved", data: { project: detail(project) } });
  } catch (error) {
    console.error("Save files error", error);
    return fail(res, 500, "Internal server error");
  }
};

const revert = async (req, res) => {
  try {
    const { id } = req.params;
    const index = Number(req.body.index);
    if (!validId(id)) return fail(res, 404, "Project not found");

    const project = await findOwned(id, req.user.id);
    if (!project) return fail(res, 404, "Project not found");

    const version = project.versions[index];
    if (!Number.isInteger(index) || !version) {
      return fail(res, 400, "That version does not exist");
    }

    // rolling back drops the newer versions, so repeated undo keeps stepping back
    project.files = plainFiles(version.files);
    project.versions = project.versions.slice(0, index + 1);
    project.messages.push({ role: "assistant", content: "Reverted the last change." });
    await project.save();
    return res
      .status(200)
      .json({ success: true, message: "Version restored", data: { project: detail(project) } });
  } catch (error) {
    console.error("Revert error", error);
    return fail(res, 500, "Internal server error");
  }
};

const list = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .select("title prompt updatedAt")
      .sort({ updatedAt: -1 });
    return res
      .status(200)
      .json({ success: true, data: { projects: projects.map(summary) } });
  } catch (error) {
    console.error("List error", error);
    return fail(res, 500, "Internal server error");
  }
};

const get = async (req, res) => {
  try {
    if (!validId(req.params.id)) return fail(res, 404, "Project not found");
    const project = await findOwned(req.params.id, req.user.id);
    if (!project) return fail(res, 404, "Project not found");
    return res.status(200).json({ success: true, data: { project: detail(project) } });
  } catch (error) {
    console.error("Get error", error);
    return fail(res, 500, "Internal server error");
  }
};

const remove = async (req, res) => {
  try {
    if (!validId(req.params.id)) return fail(res, 404, "Project not found");
    const result = await Project.deleteOne({ _id: req.params.id, owner: req.user.id });
    if (!result.deletedCount) return fail(res, 404, "Project not found");
    return res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Remove error", error);
    return fail(res, 500, "Internal server error");
  }
};

module.exports = { generate, chat, saveFiles, revert, list, get, remove };
