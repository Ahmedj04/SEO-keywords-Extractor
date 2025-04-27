import axios from 'axios';
const cheerio = require('cheerio');
import { geminiCall } from './geminiService';

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


//SYSTEM PROMPT USED WHEN FINDING KEYWORDS BASED ON URL
// const systemPrompt = `You are a highly skilled SEO analyst AI. Your task is to process a given webpage URL by first validating it and then, if valid, extracting its most important SEO keywords based on its retrieved content.

// Follow these steps precisely:

// 1.  **URL Validation & Content Fetch Attempt (Mandatory First Step):**
//     *   Receive the input URL.
//     *   **Check Structural Validity:** Ensure the URL has a correct format and a recognized Top-Level Domain (TLD).
//     *   **Attempt Content Fetch:** Try to programmatically access the URL (like sending an HTTP GET request) to retrieve its content (primarily the raw HTML source code). This is **not** equivalent to rendering the page in a visual browser; complex JavaScript-rendered content might not be fully captured.
//     *   **Determine Validity:** The URL is considered **invalid or inaccessible** if:
//         *   It's structurally malformed (e.g., 'https://example.comic').
//         *   It fails DNS resolution (doesn't point to an IP address).
//         *   The content fetch attempt fails (e.g., connection timeout, 404 Not Found, 5xx Server Error, or blocked by robots.txt/server configuration).
//     *   **Output for Invalid/Inaccessible URL:** If the URL is deemed invalid or inaccessible based on the above, your *entire* response MUST be the following JSON object and nothing else:
//         \`\`\`json
//         {"error": "Invalid or inaccessible URL"}
//         \`\`\`
//     *   **Proceed if Valid & Accessible:** If the URL is structurally valid AND the content fetch attempt is successful (e.g., returns an HTTP 200 OK status with HTML content), proceed to Step 2.

// 2.  **Keyword Extraction (Only for Valid & Accessible URLs):**
//     *   Analyze the **retrieved textual content** (primarily the HTML source) from the valid URL.
//     *   Identify the 10 to 15 most important keywords relevant to the page's Search Engine Optimization (SEO).
//     *   Focus on keywords that strongly reflect the core topic and likely user search intent apparent in the fetched text.
//     *   Prioritize single-word or short-phrase keywords (typically 1-3 words).
//     *   Exclude overly generic stop words (e.g., "the", "a", "is", "and") and non-descriptive terms (e.g., "click here", "learn more") unless they are clearly part of a vital keyphrase within the analyzed content.

// 3.  **Output Formatting (Only for Valid & Accessible URLs):**
//     *   Return the identified keywords strictly as a JSON array of strings.
//     *   The response MUST contain *only* the raw JSON array.
//     *   Do NOT include any introductory text (e.g., "Here are the keywords:", "Analysis complete:").
//     *   Do NOT include any concluding text or explanations.
//     *   Do NOT use bullet points or numbered lists outside the JSON structure itself.
//     *   Ensure the output is well-formed, valid, and parsable JSON.

//     **Example Output for a Valid URL (keywords: "SEO", "keywords", "ranking"):**
//     \`\`\`json
//     ["SEO", "keywords", "ranking"]
//     \`\`\`

//     **Example Output for an Invalid or Inaccessible URL:**
//     \`\`\`json
//     {"error": "Invalid or inaccessible URL"}
//     \`\`\` `;

