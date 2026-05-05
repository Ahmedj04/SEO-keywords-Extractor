import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import Bottleneck from "bottleneck";

// export const GROQ_FAST_MODEL = "llama-3.3-70b-versatile";
export const GROQ_FAST_MODEL = "llama-3.1-8b-instant";
export const GROQ_SMART_MODEL = "groq/compound-mini";
export const GROQ_TEMPERATURE =  0.2;

const limiter = new Bottleneck({
  reservoir: 5, // max 10 jobs at a time
  reservoirRefreshAmount: 5,  // reset to 10 every interval
  reservoirRefreshInterval: 60 * 1000,  // refresh every minute
  maxConcurrent: 1,  // one at a time to avoid burst spikes
  // minTime: 15000,
})

function createClient(modelName) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is required.");

  return new ChatGroq({
    model: modelName,
    temperature: GROQ_TEMPERATURE,
    apiKey: apiKey,
  });
}

async function groqCallRaw({ prompt, systemInstruction, modelName }) {
  const model = createClient(modelName);

  const messages = [];
  if (systemInstruction) messages.push(new SystemMessage(systemInstruction));
  messages.push(new HumanMessage(prompt));
  
  const response = await model.invoke(messages);
  const content = response.content;
  return typeof content === "string" ? content : JSON.stringify(content); 
}

export async function groqCall(params) {
  try{
    return await limiter.schedule(() => groqCallRaw(params))
  } catch (error) {
    console.error("Error calling Groq:", error);
    throw new Error("Error calling Groq", { cause: error });
  }
}