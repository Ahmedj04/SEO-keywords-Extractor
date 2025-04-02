// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getKeywords } from "@/services/GoogleGemini/content_service";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        try {
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
