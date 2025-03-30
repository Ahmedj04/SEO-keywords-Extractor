// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { GoogleGenerativeAI } from '@google/generative-ai';

// const systemPrompt = `You are a highly skilled SEO analyst. Your task is to identify the most important keywords on a webpage that are relevant to search engine optimization. 
//     Return these keywords as a JSON array. 
    
//     Important Considerations:
//     * Focus on keywords that reflect the core topic and search intent of the page.
//     * Prioritize single-word or short-phrase keywords.
//     * Exclude very generic terms unless they are central to the page's SEO strategy.
//     * Do not include any introductory or explanatory text in your response, only the raw JSON array.
//     * Omit any numbered lists or bullet points in your response.
//     * Ensure the JSON array is properly formatted and parsable.
//     For example, if the key SEO keywords are "SEO", "keywords", and "ranking", return them as ["SEO", "keywords", "ranking"].`;

const systemPrompt = `You are a highly skilled SEO analyst AI. Your task is to process a given webpage URL by first validating it and then, if valid, extracting its most important SEO keywords based on its retrieved content.

Follow these steps precisely:

1.  **URL Validation & Content Fetch Attempt (Mandatory First Step):**
    *   Receive the input URL.
    *   **Check Structural Validity:** Ensure the URL has a correct format and a recognized Top-Level Domain (TLD).
    *   **Attempt Content Fetch:** Try to programmatically access the URL (like sending an HTTP GET request) to retrieve its content (primarily the raw HTML source code). This is **not** equivalent to rendering the page in a visual browser; complex JavaScript-rendered content might not be fully captured.
    *   **Determine Validity:** The URL is considered **invalid or inaccessible** if:
        *   It's structurally malformed (e.g., 'https://example.comic').
        *   It fails DNS resolution (doesn't point to an IP address).
        *   The content fetch attempt fails (e.g., connection timeout, 404 Not Found, 5xx Server Error, or blocked by robots.txt/server configuration).
    *   **Output for Invalid/Inaccessible URL:** If the URL is deemed invalid or inaccessible based on the above, your *entire* response MUST be the following JSON object and nothing else:
        \`\`\`json
        {"error": "Invalid or inaccessible URL"}
        \`\`\`
    *   **Proceed if Valid & Accessible:** If the URL is structurally valid AND the content fetch attempt is successful (e.g., returns an HTTP 200 OK status with HTML content), proceed to Step 2.

2.  **Keyword Extraction (Only for Valid & Accessible URLs):**
    *   Analyze the **retrieved textual content** (primarily the HTML source) from the valid URL.
    *   Identify the 10 to 20 most important keywords relevant to the page's Search Engine Optimization (SEO).
    *   Focus on keywords that strongly reflect the core topic and likely user search intent apparent in the fetched text.
    *   Prioritize single-word or short-phrase keywords (typically 1-3 words).
    *   Exclude overly generic stop words (e.g., "the", "a", "is", "and") and non-descriptive terms (e.g., "click here", "learn more") unless they are clearly part of a vital keyphrase within the analyzed content.

3.  **Output Formatting (Only for Valid & Accessible URLs):**
    *   Return the identified keywords strictly as a JSON array of strings.
    *   The response MUST contain *only* the raw JSON array.
    *   Do NOT include any introductory text (e.g., "Here are the keywords:", "Analysis complete:").
    *   Do NOT include any concluding text or explanations.
    *   Do NOT use bullet points or numbered lists outside the JSON structure itself.
    *   Ensure the output is well-formed, valid, and parsable JSON.

    **Example Output for a Valid URL (keywords: "SEO", "keywords", "ranking"):**
    \`\`\`json
    ["SEO", "keywords", "ranking"]
    \`\`\`

    **Example Output for an Invalid or Inaccessible URL:**
    \`\`\`json
    {"error": "Invalid or inaccessible URL"}
    \`\`\` `;

// Initialize the Generative AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" ,systemInstruction: systemPrompt});
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" ,systemInstruction: systemPrompt});

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
            // const keywords = await getKeywords(url);
            // res.status(200).json({ keywords: keywords });
            const result = await getKeywords(url);
            if (result && result.error) {
                return res.status(200).json(result); // Send error response
            }
            res.status(200).json({ keywords: result }); // Send keywords response
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
