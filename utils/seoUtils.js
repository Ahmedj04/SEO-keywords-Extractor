import axios from "axios";

export const getTopRankingPages = async (keyword) => {
    const response = await fetch(`/api/searchTopPages?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
        throw new Error('Failed to fetch top ranking pages.');
    }
    const data = await response.json();
    return data.urls;
};

export const getCompetitorsUrls = async (url) => {    
    const response = await axios.post('/api/getCompetitors', {url}, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data.competitorUrls; 
};

export const generateContentSuggestions = async (metadataResponse, gapKeywords) =>{
    const response = await axios.post('/api/generateContentSuggestions', { metadataResponse , gapKeywords});
    return response.data;
}

export const generateArticleContent = async (title, keywords, wordCount) => {
    const response = await axios.post('/api/generateArticleContent', { title, keywords, wordCount }, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return response.data.content;
}