// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default function handler(req, res) {
//   res.status(200).json({ name: "John Doe" });
// }
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are a highly skilled SEO analyst. Your task is to identify the most important keywords on a webpage that are relevant to search engine optimization. 
    Return these keywords as a JSON array. 
    
    Important Considerations:
    * Focus on keywords that reflect the core topic and search intent of the page.
    * Prioritize single-word or short-phrase keywords.
    * Exclude very generic terms unless they are central to the page's SEO strategy.
    * Do not include any introductory or explanatory text in your response, only the raw JSON array.
    * Omit any numbered lists or bullet points in your response.
    * Ensure the JSON array is properly formatted and parsable.
    For example, if the key SEO keywords are "SEO", "keywords", and "ranking", return them as ["SEO", "keywords", "ranking"].`;

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" ,systemInstruction: systemPrompt});

async function getKeywords(url) {

    const prompt = `Extract the top 10 to 20 keywords related to SEO from the content of the webpage at the following URL: ${url}
      
      I need a concise list of keywords that an SEO expert would consider most important for understanding this page's search relevance. 
      Do not include any extra text before or after the list.
      `;
  
      try {
        const result = await model.generateContent([prompt]);
        const responseText = result.response.candidates[0].content.parts[0].text;
  
        // Remove the ```json and ``` tags, and then parse the JSON string
        const jsonString = responseText.replace(/```json\n/g, '').replace(/```/g, '');
        try {
            const keywords = JSON.parse(jsonString);
            return keywords;
        } catch (parseError) {
            console.error('Error parsing JSON. Returning raw text:', parseError);
            return responseText; // Return the raw text if JSON parsing fails
        }
  
  
    } catch (error) {
        console.error('Error during content generation:', error);
        return 'Error during content generation';
    }
}
  
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        try {
            const keywords = await getKeywords(url);
            res.status(200).json({ keywords: keywords });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
