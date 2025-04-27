import { getCompetitors } from "@/utils/GoogleGemini/content_service";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {url} = req.body;
        if (!url) {
            return res.status(400).json({ error: "url is required" });
        }

        try {
            const competitorsUrls = await getCompetitors(url);
            res.status(200).json({ competitorUrls: competitorsUrls }); // Send keywords response
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }

    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
