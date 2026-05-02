import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const GEMINI_FAST_MODEL = "gemini-2.5-flash-lite";
export const GEMINI_TEMPERATURE = 0.2;

function createClient(modelName) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is required.");

  return new ChatGoogleGenerativeAI({
    model: modelName,
    temperature: GEMINI_TEMPERATURE,
    apiKey: apiKey,
  });
}

export async function geminiCall({ prompt, systemInstruction, modelName }) {
  const model = createClient(modelName);

  const messages = [];
  if (systemInstruction) messages.push(new SystemMessage(systemInstruction));
  messages.push(new HumanMessage(prompt));

  try {
    const response = await model.invoke(messages);
    const content = response.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  } catch (error) {
    console.error("Error calling Gemini:", error);
    throw new Error("Error calling Gemini", { cause: error });
  }
}