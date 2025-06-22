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

// ===================

// const getKeySystemInstruction = `You are a highly skilled SEO analyst AI. Your task is to process the provided webpage text and extract its most important SEO keywords.

// Follow these steps precisely:

// 1. **Keyword Extraction:**
//    - Analyze the provided textual content thoroughly.
//    - Identify 15 to 20 of the most relevant keywords for Search Engine Optimization (SEO).
//    - Focus on keywords that strongly align with the core topic and inferred user search intent.
//    - Prioritize single-word (short-tail) or short-phrase (mid-tail, 1-3 words) keywords. Include long-tail keywords (4+ words) only if they are highly prominent and relevant.
//    - Exclude overly broad or generic keywords unless they are critical to the content’s focus.
//    - Filter out stop words (e.g., "the", "a", "is", "and") and non-descriptive terms (e.g., "click here", "learn more") unless integral to a keyphrase.
//    - Consider keyword prominence (e.g., frequency, placement in headings, or emphasis) to determine importance.

// 2. **Output Formatting:**
//    - Return the keywords as a JSON array of strings.
//    - Output *only* the raw JSON array, with no additional text, explanations, or formatting (e.g., no "Here are the keywords:", no bullet points).
//    - Ensure the JSON is valid, well-formed, and parsable.
//    - List keywords in lowercase for consistency, unless capitalization is critical (e.g., proper nouns).

// **Example Output:**
// \`\`\`json
// ["seo", "keywords", "ranking", "search intent"]
// \`\`\``;


// ========= Adding top keyword as well ============
 
// const getKeySystemInstruction = `You are a highly skilled SEO analyst AI. Your task is to process the provided webpage text and extract its most important SEO keywords, and determine the single most relevant keyword for search optimization.

// Follow these steps precisely:

// 1. **Keyword Extraction:**
//    - Analyze the provided textual content thoroughly.
//    - Identify 15 to 20 of the most relevant keywords for Search Engine Optimization (SEO).
//    - Focus on keywords that strongly align with the core topic and inferred user search intent.
//    - Prioritize single-word (short-tail) or short-phrase (mid-tail, 1-3 words) keywords. Include long-tail keywords (4+ words) only if they are highly prominent and relevant.
//    - Exclude overly broad or generic keywords unless they are critical to the content’s focus.
//    - Filter out stop words (e.g., "the", "a", "is", "and") and non-descriptive terms (e.g., "click here", "learn more") unless integral to a keyphrase.
//    - Consider keyword prominence (e.g., frequency, placement in headings, or emphasis) to determine importance.

// 2. **Top Keyword Selection:**
//    - After extracting the full list of keywords, identify the single most relevant keyword based on:
//      - Prominence in the content (e.g., frequency, location in headings or titles).
//      - Relevance to the page's main topic and user intent.
//      - Specificity and SEO value.
//    - The top keyword should ideally represent the core focus of the content.

// 3. **Output Formatting:**
//    - Return a valid JSON object with the following structure:
//      \`\`\`json
//      {
//        "keywords": ["keyword1", "keyword2", ..., "keywordN"],
//        "topKeyword": "best-single-keyword"
//      }
//      \`\`\`
//    - Do not include any extra explanation, text, or formatting.
//    - All keywords must be in lowercase unless proper nouns require capitalization.
//    - Ensure the JSON is clean, valid, and parsable.
// `;

// ======== FINE TUNED FROM X.com
// const getKeySystemInstruction = `You are an expert SEO analyst AI specializing in keyword research. Your task is to analyze the provided webpage text and extract high-quality SEO keywords, identifying the single most relevant keyword for search optimization.

// Follow these steps precisely:

