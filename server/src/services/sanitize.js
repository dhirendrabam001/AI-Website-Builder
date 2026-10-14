const { limits } = require("../config/ai");

// The AI must never overwrite the files the preview runtime owns.
const PROTECTED = new Set([
  "/index.js",
  "/package.json",
  "/index.html",
  "/public/index.html",
]);
const PATH_RE = /^\/[A-Za-z0-9_\-./]+\.(js|jsx|css|svg|json)$/;

const isSafePath = (p) =>
  typeof p === "string" &&
  p.length <= 100 &&
  PATH_RE.test(p) &&
  !p.includes("..") &&
  !p.includes("//");

// Models sometimes wrap JSON in ```json fences or add a sentence around it.
const parseAgentJson = (raw) => {
  if (typeof raw !== "string" || !raw.trim()) {
    throw new Error("AI returned no content");
  }
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("AI did not return JSON");
    return JSON.parse(text.slice(start, end + 1));
  }
};

// Returns the new full file list after applying the AI's changes.
const applyChanges = (current, result) => {
  if (!result || typeof result !== "object") throw new Error("Bad AI response");

  const map = new Map(current.map((f) => [f.path, f.content]));

  for (const file of Array.isArray(result.files) ? result.files : []) {
    if (!file || !isSafePath(file.path) || typeof file.content !== "string") continue;
    if (PROTECTED.has(file.path)) continue;
    map.set(file.path, file.content);
  }
  for (const path of Array.isArray(result.delete) ? result.delete : []) {
    if (isSafePath(path)) map.delete(path);
  }

  return validateFiles([...map].map(([path, content]) => ({ path, content })));
};

const validateFiles = (files) => {
  if (!Array.isArray(files)) throw new Error("Invalid files");
  if (!files.some((f) => f.path === "/App.js")) {
    throw new Error("The project must contain /App.js");
  }
  if (files.length > limits.maxFiles) throw new Error("Too many files");

  let total = 0;
  for (const f of files) {
    if (!isSafePath(f.path) || PROTECTED.has(f.path) || typeof f.content !== "string") {
      throw new Error(`Invalid file: ${f.path}`);
    }
    if (f.content.length > limits.maxFileChars) {
      throw new Error(`${f.path} is too large`);
    }
    total += f.content.length;
  }
  if (total > limits.maxTotalChars) throw new Error("Project is too large");

  return files.map(({ path, content }) => ({ path, content }));
};

module.exports = { parseAgentJson, applyChanges, validateFiles };
