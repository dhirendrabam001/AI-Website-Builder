const { GoogleGenAI } = require("@google/genai");
const { geminiKey, geminiModel, maxOutputTokens } = require("../../config/ai");

let client;

const run = async ({ system, user, maxTokens = maxOutputTokens }) => {
  if (!geminiKey) throw new Error("GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey: geminiKey });

  const response = await client.models.generateContent({
    model: geminiModel,
    contents: user,
    config: {
      systemInstruction: system,
      temperature: 0.6,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json",
    },
  });
  return response.text;
};

module.exports = { run };
