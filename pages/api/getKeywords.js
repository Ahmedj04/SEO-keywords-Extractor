import { getKeywords } from "@/utils/GoogleGemini/content_service";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        try {
            const result = await getKeywords(url);
            // res.status(200).json({ keywords: result }); // Send keywords response
            res.status(200).json(result); // Send keywords response
        } catch (error) {
            console.log("Error coming from content_service getKeyword function: ",error)
            res.status(500).json({ error: 'Internal Server Error', errorDetail: error.cause });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
