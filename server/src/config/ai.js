// Single place that reads AI settings from .env — keys never leave the server.
const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

module.exports = {
  provider,
  geminiKey: process.env.GEMINI_API_KEY,
  openaiKey: process.env.OPENAI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  // chat messages may contain pasted code (e.g. a whole index.html to convert)
  maxMessageLength: 20000,
  maxOutputTokens: 16000,
  limits: {
    maxFiles: 40,
    maxFileChars: 100000,
    maxTotalChars: 300000,
  },
};
