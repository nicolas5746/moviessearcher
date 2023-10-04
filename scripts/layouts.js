import fetchData from './data.js';
import {
    currentYear,
    genresListClass,
    imageNotFound,
    mainClass,
    moviesList,
    posterW500,
    posterW1280,
    resultsClass,
    searchInput,
    selectedMovie,
    thumbnails,
    youtubeLogo,
} from './global.js';
import { handleOnScrollDown, handlePlayTrailer, handleRemoveSpinner, handleScrollToTop } from './handlers.js';
import { loadPlayerAPI } from './player.js';

const spinner = (parentElement) => {
    const spinnerElement = document.createElement('div');
    spinnerElement.classList.add('spinner');
    spinnerElement.innerHTML =
        `<div></div>
        <div></div>`;
    parentElement.appendChild(spinnerElement);
}

const noResultsFounded = (response) => {
    while (resultsClass.length >= 1) {
        resultsClass[0].parentNode.removeChild(resultsClass[0]);
        if (resultsClass.length === 1) {
            break;
        }
    }
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

const movieCard = (movies, parentElement, childClass, infoClass, boolean = false) => {
    for (let i = 0; i < movies.length; i++) {
        const display = boolean;
        const movieOverview =
            (movies[i].overview.length >= 501)
                ?
                movies[i].overview.slice(0, 500) + '...'
                :
                (movies[i].overview.length >= 1)
                    ?
                    movies[i].overview
                    :
                    'This movie\'s plot is currently unavailable.';
        const posterSrc =
            (movies[i].poster_path != null)
                ?
                posterW500 + movies[i].poster_path
                :
                imageNotFound;
        const releaseDate =
            (movies[i].release_date)
                ?
                (movies[i].release_date.length >= 4)
                    ?
                    '(' + movies[i].release_date.slice(0, 4) + ')'
                    :
                    ''
                :
                '';
        const imgTitle =
            (movies[i].poster_path != null)
                ?
                movies[i].title + ' ' + releaseDate
                :
                'No picture available';
        const movieInfo = document.createElement('div');
        movieInfo.dataset.id = movies[i].id;
        movieInfo.classList.add(childClass);
        movieInfo.innerHTML = '';
        movieInfo.innerHTML =
            `<img
                alt='${movies[i].title}'
                src='${posterSrc}'
                title='${imgTitle}'
            />
            <div class='${infoClass}'>
                <h1>${movies[i].title}</h1>
                <h2>${releaseDate}</h2>
                ${(display)
                ?
                `<p>${movieOverview}</p>
                ${(movies[i].vote_average >= 1)
                    ?
                    `<h3>
                        <span class='rating-star'>★</span>
                        ${Math.round(movies[i].vote_average * 10) / 10}
                    </h3>`
                    :
                    ''}`
                :
                (movies[i].vote_average >= 1)
                    ?
                    `<h3>
                        <span class='rating-star'>★</span>
                        ${Math.round(movies[i].vote_average * 10) / 10}
                    </h3>`
                    :
                    ''}
            </div>`;
        parentElement.appendChild(movieInfo);
    }
}

const selectedMovieCard = (movie, response) => {
    const backdropSrc =
        (movie.backdrop_path != null)
            ?
            posterW1280 + movie.backdrop_path
            :
            imageNotFound;
    const releaseDate =
        (movie.release_date.length >= 4)
            ?
            '(' + movie.release_date.slice(0, 4) + ')'
            :
            'N/A';
    const imgTitle =
        (movie.backdrop_path != null)
            ?
            movie.title + ' ' + releaseDate
            :
            'No picture available';
    const movieCast =
        (movie.credits.cast.length >= 1)
            ?
            movie.credits.cast.slice(0, 4).map((cast) => {
                return cast.name;
            }).join(' - ')
            :
            'N/A';
    const spokenLanguages =
        (movie.spoken_languages.length >= 1)
            ?
            movie.spoken_languages.map((language) => {
                return language.english_name;
            }).join(' / ')
            :
            'N/A';
    const movieGenre =
        (movie.genres.length >= 1)
            ?
            movie.genres.map((genre) => {
                return genre.name;
            }).join(' - ')
            :
            'N/A';
    const movieOverview =
        (movie.overview.length >= 1)
            ?
            movie.overview
            :
            'This movie\'s plot is currently unavailable.';
    const movieTrailers =
        movie.videos.results.filter((result) => result.type == 'Trailer');
    const lastTrailer =
        movieTrailers[movieTrailers.length - 1];
    selectedMovie.innerHTML = '';
    const selectedMovieInfo = document.createElement('div');
    selectedMovieInfo.classList.add('selected-movie');
    selectedMovieInfo.innerHTML = '';
    selectedMovieInfo.innerHTML =
        `<img
            alt='${movie.title}'
            src='${backdropSrc}?${window.crypto.getRandomValues(new Uint8Array(1))}'
            title='${imgTitle}'
        />
        <div class='selected-movie-info'>
            <h1>${movie.title}</h1>
            ${(movie.original_title.length >= 1 &&
            movie.original_title !== movie.title)
            ?
            `<h2>(${movie.original_title})</h2>`
            :
            ''}
            ${(movie.tagline.length >= 1)
            ?
            `<h2>${movie.tagline}</h2>`
            :
            ''}
            <h3>Cast: ${movieCast}</h3>
            <h3>Genre: ${movieGenre}</h3>
            <h3>Language: ${spokenLanguages}</h3>
            <h3>Release date:
            ${(movie.release_date)
            ?
            movie.release_date
            :
            'N/A'}
            </h3>
            ${(movie.vote_average >= 1)
            ?
            `<h3>Rating:
                <span class='rating-star'>★</span>
                ${Math.round(movie.vote_average * 10) / 10}
            </h3>`
            :
            ''}
            <p>
                <span>Overview: </span>
                ${movieOverview}
            </p>
            ${((movie.videos.results.length && movieTrailers.length) >= 1)
            ?
            `<div class='movie-trailer'>
                <h3>Watch Trailer</h3>
                <img
                    id='watch-trailer'
                    alt='Watch Trailer'
                    src='${youtubeLogo}'
                    title='Watch Trailer'
                />
            </div>`
            :
            ''}
        </div>`;
    selectedMovie.appendChild(selectedMovieInfo);
    if (movieTrailers.length >= 1) {
        loadPlayerAPI();
        handlePlayTrailer(lastTrailer.key);
    }
}

const onLoadMovies = (movies, response) => {
    (movies.total_results >= 1)
        ?
        (handleRemoveSpinner(),
            moviesList.innerHTML += '',
            handleOnScrollDown(),
            movieCard(movies.results, moviesList, 'movie', 'latest-movie-info', true),
            displayDetails())
        :
        setTimeout(() => {
            handleRemoveSpinner();
            noResultsFounded(response);
        }, 5000);
}

const onSearchMovies = (movies, response) => {
    const input = (searchInput.value).trim();
    if (movies.total_results >= 1) {
        thumbnails.innerHTML = '';
        movieCard(movies.results, thumbnails, 'thumbnail', 'thumbnail-info', false);
        displayDetails();
        (input.length > 2)
            ?
            console.log(movies.results)
            :
            console.clear();
    }
}

const displayDetails = () => {
    const movieClasses = moviesList.querySelectorAll('.movie');
    const thumbnailClasses = thumbnails.querySelectorAll('.thumbnail');
    const scroller = document.querySelector('.scroll-to-top');
    const fetchMovieDetails = (movie) => {
        moviesList.innerHTML = '';
        scroller.classList.add('hide');
        spinner(selectedMovie);
        const path = `3/movie/${movie.dataset.id}`;
        const params = `append_to_response=videos,credits&`;
        fetchData(selectedMovieCard, path, params);
    }
    movieClasses.forEach((movie) => {
        movie.addEventListener('click', () => {
            handleScrollToTop();
            fetchMovieDetails(movie);
        });
    });
    thumbnailClasses.forEach((movie) => {
        movie.addEventListener('click', () => {
            searchInput.value = '';
            thumbnails.innerHTML = '';
            handleScrollToTop();
            fetchMovieDetails(movie);
        });
    });
}

export const moviesByGenderName = (genre) => {
    const genreListItem = document.createElement('li');
    genreListItem.classList.add('genre');
    genreListItem.innerText = genre;
    genresListClass[0].appendChild(genreListItem);
}

export const findMovies = () => {
    const input = (searchInput.value).trim();
    const path = `3/search/movie`;
    const params = `query=${input}&`;
    (input.length > 0)
        ?
        (thumbnails.classList.remove('hide'),
            moviesList.classList.add('opaquing'),
            fetchData(onSearchMovies, path, params))
        :
        (thumbnails.classList.add('hide'),
            moviesList.classList.remove('opaquing'));
}

export const displayMovies = (param = `year=${currentYear}`, subdir = 'discover') => {
    moviesList.innerHTML = '';
    selectedMovie.innerHTML = '';
    spinner(moviesList);
    for (let i = 1; i < 5; i++) {
        const path = `3/${subdir}/movie`;
        const params = `page=${i}&include_adult=false&sort_by=popularity.desc&${param}&`;
        fetchData(onLoadMovies, path, params);
    }
    handleScrollToTop();
}

export const scrollToTop = () => {
    const scroller = document.createElement('div');
    scroller.classList.add('scroll-to-top', 'hide');
    scroller.innerHTML =
        `<a>
            <span></span>
            <span></span>
            <span></span>
        </a>`;
    scroller.onclick = () => handleScrollToTop();
    mainClass[0].appendChild(scroller);
}