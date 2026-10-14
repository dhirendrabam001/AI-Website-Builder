const { provider } = require("../config/ai");
const gemini = require("./providers/gemini");
const openai = require("./providers/openai");
const { parseAgentJson, applyChanges } = require("./sanitize");
const { agentMessages } = require("./prompts");

const providers = { gemini, openai };

// Primary provider first, the other one as fallback if the call or its output fails.
const order = provider === "openai" ? ["openai", "gemini"] : ["gemini", "openai"];

/**
 * One agent turn: send the project files + chat + request, get back
 * { reply, files } where files is the complete updated file list.
 */
const runAgent = async ({ files, history, message }) => {
  const prompt = agentMessages({ files, history, message });
  let lastError;

  for (const name of order) {
    try {
      const result = parseAgentJson(await providers[name].run(prompt));
      const nextFiles = applyChanges(files, result);
      const reply =
        typeof result.reply === "string" && result.reply.trim()
          ? result.reply.trim().slice(0, 2000)
          : "Done.";
      return { reply, files: nextFiles };
    } catch (error) {
      console.error(`AI provider "${name}" failed:`, error.message);
      lastError = error;
    }
  }
  throw lastError;
};

module.exports = { runAgent };
