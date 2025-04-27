export const extractKeywords = async (url) => {
    const response = await fetch('/api/getKeywords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
    });

    const data = await response.json();

    // if (data.error) {
    //     throw new Error(data.error); // {"error": "Invalid or inaccessible URL"}
    // }
    return data.keywords;
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

// const getMostImportantKeyword = async (keywords, url) => {
//     if (!keywords || keywords.length === 0) {
//         return "general search";
//     }

//     // Prioritize keywords that appear in the title and meta description.
//     try {
//         const response = await fetch(`/api/getPageMetadata?url=${encodeURIComponent(url)}`);
//         const metadata = await response.json();

//         if (metadata.title) {
//             const titleKeywords = keywords.filter(keyword => metadata.title.toLowerCase().includes(keyword.toLowerCase()));
//             if (titleKeywords.length > 0) {
//                 return titleKeywords[0]; // Return the first title keyword
//             }
//         }

//         if (metadata.description) {
//             const descriptionKeywords = keywords.filter(keyword => metadata.description.toLowerCase().includes(keyword.toLowerCase()));
//             if (descriptionKeywords.length > 0) {
//                 return descriptionKeywords[0]; // Return the first description keyword
//             }
//         }
//     } catch (error) {
//         console.error("Failed to fetch page metadata:", error);
//         //  Don't block the keyword selection if metadata fetch fails.
//     }


//     //  For this example, we'll simply return the first keyword in the array, but this is NOT a robust solution.
//     return keywords[0];
// }