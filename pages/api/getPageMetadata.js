import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Set a timeout for the axios request (in milliseconds)
        const timeout = 5000; // Example: 5 seconds
        // Fetch the HTML content of the URL
        const response = await axios.get(url, {
            timeout: timeout,
            // Add these headers to mimic a browser request
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'max-age=0',
            },
        });
        
        const html = response.data;
        res.status(200).json(html);
    } catch (error) {
        // console.error('Error fetching or parsing the page:', error);
        // res.status(500).json({ error: `Failed to fetch metadata: ${error.message}` });
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')){
            res.status(500).json({ error: `Request timed out. Please try again later.` });
        }
        else{
            // res.status(500).json({ error: `Failed to fetch metadata: ${error.message}` });
            res.status(500).json({ error: `The website is not reachable. Please check the URL and try again.`});
        }
    }
}
