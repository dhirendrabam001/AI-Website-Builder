const { provider } = require("../config/ai");
const gemini = require("./providers/gemini");
const openai = require("./providers/openai");
const { parseAgentJson, applyChanges } = require("./sanitize");
const { plannerMessages, builderMessages, reviewerMessages } = require("./prompts");

const providers = { gemini, openai };

// Primary provider first, the other one as fallback if the call or its output fails.
const order = provider === "openai" ? ["openai", "gemini"] : ["gemini", "openai"];

// One model call that must return JSON; tries each provider before giving up.
const ask = async (prompt, maxTokens) => {
  let lastError;
  for (const name of order) {
    try {
      return parseAgentJson(await providers[name].run({ ...prompt, maxTokens }));
    } catch (error) {
      console.error(`AI provider "${name}" failed:`, error.message);
      lastError = error;
    }
  }
  throw lastError;
};

const text = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

// Cheap, deterministic pre-check so the Reviewer agent knows where to look.
const IMPORT_RE = /import\s+(?:[^'"]*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/g;

const resolveImport = (from, spec) => {
  const parts = from.split("/").slice(0, -1);
  for (const seg of spec.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return parts.join("/") || "/";
};

const findImportProblems = (files) => {
  const paths = new Set(files.map((f) => f.path));
  const problems = [];
  for (const file of files) {
    if (!/\.(js|jsx)$/.test(file.path)) continue;
    for (const [, spec] of file.content.matchAll(IMPORT_RE)) {
      const target = resolveImport(file.path, spec);
      const exists = [target, `${target}.js`, `${target}.jsx`, `${target}/index.js`].some(
        (p) => paths.has(p),
      );
      if (!exists) problems.push(`${file.path} imports "${spec}" but that file does not exist`);
    }
  }
  if (!paths.has("/App.js")) problems.push("/App.js is missing");
  return problems;
};

const planLines = (plan) =>
  (Array.isArray(plan.files) ? plan.files : [])
    .filter((f) => f && typeof f.path === "string")
    .slice(0, 20)
    .map((f) => `${text(f.action, 10) || "edit"} ${f.path}`);

/**
 * Multi-agent run: Planner -> Builder -> Reviewer.
 * `emit` receives live progress events: { agent, status: "running"|"done"|"skipped", detail }.
 * Resolves to { reply, files } where files is the complete updated file list.
 */
const runAgents = async ({ files, history, message, emit = () => {} }) => {
  const input = { files, history, message };

  // ---------- 1. Planner ----------
  emit({ agent: "planner", status: "running" });
  let plan;
  try {
    plan = await ask(plannerMessages(input), 3000);
  } catch (error) {
    // planning is an optimisation — if it fails the builder still works from the request alone
    console.error("Planner failed, continuing without a plan:", error.message);
    plan = { summary: "Build what the user asked for", files: [], steps: [] };
  }
  emit({
    agent: "planner",
    status: "done",
    detail: text(plan.summary, 300) || "Plan ready",
    items: planLines(plan),
  });

  // ---------- 2. Builder ----------
  emit({ agent: "builder", status: "running" });
  const built = await ask(builderMessages(input, plan));
  let nextFiles = applyChanges(files, built);
  const reply = text(built.reply, 2000) || "Done.";
  emit({
    agent: "builder",
    status: "done",
    detail: `Wrote ${Array.isArray(built.files) ? built.files.length : 0} file(s)`,
    items: (Array.isArray(built.files) ? built.files : [])
      .filter((f) => f && typeof f.path === "string")
      .slice(0, 20)
      .map((f) => f.path),
  });

  // ---------- 3. Reviewer (never fails the whole run) ----------
  const touched = Array.isArray(built.files) ? built.files.length : 0;
  if (!touched) {
    emit({ agent: "reviewer", status: "skipped", detail: "No code changed" });
    return { reply, files: nextFiles };
  }

  emit({ agent: "reviewer", status: "running" });
  try {
    const hints = findImportProblems(nextFiles);
    const review = await ask(
      reviewerMessages({ files: nextFiles, message, plan, hints }),
      12000,
    );
    const issues = (Array.isArray(review.issues) ? review.issues : [])
      .map((i) => text(i, 200))
      .filter(Boolean)
      .slice(0, 8);
    if ((Array.isArray(review.files) && review.files.length) || review.delete?.length) {
      nextFiles = applyChanges(nextFiles, review);
    }
    emit({
      agent: "reviewer",
      status: "done",
      detail: issues.length ? `Fixed ${issues.length} issue(s)` : "No issues found",
      items: issues,
    });
  } catch (error) {
    console.error("Reviewer failed, keeping the builder output:", error.message);
    emit({ agent: "reviewer", status: "skipped", detail: "Review unavailable" });
  }

  return { reply, files: nextFiles };
};

module.exports = { runAgents };
