const OpenAI = require("openai");
const { openaiKey, openaiModel, maxOutputTokens } = require("../../config/ai");

let client;

const run = async ({ system, user }) => {
  if (!openaiKey) throw new Error("OPENAI_API_KEY is not set");
  client ??= new OpenAI({ apiKey: openaiKey });

  const completion = await client.chat.completions.create({
    model: openaiModel,
    temperature: 0.6,
    max_completion_tokens: maxOutputTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  return completion.choices[0]?.message?.content;
};

module.exports = { run };
