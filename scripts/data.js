import { tmdbAPIKey, tmdbDomain } from './global.js';
// Function to fetch movies with parameters
const fetchData = async (useFunction, path, params) => {
    const url = `${tmdbDomain}${path}?${params}api_key=${tmdbAPIKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        useFunction(data, response);
    } catch (err) {
        console.error(err.message);
        alert(`Error when trying to retrieve data from server.`);
    }
}

export default fetchData;