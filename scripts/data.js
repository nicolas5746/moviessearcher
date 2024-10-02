import { tmdbAPIKey, tmdbDomain } from './global.js';

const controller = new AbortController();
const controllerSignal = controller.signal;
// Function to fetch movies with parameters
export const moviesRequest = async (callback, path, params) => {
    const url = `${tmdbDomain}${path}?${params}api_key=${tmdbAPIKey}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            signal: controllerSignal
        });
        const data = await response.json();
        callback(data, response);
    } catch (error) {
        console.error(error.message);
        alert(`Error while trying to retrieve data from server.`);
    }
}

export const cancelMoviesRequest = () => {
    controller.abort();
}

export const getPortfolioURL = async (id) => {
    const url = 'https://api.npoint.io/0274475edb0f9685ef3d';
    await fetch(url)
        .then((response) => response.json())
        .then((response) => {
            id.innerHTML = response.url;
            id.setAttribute('href', response.url);
        })
        .catch((error) => console.error(error.message));
}