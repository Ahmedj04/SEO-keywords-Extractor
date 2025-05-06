export const extractKeywords = async (url) => {
    const response = await fetch('/api/getKeywords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    const data = await response.json();
    return data;
};

export function getMostImportantKeyword(keywords, url, metadataResponse) {
    if (!keywords || keywords.length === 0) {
        return "general search";
    }

    try {
        // const response = await fetch(`/api/getPageMetadata?url=${encodeURIComponent(url)}`); // Call the API route
        // const data = await response.json();
        const data = metadataResponse.data;
        const { title, description, bodyText } = data; // Get the data

        const keywordScores = {};

        keywords.forEach(keyword => {
            const lowerCaseKeyword = keyword.toLowerCase();
            let score = 0;

            if (title.includes(lowerCaseKeyword)) score += 3;
            if (description.includes(lowerCaseKeyword)) score += 2;
            const bodyFrequency = (bodyText.split(lowerCaseKeyword).length - 1);
            score += bodyFrequency;

            keywordScores[keyword] = score;
        });

        const sortedKeywords = Object.entries(keywordScores).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

        return sortedKeywords[0][0] || "general search";

    } catch (error) {
        console.error("Error fetching data in getMostImportantKeyword:", error);
        return keywords[0] || "general search";
    }
}