const getKeySystemInstruction = `You are a highly skilled SEO analyst AI. Your task is to process the provided webpage text and extract its most important SEO keywords.

Follow these steps precisely:

1. **Keyword Extraction:**
   - Analyze the provided textual content thoroughly.
   - Identify 15 to 20 of the most relevant keywords for Search Engine Optimization (SEO).
   - Focus on keywords that strongly align with the core topic and inferred user search intent.
   - Prioritize single-word (short-tail) or short-phrase (mid-tail, 1-3 words) keywords. Include long-tail keywords (4+ words) only if they are highly prominent and relevant.
   - Exclude overly broad or generic keywords unless they are critical to the content’s focus.
   - Filter out stop words (e.g., "the", "a", "is", "and") and non-descriptive terms (e.g., "click here", "learn more") unless integral to a keyphrase.
   - Consider keyword prominence (e.g., frequency, placement in headings, or emphasis) to determine importance.

2. **Output Formatting:**
   - Return the keywords as a JSON array of strings.
   - Output *only* the raw JSON array, with no additional text, explanations, or formatting (e.g., no "Here are the keywords:", no bullet points).
   - Ensure the JSON is valid, well-formed, and parsable.
   - List keywords in lowercase for consistency, unless capitalization is critical (e.g., proper nouns).

**Example Output:**
\`\`\`json
["seo", "keywords", "ranking", "search intent"]
\`\`\``;

// Initialize the Generative AI model
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" ,systemInstruction: systemPrompt});
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" ,systemInstruction: systemPrompt});
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" ,systemInstruction: systemPrompt});

export async function getKeywords(url) {

    // const prompt = `Extract the top 10 to 15 keywords related to SEO from the content of the webpage at the following URL: ${url}
      
    //   I need a concise list of keywords that an SEO expert would consider most important for understanding this page's search relevance. 
    //   Do not include any extra text before or after the list.
    //   `;
  
    //   try {
    //     const result = await model.generateContent([prompt]);
    //     const responseText = result.response.candidates[0].content.parts[0].text;

    //     // Remove the ```json and ``` tags, and then parse the JSON string
    //     const jsonString = responseText.replace(/```json\n/g, '').replace(/```/g, '');
    //     try {
    //         const keywords = JSON.parse(jsonString);
    //         return keywords;
    //     } catch (parseError) {
    //         console.error('Error parsing JSON. Returning raw text:', parseError);
    //         return responseText; // Return the raw text if JSON parsing fails
    //     }
    // } catch (error) {
    //     console.error('Error during content generation:', error);
    //     return 'Error during content generation';
    // }


    try {
        // 1. Fetch the website content
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'max-age=0',
            }
        });

        const html = response.data;

        // 2. Extract the text content.  This is crucial for feeding clean text to the model.
        const $ = cheerio.load(html);
        // Remove script and style tags, and get the text.
        const text = $('body').clone()    
            .find('script, style').remove().end()
            .text();
        const cleanText = text.replace(/\s+/g, ' ').trim(); // Replace multiple spaces with single space

        const prompt = `Extract the top 15 to 20 keywords related to SEO from the following text content of a webpage: 
        
        ${cleanText}

        I need a concise list of keywords that an SEO expert would consider most important for understanding this page's search relevance. 
        Do not include any extra text before or after the list.
        `;

        // 4. Get keywords from the model
        const responseText = await geminiCall({ modelName: "gemini-2.0-flash", prompt , systemInstruction: getKeySystemInstruction});

        // 5. Process the response (same as before, but handle potential errors)
        const jsonString = responseText.replace(/```json\n/g, '').replace(/```/g, '');
        try {
            const keywords = JSON.parse(jsonString);
            return keywords; // Send JSON response
        } catch (parseError) {
            console.error('Error parsing JSON. Returning raw text:', parseError);
            return responseText; // Send raw text, and indicate it was not JSON.
        }
    } catch (error) {
        console.error('Error during the process:', error);
        return 'Error during content generation';
    }   
}


