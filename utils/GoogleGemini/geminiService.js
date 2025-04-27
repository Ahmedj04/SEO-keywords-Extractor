import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function geminiCall({modelName, prompt, systemInstruction}){
    try{
        const model = genAI.getGenerativeModel({ model: modelName ,systemInstruction: systemInstruction});
        const result = await model.generateContent([prompt]);
        return result.response.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return error; // Handle error within the function and return null
    }
    
}
