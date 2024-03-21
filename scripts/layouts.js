import { moviesRequest } from './data.js';
import {
    additionalSkeletons, additionalSkeletonClass, additionalSkeletonsSelector, currentYear, genresList,
    imageNotFound, main, moviesList, posterW500, posterW1280, resultsClass, searchInput, selectedMovieClass,
    selectedMovieContainer, skeletons, skeletonsSelector, spinnerClass, thumbnails, youtubeLogo } from './global.js';
import { handleClassRemover, handleDisableScrolling, handleEnableScrolling, handlePlayTrailer, handleScrollToTop } from './handlers.js';
import { loadPlayerAPI } from './player.js';

let bottomIsReached = false;
let isSearching = false;
let pauseAddingMovies = false;
let searchQuery = '';
let startPage = 2;
let totalPages;

const spinner = (parentElement) => {
    const spinnerElement = document.createElement('div');
    spinnerElement.classList.add('spinner');
    spinnerElement.innerHTML = `<div></div><div></div>`;
    parentElement.appendChild(spinnerElement);
}

const cardSkeletons = () => {
    let skeleton;
    const skeletonHTML = `<div class='loading-skeleton'></div>`;

    if (window.matchMedia('(width >= 1600px)').matches) {
        skeleton = skeletonHTML.repeat(5);
    }

    if (window.matchMedia('(1024px <= width < 1600px)').matches) {
        skeleton = skeletonHTML.repeat(4);
    }

    if (window.matchMedia('(768px <= width < 1024px)').matches) {
        skeleton = skeletonHTML.repeat(3);
    }

    if (window.matchMedia('(480px <= width < 768px)').matches) {
        skeleton = skeletonHTML.repeat(2);
    }

    if (window.matchMedia('(width < 480px)').matches) {
        skeleton = skeletonHTML.repeat(1);
    }

    skeletons.innerHTML = skeleton;
    main.appendChild(skeletons);
}

const addSkeletons = () => {
    let skeleton;
    const skeletonHTML = `<div class='additional-skeleton'></div>`;

    if (window.matchMedia('(768px <= width < 1024px)').matches) {
        skeleton = skeletonHTML.repeat(3);
        additionalSkeletons.innerHTML = skeleton;
        main.appendChild(additionalSkeletons);

        if (startPage % 3 === 0) {
            additionalSkeletonClass[1].style.visibility = 'visible';
            additionalSkeletonClass[2].style.visibility = 'visible';
        }

        if (((startPage + 1) % 3) === 0) {
            additionalSkeletonClass[1].style.visibility = 'hidden';
            additionalSkeletonClass[2].style.visibility = 'visible';
        }

        if (((startPage + 2) % 3) === 0) {
            additionalSkeletonClass[1].style.visibility = 'hidden';
            additionalSkeletonClass[2].style.visibility = 'hidden';
        }
    } else {
        additionalSkeletonsSelector.style.display = 'none';
    }
}

const displaySkeletons = (display) => {
    (display)
        ?
        (additionalSkeletonsSelector.style.display = 'grid',
            skeletonsSelector.style.display = 'grid',
            bottomIsReached = true,
            addSkeletons())
        :
        (additionalSkeletonsSelector.style.display = 'none',
            skeletonsSelector.style.display = 'none',
            bottomIsReached = false);
}

const clearMovieList = () => {
    moviesList.innerHTML = '';
}

const noResultsFounded = (response) => {
    handleClassRemover(resultsClass);
    const results = document.createElement('div');
    results.classList.add('results');
    let status = response.status;

    switch (true) {
        case (status < 399):
            results.innerHTML = `<p>no results were found</p>`;
            break;
        case (status === 400):
            results.innerHTML = `<p>error 400</p><p>bad request</p>`;
            break;
        case (status === 401):
            results.innerHTML = `<p>error 401</p><p>unauthorized</p>`;
            break;
        case (status === 403):
            results.innerHTML = `<p>error 403</p><p>forbidden</p>`;
            break;
        case (status === 404):
            results.innerHTML = `<p>error 404</p><p>not found</p>`;
            break;
        case (status === 408):
            results.innerHTML = `<p>error 408</p><p>request timeout</p>`;
            break;
        case (status === 500):
            results.innerHTML = `<p>error 500</p><p>internal server error</p>`;
            break;
        case (status === 502):
            results.innerHTML = `<p>error 502</p><p>bad gateway</p>`;
            break;
        case (status === 503):
            results.innerHTML = `<p>error 503</p><p>service unavailable</p>`;
            break;
        case (status === 504):
            results.innerHTML = `<p>error 504</p><p>gateway timeout</p>`;
            break;
        default:
            results.innerHTML = `<p>something went wrong</p>`;
    }
    moviesList.appendChild(results);
}

