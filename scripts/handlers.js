import { moviesRequest } from './data.js';
import {
    currentYear, genreClass, genresBox, genresBtn, genresContainer, logo, menuBtn, menuToggle, menuTopicClass, moviesList,
    searchIcon, searchInput, selectedMovieClass, skeletonsSelector, thumbnails, title, videoPlayerClass
} from './global.js';
import { addMoviesPage, displayMovies, displaySearchResults, findMovies, moviesByGenderName, scrollToTop } from './layouts.js';
import { videoPlayer } from './player.js';

let displayByGenre = false;
let displayPremieres = false;
let genreId;
let scrollingIsDisabled = false;
let touchScrollingDown = false;
let touchStart;
let touchEnd;

const handleGenresById = (result) => {
    const genres = result.genres;

    for (let i = 0; i < genres.length; i++) {
        moviesByGenderName(`${genres[i].name}`);
        genreClass[i].onclick = () => displayMovies(`with_genres=${genres[i].id}&year=${currentYear}`);
        genreClass[i].setAttribute('title', genres[i].name);
        genreClass[i].setAttribute('id', 'genre-id-' + genres[i].id);
    }

    [...genreClass].forEach((genre, index) => {
        genre.addEventListener('click', () => {
            displayPremieres = false;
            displayByGenre = true;
            touchScrollingDown = false;
            genreId = genreClass[index].getAttribute('id').split('genre-id-')[1];
            handleHideMenu();
        });
    });
}

const handleMoviesByGender = () => {
    const path = `3/genre/movie/list`;
    const params = '';
    moviesRequest(handleGenresById, path, params);
}

const handleOnHoverEffects = () => {
    searchIcon.addEventListener('mouseover', () => {
        (searchInput.value.length >= 1) ? searchIcon.style.cursor = 'pointer' : searchIcon.style.removeProperty('cursor');
    });
}

const handleHideGenresList = () => {
    genresBox.style.left = '-100%';
    genresBtn.style.display = 'none';
    genresContainer.style.display = 'none';
}

const handleScrollThumbnails = () => {
    searchInput.addEventListener('keydown', (event) => {
        const { code } = event;

        (code === 'ArrowDown')
            ?
            thumbnails.scrollBy(0, 3)
            :
            (code === 'ArrowUp')
                ?
                thumbnails.scrollBy(0, -3)
                :
                (code === 'Backspace' || code === 'Enter' || code == 'Space' || code === 'ArrowLeft' || code === 'ArrowRight' || code === 'Delete')
                    ?
                    thumbnails.scrollBy(0, 0)
                    :
                    handleScrollToTop(thumbnails);
    });
}

export const handleHideMenu = () => {
    if (menuToggle.checked) {
        menuToggle.click();
        handleHideGenresList();
    }
}

const handleResetInitialValues = () => {
    displayByGenre = false;
    displayPremieres = false;
    scrollingIsDisabled = false;
    touchScrollingDown = false;
    handleHideMenu();
    handleScrollThumbnails();
    displayMovies();
    scrollToTop();
}

const handleBottomIsReached = () => {
    displayPremieres
        ?
        addMoviesPage(`&sort_by=primary_release_date.desc&language=en-US&year=${currentYear + 1}&`)
        :
        displayByGenre
            ?
            addMoviesPage(`&with_genres=${genreId}&year=${currentYear}&`)
            :
            addMoviesPage();
}

const handleDisplayPremieres = () => {
    displayByGenre = false;
    displayPremieres = true;
    touchScrollingDown = false;
    handleHideMenu();
    displayMovies(`&sort_by=primary_release_date.desc&language=en-US&year=${currentYear + 1}`);
}