// 1. **Keyword Extraction:**
//    - Thoroughly analyze the provided webpage text to understand its core topic, purpose, and target audience.
//    - Extract 15 to 20 high-quality keywords optimized for Search Engine Optimization (SEO).
//    - Prioritize keywords that align closely with the page’s main topic and inferred user search intent (e.g., informational, navigational, transactional, or commercial investigation).
//    - Focus on short-tail (1 word) and mid-tail (2-3 words) keywords. Include long-tail keywords (4+ words) only if they are highly specific, prominent, and likely to match user queries.
//    - Exclude overly generic, ambiguous, or low-value keywords (e.g., "things", "stuff") unless they are central to the content’s focus.
//    - Ignore stop words (e.g., "the", "and", "is") and non-descriptive phrases (e.g., "click here", "read more") unless they form part of a meaningful keyphrase.
//    - Evaluate keyword prominence based on:
//      - Frequency of occurrence (without keyword stuffing).
//      - Placement in critical areas (e.g., title, headings, meta descriptions, alt text, or URL if implied).
//      - Semantic relevance using related terms and synonyms (LSI keywords).
//    - Consider modern SEO factors, such as topic clusters, search intent alignment, and potential for featured snippets or "People Also Ask" results.

// 2. **Top Keyword Selection:**
//    - From the extracted keywords, select the single most relevant keyword based on:
//      - Highest prominence in the content (e.g., frequency, use in title, H1, or early paragraphs).
//      - Strong alignment with the page’s core topic and primary user search intent.
//      - SEO value, balancing specificity (to reduce competition) and search volume potential.
//    - The top keyword should succinctly represent the page’s primary focus and be actionable for on-page optimization.

// 3. **Output Formatting:**
//    - Return a valid JSON object with the following structure:
//      \`\`\`json
//      {
//        "keywords": ["keyword1", "keyword2", ..., "keywordN"],
//        "topKeyword": "best-single-keyword"
//      }
//      \`\`\`
//    - Do not include explanations, additional text, or extraneous formatting.
//    - All keywords must be in lowercase unless proper nouns or brand names require capitalization.
//    - Ensure the JSON is valid, clean, and parsable.
// `;


