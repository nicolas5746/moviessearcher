import { tmdbAPIKey, tmdbDomain } from './global.js';

const controller = new AbortController();
const controllerSignal = controller.signal;
// Function to fetch movies with parameters
export const moviesRequest = async (customFunction, path, params) => {
    const url = `${tmdbDomain}${path}?${params}api_key=${tmdbAPIKey}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controllerSignal
        });
        const data = await response.json();
        customFunction(data, response);
    } catch (err) {
        console.error(err.message);
        alert(`Error while trying to retrieve data from server.`);
    }
}

export const cancelMoviesRequest = () => {
    controller.abort();
}