const movieCard = (movies, parentElement, childClass, infoClass, overview = false) => {
    for (let i = 0; i < movies.length; i++) {
        const movie = movies.filter((value, index) => {
            return index === movies.findIndex((data) => value.id === data.id);
        });
        const movieOverview = (movie[i].overview.length >= 401) ? movie[i].overview.slice(0, 400) + '...' : (movie[i].overview.length >= 1) ? movie[i].overview : 'This movie\'s plot is currently unavailable.';
        const posterSrc = (movie[i].poster_path != null) ? posterW500 + movie[i].poster_path : (movie[i].backdrop_path != null) ? posterW500 + movie[i].backdrop_path : imageNotFound;
        const releaseDate = (movie[i].release_date) ? (movie[i].release_date.length >= 4) ? '(' + movie[i].release_date.slice(0, 4) + ')' : '' : '';
        const imgTitle = (movie[i].poster_path != null) ? movie[i].title + ' ' + releaseDate : 'No picture available';
        const movieTitle = (movie[i].title.length >= 101) ? movie[i].title.slice(0, 100) + '...' : movie[i].title;
        const movieInfo = document.createElement('div');
        movieInfo.dataset.id = movie[i].id;
        movieInfo.classList.add(childClass);
        (overview) ? movieInfo.classList.add('centered-flex', 'column') : movieInfo.classList.add('flex', 'row', 'align-items-center');
        movieInfo.innerHTML = '';
        movieInfo.innerHTML =
            `<img alt='${movie[i].title}' src='${posterSrc}' title='${imgTitle}' />
            <div class='${infoClass}'>
                <h1>${movieTitle}</h1>
                <h2>${releaseDate}</h2>
                ${(overview) ? `<p>${movieOverview}</p>` : ''}
                ${(movie[i].vote_average >= 1) ? `<h3><span class='rating-star'>★&nbsp;</span>${Math.round(movie[i].vote_average * 10) / 10}</h3>` : ''}
            </div>`;
        movieInfo.setAttribute('title', movie[i].title + ' ' + releaseDate);
        parentElement.appendChild(movieInfo);
    }
}

const selectedMovieCard = (movie) => {
    const backdropSrc = (movie.backdrop_path != null) ? posterW1280 + movie.backdrop_path : (movie.poster_path != null) ? posterW1280 + movie.poster_path : imageNotFound;
    const releaseDate = (movie.release_date.length >= 4) ? '(' + movie.release_date.slice(0, 4) + ')' : 'N/A';
    const imgTitle = (movie.backdrop_path != null) ? movie.title + ' ' + releaseDate : 'No picture available';
    const movieCast = (movie.credits.cast.length >= 1) ? movie.credits.cast.slice(0, 4).map((cast) => { return cast.name; }).join(' - ') : 'N/A';
    const spokenLanguages = (movie.spoken_languages.length >= 1) ? movie.spoken_languages.map((language) => { return language.english_name; }).join(' / ') : 'N/A';
    const movieGenre = (movie.genres.length >= 1) ? movie.genres.map((genre) => { return genre.name; }).join(' - ') : 'N/A';
    const movieOverview = (movie.overview.length >= 1) ? movie.overview : 'This movie\'s plot is currently unavailable.';
    const movieTrailers = movie.videos.results.filter((result) => result.type === ((result.type === 'Trailer') ? 'Trailer' : 'Teaser'));
    const lastTrailer = movieTrailers[movieTrailers.length - 1];
    selectedMovieContainer.innerHTML = '';
    const selectedMovieInfo = document.createElement('div');
    selectedMovieInfo.classList.add('selected-movie', 'centered-flex', 'column');
    selectedMovieInfo.innerHTML =
        `<img alt='${movie.title}' src='${backdropSrc}?${window.crypto.getRandomValues(new Uint8Array(1))}' title='${imgTitle}' />
        <div class='selected-movie-info centered-flex column'>
            <h1>${movie.title}</h1>
            ${(movie.original_title.length >= 1 && movie.original_title !== movie.title) ? `<h2>(${movie.original_title})</h2>` : ''}
            ${(movie.tagline.length >= 1) ? `<h2>${movie.tagline}</h2>` : ''}
            <h3>Cast:&nbsp;${movieCast}</h3>
            <h3>Genre:&nbsp;${movieGenre}</h3>
            <h3>Language:&nbsp;${spokenLanguages}</h3>
            <h3>Release date:&nbsp;${(movie.release_date) ? movie.release_date : 'N/A'}</h3>
            ${(movie.vote_average >= 1) ? `<h3>Rating:<span class='rating-star'>&nbsp;★&nbsp;</span>${Math.round(movie.vote_average * 10) / 10}</h3>` : ''}
            <p><span>Overview:&nbsp;</span>${movieOverview}</p>
            ${((movie.videos.results.length && movieTrailers.length) >= 1)
            ?
            `<div class='movie-trailer centered-flex column'>
                <h3>Watch Trailer</h3>
                <img id='watch-trailer' alt='Watch Trailer' src='${youtubeLogo}' title='Watch Trailer' />
            </div>`
            :
            ''}
        </div>`;
    selectedMovieContainer.appendChild(selectedMovieInfo);

    if (movieTrailers.length >= 1) {
        loadPlayerAPI();
        handlePlayTrailer(lastTrailer.key);
    }

    pauseAddingMovies = true;
    clearMovieList();
}

