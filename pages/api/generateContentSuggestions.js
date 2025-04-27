import { generateContentSuggestions } from "@/utils/GoogleGemini/content_service";

export default async function handler(req, res) {
    try {
        const { metadataResponse, gapKeywords } = req.body;
        const suggestions = await generateContentSuggestions(metadataResponse, gapKeywords);
        res.status(200).json(suggestions);
    } catch (error) {
        console.log("Error message: ",error.message)
        res.status(500).json({ error: `Internal server error`});
    }
}


