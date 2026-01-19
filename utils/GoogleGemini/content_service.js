import axios from 'axios';
const cheerio = require('cheerio');
import { geminiCall } from './geminiService';

//  fine tuned from gemini
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

export async function getKeywords(url) {
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

        const prompt = `Extract the top 15 to 20 SEO-relevant keywords from the following webpage text content:
            ${cleanText}
            `;
        const responseText = await geminiCall({ modelName: "gemini-2.0-flash", prompt , systemInstruction: getKeySystemInstruction});

        // 5. Process the response (same as before, but handle potential errors)
        const jsonString = responseText.replace(/```json\n/g, '').replace(/```/g, '');
        const keywords = JSON.parse(jsonString);
        return keywords; // Send JSON response

    } catch (error) {
        console.error('Error while extracting keywords', error);
        // return 'Error during content generation';
        throw new Error('Error while extracting keywords' , { cause: error }) ; 
    }   
}

export async function getCompetitors(url){
    const prompt = `Analyze the website at ${url}. Identify its main competitors based on its services, products, target audience, and business model. List at most three competitor website URLs in a JSON array. Do not include any other text or explanations.`;
    
    try{
        const response = await geminiCall({ modelName: "gemini-2.5-flash", prompt });
        console.log(response);

        const jsonString = response.replace(/```json\n/g, '').replace(/```/g, '');
        const competitorsUrls = JSON.parse(jsonString);
        return competitorsUrls; // Return the extracted URLs in the response.
       
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
        const response = await geminiCall({ modelName: "gemini-2.0-flash", prompt });
        const jsonString = response.replace(/```json\n/g, '').replace(/```/g, '');
        try {
            const ContentSuggestions = JSON.parse(jsonString);
            return ContentSuggestions;
        } catch (parseError) {
            console.error('Error parsing JSON. Returning raw text:', parseError);
            return response;
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
        const response = await geminiCall({ modelName: "gemini-2.5-flash", prompt });
        return response; // Return the generated content
    } catch (error) {
        console.error('Error generating article content:', error);
        throw new Error('Error during content generation', { cause: error }) ; 
    }
}