const onLoadMovies = (movies, response) => {
    (movies.total_results >= 1)
        ?
        (handleClassRemover(spinnerClass),
            clearMovieList(),
            movieCard(movies.results, moviesList, 'movie', 'latest-movie-info centered-flex column', true),
            displayDetails())
        :
        setTimeout(() => {
            handleClassRemover(spinnerClass);
            noResultsFounded(response);
        }, 5000);

    if (movies.total_results <= 20) {
        pauseAddingMovies = true;
    }
}

const onSearchMovies = (movies) => {
    const input = (searchInput.value).trim();

    if (movies.total_results >= 1) {
        thumbnails.innerHTML = '';
        movieCard(movies.results, thumbnails, 'thumbnail', 'thumbnail-info flex column', false);
        displayDetails();
        (input.length > 2) ? console.log(movies.results) : console.clear();
    }
}

const fetchMovieDetails = (movie) => {
    const scroller = document.querySelector('.scroll-to-top');
    const path = `3/movie/${movie.dataset.id}`;
    const params = 'append_to_response=videos,credits&';

    scroller.classList.add('hide');
    handleClassRemover(spinnerClass);
    displaySkeletons(false);
    spinner(selectedMovieContainer);

    (moviesList.innerHTML.trim() === '') ? moviesRequest(selectedMovieCard, path, params) : (clearMovieList(), moviesRequest(selectedMovieCard, path, params));
}

const displayDetails = () => {
    const movieClasses = moviesList.querySelectorAll('.movie');
    const thumbnailClasses = thumbnails.querySelectorAll('.thumbnail');

    movieClasses.forEach((movie) => {
        movie.addEventListener('click', () => {
            clearMovieList();
            fetchMovieDetails(movie);
        });
    });

    thumbnailClasses.forEach((movie) => {
        movie.addEventListener('click', () => {
            searchInput.value = '';
            thumbnails.innerHTML = '';
            clearMovieList();
            fetchMovieDetails(movie);
        });
    });
}

const addMovies = (movies) => {
    if (movies.total_results >= 1) {
        totalPages = movies.total_pages;
        movieCard(movies.results, moviesList, 'movie', 'latest-movie-info centered-flex column', true);
        displaySkeletons(false);
        displayDetails();
        handleEnableScrolling();

        if (selectedMovieClass.length > 0) {
            clearMovieList();
        }
    }
}

export const moviesByGenderName = (genre) => {
    const genreListItem = document.createElement('li');
    genreListItem.classList.add('genre');
    genreListItem.innerText = genre;
    genresList.appendChild(genreListItem);
}

export const findMovies = () => {
    const input = (searchInput.value).trim();
    const path = '3/search/movie';
    const params = `query=${input}&`;

    (input.length > 0)
        ?
        (thumbnails.classList.remove('hide'),
            moviesList.classList.add('opaquing'),
            skeletons.classList.add('opaquing'),
            moviesRequest(onSearchMovies, path, params))
        :
        (thumbnails.classList.add('hide'),
            moviesList.classList.remove('opaquing'),
            skeletons.classList.remove('opaquing'));
}

export const addMoviesPage = (param = `sort_by=popularity.desc&year=${currentYear}|${currentYear - 1}&`) => {
    const path = (isSearching) ? '3/search/movie' : '3/discover/movie';
    const params = `page=${startPage}&include_adult=false&${isSearching ? `query=${searchQuery}&` : param}`;

    if ((startPage > totalPages) || pauseAddingMovies) {
        displaySkeletons(false);
    } else if (!bottomIsReached) {
        displaySkeletons(true);
        if (bottomIsReached) {
            startPage = startPage + 1;
            handleDisableScrolling();
            cardSkeletons();
            moviesRequest(addMovies, path, params);
        }
    }
}

export const displayMovies = (param = `sort_by=popularity.desc&year=${currentYear}|${currentYear - 1}`, subdir = 'discover') => {
    selectedMovieContainer.innerHTML = '';
    clearMovieList();
    displaySkeletons(false);
    spinner(moviesList);

    for (let i = 1; i < 2; i++) {
        const path = `3/${subdir}/movie`;
        const params = `page=${i}&include_adult=false&${param}&`;
        moviesRequest(onLoadMovies, path, params);
    }

    startPage = 2;
    isSearching = false;
    pauseAddingMovies = false;
    handleScrollToTop();
}

export const displaySearchResults = () => {
    const param = `query=${searchInput.value}`;
    const subdir = 'search';
    searchQuery = searchInput.value;
    searchInput.value = '';
    thumbnails.innerHTML = '';
    displayMovies(param, subdir);
    isSearching = true;
}

export const scrollToTop = () => {
    const scroller = document.createElement('div');
    scroller.classList.add('scroll-to-top', 'hide');
    scroller.innerHTML = `<a><span></span><span></span><span></span></a>`;
    scroller.onclick = () => handleScrollToTop();
    main.appendChild(scroller);
}