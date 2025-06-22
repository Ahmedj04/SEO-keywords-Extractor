import { generateArticleContent } from "@/utils/GoogleGemini/content_service";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { title, keywords, wordCount } = req.body;

    if (!title || !keywords) {
        return res.status(400).json({ error: 'Title and keywords are required.' });
    }

    try {
        const generatedArticleContent = await generateArticleContent(title, keywords, wordCount);
        res.status(200).json({ content: generatedArticleContent });
    } catch (error) {
        console.error('Error calling Gemini API for content generation:', error);
        // Provide a more user-friendly error message
        res.status(500).json({ error: 'Failed to generate content. Please try again later.' });
    }
}
