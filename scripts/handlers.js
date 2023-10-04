import fetchData from './data.js';
import {
    currentYear,
    genres,
    genreClass,
    genresContainerClass,
    logoClass,
    menuToggle,
    menuTopicClass,
    moviesList,
    searchIconClass,
    searchInput,
    selectedMovie,
    selectedMovieClass,
    spinnerClass,
    thumbnails
} from './global.js';
import { displayMovies, findMovies, moviesByGenderName, scrollToTop } from './layouts.js';
import { closeVideoPlayer, videoPlayer } from './player.js';

const handleGenresById = (result, response) => {
    const genres = result.genres;
    for (let i = 0; i < genres.length; i++) {
        moviesByGenderName(`${genres[i].name}`);
        genreClass[i].onclick = () => displayMovies(`with_genres=${genres[i].id}&year=${currentYear}`);
    }
}

const handleMoviesByGender = () => {
    const path = `3/genre/movie/list`;
    const params = '';
    fetchData(handleGenresById, path, params);
}

const handleOnHoverEffects = () => {
    genres.addEventListener('mouseover', () => {
        genresContainerClass[0].style.display = '-moz-box';
        genresContainerClass[0].style.display = '-ms-flexbox';
        genresContainerClass[0].style.display = '-webkit-box';
        genresContainerClass[0].style.display = '-webkit-flex';
        genresContainerClass[0].style.display = 'flex';
    });
    genres.addEventListener('mouseout', () => {
        genresContainerClass[0].style.display = 'none';
    });
    searchIconClass[0].addEventListener('mouseover', () => {
        (searchInput.value.length >= 1)
            ?
            searchIconClass[0].style.cursor = 'pointer'
            :
            searchIconClass[0].style.removeProperty('cursor');
    });
}

const handleSearchMovies = () => {
    const param = `query=${searchInput.value}`;
    const subdir = `search`;
    searchInput.value = '';
    thumbnails.innerHTML = '';
    displayMovies(param, subdir);
}

export const handleHideMenu = () => {
    if (menuToggle.checked) {
        menuToggle.click();
    }
}

export const handleScrollToTop = (y = window) => {
    y.scroll({
        behavior: 'smooth',
        left: 0,
        top: 0
    });
}

export const handleOnClickEvents = (event) => {
    const input = (searchInput.value).trim();
    if ((event.target.id === 'search-icon' || event.target.id === 'search-icon-circle') && input.length >= 1) {
        handleSearchMovies();
    }
    if (event.target.id !== 'genres' && event.target.parentNode.className !== 'menu') {
        handleHideMenu();
    }
    if (event.target.id !== 'search-input') {
        thumbnails.classList.add('hide');
        moviesList.classList.remove('opaquing');
    }
    if (event.target.id === 'search-input' && input.length >= 1) {
        findMovies();
    }
    if (event.target.id === 'genres') {
        (genresContainerClass[0].style.display === 'flex')
            ?
            genresContainerClass[0].style.display = 'none'
            :
            genresContainerClass[0].style.display = 'flex';
    }
    if (event.target.id === 'menu-toggle') {
        const scroller = document.querySelector('.scroll-to-top');
        (scroller.style.display === 'none')
            ?
            scroller.style.removeProperty('display')
            :
            scroller.style.display = 'none';
    }
    if (!menuToggle.checked) {
        genresContainerClass[0].style.display = 'none';
    }
}

export const handleScrollThumbnails = (event) => {
    event = event || window.event;
    let key = event.which || event.keyCode || 0;
    (key == '40')
        ?
        thumbnails.scrollBy(0, 30)
        :
        (key == '38')
            ?
            thumbnails.scrollBy(0, -30)
            :
            (key == '8' || key == '13' || key == '32' || key == '37' || key == '39')
                ?
                thumbnails.scrollBy(0, 0)
                :
                handleScrollToTop(thumbnails);
}

export const handlePlayTrailer = (key) => {
    handleScrollToTop();
    selectedMovie.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.id === 'watch-trailer') {
            videoPlayer(key);
        }
        if (event.target.className === 'close-video') {
            closeVideoPlayer();
            selectedMovieClass[0].classList.remove('hide');
        }
    });
}

export const handleRemoveSpinner = () => {
    while (spinnerClass.length > 0) {
        spinnerClass[0].parentNode.removeChild(spinnerClass[0]);
        if (spinnerClass.length === 0) {
            break;
        }
    }
}

export const handleOnLoad = () => {
    logoClass[0].onclick = () => displayMovies();
    menuTopicClass[0].onclick = () => displayMovies();
    menuTopicClass[1].onclick = () => displayMovies(`&language=en-US&year=${currentYear + 1}`);
    handleMoviesByGender();
    handleOnHoverEffects();
    scrollToTop();
    displayMovies();
}

export const handleOnSearch = (event) => {
    event = event || window.event;
    let key = event.which || event.keyCode || 0;
    const input = (searchInput.value).trim();
    (key == '8' || key == '13' || key == '37' || key == '38' || key == '39' || key == '40')
        ?
        handleScrollThumbnails()
        :
        findMovies();
    if (key == '8' && input.length < 4) {
        findMovies();
    }
    if (key == '13' & input.length >= 2) {
        handleSearchMovies();
        moviesList.click();
    }
}

export const handleOnScrollDown = () => {
    const scroller = document.querySelector('.scroll-to-top');
    (window.scrollY >= 600)
        ?
        scroller.classList.remove('hide')
        :
        scroller.classList.add('hide');
}