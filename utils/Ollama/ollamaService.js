import { Ollama } from "ollama";

function createClient() {
  if (!process.env.OLLAMA_HOST) {
    throw new Error("OLLAMA_HOST is required.");
  }

  return new Ollama({
    host: process.env.OLLAMA_HOST.replace(/\/$/, ""),
    headers: { 
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` 
    },
  });
}

export async function ollamaCall({
  prompt,
  systemInstruction,
  modelName,
  format,
}) {
  const model =
    modelName || process.env.OLLAMA_DEFAULT_MODEL;

  try {
    const ollama = createClient();

    const messages = [];

    if (systemInstruction) {
      messages.push({ role: "system", content: systemInstruction });
    }

    messages.push({ role: "user", content: prompt });

    const response = await ollama.chat({
      model,
      messages,
      stream: false, // explicitly disable streaming
      ...(format ? { format } : {}),
      options: {
        temperature: Number(process.env.OLLAMA_TEMPERATURE || 0.2),
      },
    });

    return response.message?.content || "";
  } catch (error) {
    console.error("Error calling Ollama:", error);
    throw new Error("Error calling Ollama", { cause: error });
  }
}