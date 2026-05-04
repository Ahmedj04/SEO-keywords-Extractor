import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const GROQ_FAST_MODEL = "llama-3.3-70b-versatile";
export const GROQ_TEMPERATURE =  0.2;

function createClient(modelName) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is required.");

  return new ChatGroq({
    model: modelName,
    temperature: GROQ_TEMPERATURE,
    apiKey: process.env.GROQ_API_KEY,
  });
}

export async function groqCall({ prompt, systemInstruction, modelName }) {
  const model = createClient(modelName);

  const messages = [];
  if (systemInstruction) messages.push(new SystemMessage(systemInstruction));
  messages.push(new HumanMessage(prompt));

  try {
    const response = await model.invoke(messages);
    const content = response.content;
    return typeof content === "string" ? content : JSON.stringify(content);
  } catch (error) {
    console.error("Error calling Groq:", error);
    throw new Error("Error calling Groq", { cause: error });
  }
}