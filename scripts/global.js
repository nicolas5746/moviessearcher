// Elements by id
export const genres = document.getElementById('genres');
export const header = document.getElementById('header');
export const menuToggle = document.getElementById('menu-toggle');
export const moviesList = document.getElementById('movies');
export const searchInput = document.getElementById('search-input');
export const selectedMovie = document.getElementById('selected-movie');
export const thumbnails = document.getElementById('thumbnails');
// Elements by class
export const genreClass = document.getElementsByClassName('genre');
export const genresContainerClass = document.getElementsByClassName('genres-container');
export const genresListClass = document.getElementsByClassName('genres-list');
export const logoClass = document.getElementsByClassName('logo');
export const mainClass = document.getElementsByClassName('main');
export const menuTopicClass = document.getElementsByClassName('menu-topic');
export const resultsClass = document.getElementsByClassName('results');
export const searchIconClass = document.getElementsByClassName('search-icon');
export const selectedMovieClass = selectedMovie.getElementsByClassName('selected-movie');
export const spinnerClass = document.getElementsByClassName('spinner');
export const videoPlayerClass = selectedMovie.getElementsByClassName('video-player');
// Elements by tag
export const scriptTag = document.getElementsByTagName('script');
// The Movie Database domain and unique api key
export const tmdbAPIKey = '6b23018b5883cb6b4fe1552be8704bb7';
export const tmdbDomain = 'https://api.themoviedb.org/';
// Links to images
export const posterW500 = 'https://image.tmdb.org/t/p/w500';
export const posterW1280 = 'https://image.tmdb.org/t/p/w1280';
export const imageNotFound = 'https://i.postimg.cc/j5xvdTNW/image-not-found.png';
export const youtubeLogo = 'https://www.youtube.com/s/desktop/d7216197/img/favicon_48x48.png';
// Current year with Date JS method
export const currentYear = new Date().getFullYear();