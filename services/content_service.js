import axios from 'axios';
import { extractRelevantContent, extractJson } from '../utils/parserUtils';
import { ollamaCall, OLLAMA_FAST_MODEL, OLLAMA_SMART_MODEL, geminiCall , GEMINI_FAST_MODEL, groqCall, GROQ_FAST_MODEL, GROQ_SMART_MODEL } from '../llm';

export async function getKeywords(url) {
    const getKeySystemInstruction = `
        You are an expert SEO analyst.

        Analyze webpage content and extract high-quality SEO keywords based on topic relevance and user search intent.

        Output STRICT JSON only in this format:
        {
        "keywords": ["keyword1", "keyword2"],
        "topKeyword": "best keyword"
        }

        Rules:
        - Return 12–18 keywords
        - Keywords must be lowercase (except proper nouns)
        - No duplicates or near-duplicates
        - Focus on meaningful phrases, not single generic words
        - Balance short, medium, and long-tail keywords
        - Ignore stop words, navigation text, and irrelevant content
        - Keywords must reflect real user search intent
        - Select ONE topKeyword that best represents the page's main topic

        Do not include explanations or extra text.
    `;
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'max-age=0',
            }
        });
        const relevantContent = extractRelevantContent(response.data);
        const prompt = `Extract SEO keywords from this webpage:\n${relevantContent}`;

        // const responseText = await ollamaCall({ modelName: OLLAMA_FAST_MODEL, prompt , systemInstruction: getKeySystemInstruction, format: 'json'});
        const responseText = await groqCall({ modelName: GROQ_FAST_MODEL, prompt , systemInstruction: getKeySystemInstruction});
        
        const keywords = extractJson(responseText);
        return keywords; 

    } catch (error) {
        console.error('Error while extracting keywords', error);
        // return 'Error during content generation';
        throw new Error('Error while extracting keywords' , { cause: error }) ; 
    }   
}

export async function getCompetitors(url){
    const prompt = `
        You are an expert market analyst.

        Analyze the website: ${url}

        Identify DIRECT competitors (same product/service and target audience).

        Return STRICT JSON only in this exact format:
        {
            "competitorUrls": [
                "https://example1.com",
                "https://example2.com",
                "https://example3.com"
            ]
        }

        Rules:
        - Maximum 3 competitors
        - Only real, well-known competitors
        - URLs must be valid homepage URLs (include https://)
        - No explanations, no extra text, no markdown
        - Do not include anything except the JSON object
    `;
    
    try{
        // const response = await ollamaCall({ modelName: OLLAMA_SMART_MODEL, prompt, format: 'json' });
        // const response = await geminiCall({ modelName: GEMINI_FAST_MODEL, prompt});
        const response = await groqCall({ modelName: GROQ_SMART_MODEL, prompt});

        const competitorsUrls = extractJson(response);
        return competitorsUrls; // Return the extracted URLs in the response.
       
    } catch (error){
        // return 'Error during content generation:', error;
        throw new Error('Error while fetching competitors url', { cause: error }) ; 
    }
}

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
        const response = await ollamaCall({ modelName: OLLAMA_FAST_MODEL, prompt, format: 'json' });
        try {
            const ContentSuggestions = extractJson(response);
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
        const response = await ollamaCall({ modelName: OLLAMA_FAST_MODEL, prompt });
        return response; // Return the generated content
    } catch (error) {
        console.error('Error generating article content:', error);
        throw new Error('Error during content generation', { cause: error }) ; 
    }
}
