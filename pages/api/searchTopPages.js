const { getJson } = require('serpapi');

export default async function handler(req, res) {
    const { keyword } = req.query;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'SERPAPI_API_KEY is not set in environment variables.' });
    }

    try {
        const result = await getJson({
            engine: 'google',
            q: keyword,
            api_key: apiKey,
        });
        // Extract the URLs from the organic results
        const urls = result.organic_results.slice(0, 3).map(item => item.link);
        res.status(200).json({ urls });
    } catch (error) {
        console.error('Error fetching from SerpAPI:', error);
        res.status(500).json({ error: 'Failed to fetch search results from SerpAPI.' });
    }
}