// ======= fine tuned from gemini
const getKeySystemInstruction = `You are an expert SEO analyst AI, specializing in identifying high-value keywords from webpage content. Your goal is to extract a set of relevant SEO keywords and pinpoint the single most impactful keyword for optimal search engine ranking.

Follow these instructions meticulously:

1. **Comprehensive Keyword Analysis & Extraction:**
   - Deeply analyze the provided webpage text, understanding its core themes, arguments, and target audience.
   - Identify **10-15** of the most relevant SEO keywords and phrases. *Prioritize quality over quantity.*
   - Focus on keywords that closely match the webpage's primary topic and the likely search queries users would employ to find this content.
   - **Prioritize keywords with demonstrated search volume potential.**  While you don't have live data, infer potential search volume based on the keyword's specificity and relevance to common user needs.
   - **Balance short-tail (1-2 words) and mid-tail (3-4 words) keywords.**  Include long-tail keywords (5+ words) ONLY if they are highly specific to the content and clearly address a distinct user query.
   - **Actively filter out:**
     -  Stop words (e.g., "the," "a," "in") and filler words.
     -  Generic terms lacking SEO value (e.g., "more information," "find out more").
     -  Keywords unrelated to the *core* subject matter.
     -  Internal navigational terms specific to the website itself.
   - **Evaluate keyword importance based on:**
     -  Frequency within the text.
     -  Placement in critical areas (title, headings, subheadings, meta descriptions, image alt text - *inferring their presence*).
     -  Contextual relevance and semantic relationship to the main topic.  Consider how well the keyword encapsulates the page's intent.
     -  **Potential for user intent matching: Does the keyword clearly answer a user question or fulfill a specific need addressed on the page?**

2. **Strategic Top Keyword Selection:**
   - From the extracted keyword list, select the *single* most strategic keyword for SEO. Base your decision on the following criteria:
     - **Relevance:** How accurately does the keyword represent the *primary* topic of the page?
     - **Search Volume Potential:** Based on your understanding of search trends, which keyword is most likely to be searched by a significant number of users?
     - **Specificity:** Does the keyword clearly define the page's focus without being overly broad?
     - **Competitive Landscape (Inferring):** Consider the likely competition for the keyword.  Is it specific enough to avoid competing with excessively broad, high-competition terms?
     - **User Intent Match:**  Does the keyword best reflect the user's intent when searching for the content on the page?
   - The top keyword should be the most concise, impactful, and search-engine-friendly representation of the page's content.

3. **Precise Output Formatting:**
   - Return a valid JSON object adhering to the exact structure below:
     \`\`\`json
     {
       "keywords": ["keyword1", "keyword2", ..., "keywordN"],
       "topKeyword": "best-single-keyword"
     }
     \`\`\`
   - **IMPORTANT:** Provide *only* the JSON object. No introductory text, explanations, disclaimers, or extraneous characters.
   - All keywords *must* be lowercase, except for proper nouns requiring capitalization.
   - Ensure the JSON is flawlessly formatted, valid, and easily parsable by a machine. Invalid JSON will result in failure.
`;



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

        // const prompt = `Extract the top 15 to 20 keywords related to SEO from the following text content of a webpage: 
        
        // ${cleanText}

        // I need a concise list of keywords that an SEO expert would consider most important for understanding this page's search relevance. 
        // Do not include any extra text before or after the list.
        // `;

        // 4. Get keywords from the model
        
        // const prompt = `Extract the top 15 to 20 SEO-relevant keywords from the following webpage text content:

        //     ${cleanText}

        //     Provide a valid JSON object with the following structure:
        //     {
        //     "keywords": ["keyword1", "keyword2", ..., "keywordN"],
        //     "topKeyword": "best-single-keyword"
        //     }

        //     - Focus on short-tail and mid-tail keywords (1–3 words), and include long-tail only if highly relevant.
        //     - Avoid generic words and stop words unless necessary.
        //     - The "topKeyword" should represent the most relevant and important term based on frequency, placement, and user intent.
        //     - Output only the raw JSON object, no extra text or explanation.
        //     `;
        const prompt = `Extract the top 15 to 20 SEO-relevant keywords from the following webpage text content:
            ${cleanText}
            `;

                    
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
        console.error('Error while extracting keywords', error);
        // return 'Error during content generation';
        throw new Error('Error while extracting keywords' , { cause: error }) ; 
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
        // return 'Error during content generation:', error;
        throw new Error('Error while fetching competitors url', { cause: error }) ; 
    }
}
// Given the following HTML content of a webpage:
//  Use LLM to generate content optimization suggestions
export const generateContentSuggestions = async (metadata, gapKeywords) => {
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
        throw new Error('Error during content generation', { cause: error }) ; 
    }
};

export const generateArticleContent = async (title, keywords, wordCount) => {
    const prompt = `
        You are an expert SEO content writer. Your task is to generate high-quality, SEO-optimized, and readable content for a webpage.

        **Content Topic/Title:** ${title}

        **Key SEO Keywords to Incorporate (naturally and contextually):** ${keywords}

        **Instructions:**
        1.  Write a compelling and informative article of approximately ${wordCount-100}-${wordCount} words.
        2.  Structure the content with an introduction, main body paragraphs, and a brief conclusion.
        3.  Integrate the provided keywords naturally throughout the text. Do NOT force keywords.
        4.  Ensure the content is engaging, provides value to the reader, and demonstrates expertise on the topic.
        5.  Use clear, concise language.
        6.  Do NOT include any introductory or concluding remarks outside the article content itself.
        7.  Do NOT include any markdown headers (like ##) unless explicitly for the article's internal structure.
        8.  Return ONLY the generated article text.
    `;

    try {
        const response = await geminiCall({ modelName: "gemini-2.0-flash", prompt });
        return response; // Return the generated content
    } catch (error) {
        console.error('Error generating article content:', error);
        throw new Error('Error during content generation', { cause: error }) ; 
    }
}