export const handleClassRemover = (className) => {
    while (className.length >= 1) {
        className[0].parentNode.removeChild(className[0]);

        if (className.length === 0) {
            break;
        }
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
    const { clientX } = event;
    const { innerWidth } = window;
    const { id, className, classList } = event.target;

    if (menuToggle.checked) {
        // Multiplying by 100 to get percentage
        if (window.matchMedia('(width < 480px)').matches) {
            if ((clientX / innerWidth * 100) > 50) {
                handleHideMenu();
            }
        } else {
            if ((clientX / innerWidth * 100) > 40) {
                handleHideMenu();
            }
        }
    }

    if ((id === 'search-icon' || id === 'search-icon-circle') && input.length >= 1) {
        displaySearchResults();
    }

    if (id !== 'search-input') {
        thumbnails.classList.add('hide');
        moviesList.classList.remove('opaquing');
        skeletonsSelector.classList.remove('opaquing');
    }

    if (id === 'search-input' && input.length >= 1) {
        findMovies();
    }

    if (id === 'menu-toggle') {
        const scroller = document.querySelector('.scroll-to-top');
        const menuTitle = menuBtn.getAttribute('title');

        (scroller.style.display === 'none') ? scroller.style.removeProperty('display') : scroller.style.display = 'none';

        (menuTitle === 'Close') ? (menuBtn.setAttribute('title', 'Menu')) : menuBtn.setAttribute('title', 'Close');
    }

    if (id === 'genres-toggle') {
        handleHideGenresList();
    }

    if (id === 'genres-menu' || classList.contains('genres-box')) {
        genresBox.style.left = '0';
        genresBtn.style.display = 'flex';
        genresContainer.style.display = 'flex';
    }

    if (className === 'close-video') {
        handleScrollToTop();
        handleClassRemover(videoPlayerClass);
        selectedMovieClass[0].classList.remove('hide');
    }
}

export const handleOnSearch = (event) => {
    const input = (searchInput.value).trim();
    const { key } = event;

    (key === 'Backspace' || key === 'Enter' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowDown' || key === 'Delete')
        ?
        handleScrollThumbnails()
        :
        findMovies();

    if ((key === 'Backspace' || key === 'Delete') && input.length < 4) {
        findMovies();
    }

    if (key === 'Enter' & input.length >= 2) {
        displaySearchResults();
        moviesList.click();
    }
}

export const handlePlayTrailer = (key) => {
    handleScrollToTop();

    window.addEventListener('click', (event) => {
        if (event.target.id === 'watch-trailer') {
            videoPlayer(key);
        }
    });
}

export const handleOnLoad = () => {
    menuBtn.setAttribute('title', 'Menu');
    logo.onclick = () => handleResetInitialValues();
    menuTopicClass[0].onclick = () => handleResetInitialValues();
    menuTopicClass[1].onclick = () => handleDisplayPremieres();
    title.onclick = () => handleResetInitialValues();

    handleMoviesByGender();
    handleOnHoverEffects();
    handleResetInitialValues();
}

const handleDisableTouchScrolling = (event) => {
    event.stopPropagation();
    return false;
}

export const handleDisableScrolling = () => {
    const { scrollX, scrollY } = window;

    window.onscroll = () => {
        window.scrollTo(scrollX, scrollY);
    }
    window.addEventListener('touchmove', handleDisableTouchScrolling);
    scrollingIsDisabled = true;
}

export const handleEnableScrolling = () => {
    window.onscroll = null;
    window.removeEventListener('touchmove', handleDisableTouchScrolling);
    scrollingIsDisabled = false;
}

export const handleOnScrollEvents = () => {
    const scroller = document.querySelector('.scroll-to-top');
    const { scrollY } = window;
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    (scrollY >= 600) ? scroller.classList.remove('hide') : scroller.classList.add('hide');

    window.addEventListener('touchstart', (event) => {
        touchStart = event.changedTouches[0].clientY;
    });

    window.addEventListener('touchend', (event) => {
        touchEnd = event.changedTouches[0].clientY;
        // Touch down
        if (touchStart > touchEnd) {
            touchScrollingDown = true;
        }
        // Touch up
        if (touchStart <= touchEnd) {
            touchScrollingDown = false;
        }
    });

    if (Math.abs(scrollTop + clientHeight > scrollHeight - 1) && scrollY > 0 && !scrollingIsDisabled) {
        handleBottomIsReached();
    }

    if (touchScrollingDown) {
        if (scrollY > scrollHeight - (clientHeight + 100)) {
            handleBottomIsReached();
        }
    }
}