import { scriptTag, selectedMovie, selectedMovieClass, videoPlayerClass } from './global.js';
import { handleHideMenu, handleScrollToTop } from './handlers.js';

const onPlayerReady = (event) => {
    event.target.playVideo();
    handleHideMenu();
}

const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING || YT.PlayerState.PAUSED || YT.PlayerState.ENDED) {
        handleHideMenu();
    }
}

const onYouTubeIframeAPIReady = (key) => {
    let player;
    if (typeof (player) === 'undefined') {
        player = new window['YT'].Player('video-player', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
            height: '390',
            host: 'https://www.youtube.com',
            origin: window.location.origin,
            playerVars: { 'autoplay': 1, 'controls': 1, 'enablejsapi': 1, 'rel': 0 },
            videoId: key,
            width: '640'
        });
    }
}

const createScriptTag = () => {
    const tag = document.createElement('script');
    tag.setAttribute('src', 'https://www.youtube.com/iframe_api');
    scriptTag[0].parentNode.insertBefore(tag, scriptTag[0]);
    document.head.appendChild(tag);
}

export const loadPlayerAPI = () => {
    (window.YT)
        ?
        YT
        :
        createScriptTag();
}

export const closeVideoPlayer = () => {
    handleScrollToTop();
    while (videoPlayerClass.length > 0) {
        videoPlayerClass[0].parentNode.removeChild(videoPlayerClass[0]);
        if (videoPlayerClass.length === 0) {
            break;
        }
    }
}

export const videoPlayer = (key) => {
    closeVideoPlayer();
    selectedMovieClass[0].classList.add('hide');
    const videoPlayerElement = document.createElement('div');
    videoPlayerElement.classList.add('video-player');
    videoPlayerElement.innerHTML =
        `<div id='video-player'></div>
        <a class='close-video' title='Close video'>close video</a>`;
    selectedMovie.appendChild(videoPlayerElement);
    onYouTubeIframeAPIReady(key);
}