export async function getCompetitors(url){
    const prompt = `Analyze the website ${url}. Based on its services, products, target audience, and business model, identify at most three main competitors. Provide the URLs of these competitor websites in an array structure (required). Do not include explanations.`;
    
    try{
        const response = await geminiCall({ modelName: "gemini-2.5-flash-preview-04-17", prompt });

        const jsonString = response.replace(/```json\n/g, '').replace(/```/g, '');
        try {
            const competitorsUrls = JSON.parse(jsonString);
            return competitorsUrls; // Return the extracted URLs in the response.
        } catch (parseError) {
            console.error('Error parsing JSON. Returning raw text:', parseError);
            return response; // Send raw text, and indicate it was not JSON.
        }
    } catch (error){
        return 'Error during content generation:', error;
    }
}
// Given the following HTML content of a webpage:
//  Use LLM to generate content optimization suggestions
export const generateContentSuggestions = async (metadata, gapKeywords) => {
    // Placeholder: Replace this with your actual LLM API call (e.g., Gemini)
    // 1.  Prepare the prompt, incorporating the HTML and gap keywords
    // const prompt = `
        
    //     Given the following MetaData of a webpage:
        
    //     ${metadata}
        
    //     And the following list of keywords that are missing from this page but present in top-ranking pages (keyword gaps):
        
    //     ${gapKeywords.join(', ')}
        
    //     Generate a list of content optimization suggestions to incorporate these missing keywords into the content. 
        
    //     Provide each suggestion as a JSON object with the following properties:
    //     - type: (e.g., "heading", "paragraph", "general")
    //     - keyword: (the missing keyword)
    //     - text: (a detailed suggestion on how to incorporate the keyword, including specific examples and context)
    //     - priority: (1 for high, 2 for medium, 3 for low)
        
    //     Example output:
    //     [
    //         {
    //             "type": "heading",
    //             "keyword": "Intelligent Automation",
    //             "text": "Add a new H2 or H3 heading titled 'The Rise of Intelligent Automation' to discuss how AI-powered automation is transforming business processes.",
    //             "priority": 1
    //         },
    //         {
    //             "type": "paragraph",
    //             "keyword": "process mining",
    //             "text": "Incorporate 'process mining' into the section discussing process analysis. Explain how process mining tools can help identify automation opportunities.",
    //             "priority": 2
    //         },
    //          {
    //             "type": "general",
    //             "keyword": "RPA",
    //             "text": "Expand the content to include a section on Robotic Process Automation (RPA) and its role in intelligent automation.",
    //             "priority": 1
    //         }
    //     ]
    // `;
    const prompt = `
        Given the MetaData content of a webpage:

        ${metadata}

        And a list of keywords missing from this page but present in top-ranking pages (keyword gaps):

        ${gapKeywords.join(', ')}

        Provide a concise, high-level content optimization strategy to improve the page's relevance and comprehensiveness for these missing keywords.

        The strategy should be a single paragraph. Do not list individual keywords or suggest specific placements. Focus on the overall content direction.

        Specifically:

        1.  Identify the main themes or concepts represented by the missing keywords.
        2.  Suggest creating new sections or expanding existing ones to cover these themes.
        3.  Emphasize providing valuable, informative content that addresses user search intent related to the missing keywords.
        4.  Prioritize content that demonstrates expertise, authority, and trustworthiness (E-A-T).

        Example output:
        {
            "type": "general",
            "text": "To enhance this page's SEO performance, develop a content strategy that comprehensively addresses the themes of intelligent automation and related technologies. Create new sections or expand existing ones to provide in-depth information on how AI and machine learning are used to streamline business processes. Discuss specific applications and benefits, including the role of technologies like ABBYY, IDP, and process mining in delivering automation solutions. Emphasize how enterprise automation and digital transformation can be achieved through these technologies. Additionally, explain how low-code platforms and workflow automation contribute to business and document automation. Throughout, prioritize content that demonstrates expertise, authority, and trustworthiness regarding AI platforms, GenAI, document mining, analytics, ML, accuracy, enterprise AI, compliance, and security within the context of intelligent automation."
        }
    `;

    try {
        // const response = await geminiCall({ modelName: "gemini-2.5-flash-preview-04-17", prompt });
        const response = await geminiCall({ modelName: "gemini-2.0-flash", prompt });
        const jsonString = response.replace(/```json\n/g, '').replace(/```/g, '');
        try {
            const ContentSuggestions = JSON.parse(jsonString);
            return ContentSuggestions; // Return the extracted URLs in the response.
        } catch (parseError) {
            console.error('Error parsing JSON. Returning raw text:', parseError);
            return response; // Send raw text, and indicate it was not JSON.
        }
    } catch (error) {
        // console.error("Error generating content suggestions:", error);
        throw new Error('Error during content generation') ; 
    }
};