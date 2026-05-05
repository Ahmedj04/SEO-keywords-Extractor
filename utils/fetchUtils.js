import axios from 'axios';

export const fetchHtml = async (url) =>{
    const response = await axios.get(`/api/getPageMetadata?url=${encodeURIComponent(url)}`);
    return response;
}
