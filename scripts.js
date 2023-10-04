import { searchInput } from './scripts/global.js';
import {
    handleOnClickEvents,
    handleOnLoad,
    handleOnScrollDown,
    handleOnSearch,
    handleScrollThumbnails
} from './scripts/handlers.js';
import { findMovies } from './scripts/layouts.js';

searchInput.addEventListener('click', findMovies);
searchInput.addEventListener('keyup', handleOnSearch);
searchInput.addEventListener('keydown', handleScrollThumbnails);
window.addEventListener('click', handleOnClickEvents);
window.addEventListener('load', handleOnLoad);
window.addEventListener('scroll', handleOnScrollDown);