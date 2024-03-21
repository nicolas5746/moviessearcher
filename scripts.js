import { searchInput } from './scripts/global.js';
import { handleOnClickEvents, handleOnLoad, handleOnScrollEvents, handleOnSearch } from './scripts/handlers.js';
import { findMovies } from './scripts/layouts.js';

searchInput.addEventListener('click', findMovies);
searchInput.addEventListener('keyup', handleOnSearch);
window.addEventListener('click', handleOnClickEvents);
window.addEventListener('load', handleOnLoad);
window.addEventListener('scroll', handleOnScrollEvents);
window.addEventListener('touchmove', handleOnScrollEvents);