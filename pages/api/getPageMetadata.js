import axios from 'axios';
const cheerio = require('cheerio');

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

        // Use cheerio to parse the HTML and extract the title and description
        const $ = cheerio.load(html);
        const title = $('title').text().trim();
        const description = $('meta[name="description"]').attr('content')?.trim() || '';
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim().toLowerCase();
        const paragraphs = $('p').toArray().map(el => $(el).text().trim());
        const headings = $('h1, h2, h3').toArray().map(el => $(el).text().trim());

        res.status(200).json({ title, description, bodyText, paragraphs, headings });
    } catch (error) {
        // console.error('Error fetching or parsing the page:', error);
        // res.status(500).json({ error: `Failed to fetch metadata: ${error.message}` });
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')){
            res.status(500).json({ error: `Request timed out. The website took too long to respond. Please try again later.` });
        }
        else{
            // res.status(500).json({ error: `Failed to fetch metadata: ${error.message}` });
            res.status(500).json({ error: `The website is not reachable. Please check the URL and try again.`});
        }

        // if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     res.status(error.response.status).json({
        //         error: `Failed to fetch metadata: Server responded with ${error.response.status}`,
        //         details: error.response.data, // Optionally include response data for debugging
        //     });
        // } else if (error.request) {
        //     // The request was made but no response was received
        //     res.status(500).json({ error: 'Failed to fetch metadata: No response received from the server' });
        // } else {
        //     // Something happened in setting up the request that triggered an Error
        //     res.status(500).json({ error: `Failed to fetch metadata: ${error.message}` });
        // }
    }
}
