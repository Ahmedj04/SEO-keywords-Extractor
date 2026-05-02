import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const OLLAMA_FAST_MODEL = "gpt-oss:20b";
export const OLLAMA_SMART_MODEL = "nemotron-3-super";
export const OLLAMA_TEMPERATURE = 0.2;

function createAuthenticatedFetch() {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) throw new Error("OLLAMA_API_KEY is required.");

  // Return a fetch wrapper that injects the Authorization header
  return (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${apiKey}`,
      },
    });
  };
}

function createClient(modelName, format) {
  if (!process.env.OLLAMA_HOST) throw new Error("OLLAMA_HOST is required.");

  return new ChatOllama({
    baseUrl: process.env.OLLAMA_HOST.replace(/\/$/, ""),
    model: modelName,
    temperature: OLLAMA_TEMPERATURE,
    ...(format === "json" ? { format: "json" } : {}),
    fetch: createAuthenticatedFetch(),
  });
}

export async function ollamaCall({ prompt, systemInstruction, modelName, format }) {
  const model = createClient(modelName, format);

  const messages = [];
  if (systemInstruction) messages.push(new SystemMessage(systemInstruction));
  messages.push(new HumanMessage(prompt));

  try {
    const response = await model.invoke(messages);
    const content = response.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  } catch (error) {
    console.error("Error calling Ollama:", error);
    throw new Error("Error calling Ollama", { cause: error });
  }
}
