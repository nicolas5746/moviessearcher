import { scriptTag, selectedMovieClass, selectedMovieContainer, videoPlayerClass } from './global.js';
import { handleClassRemover, handleHideMenu, handleScrollToTop } from './handlers.js';

const onPlayerReady = (event) => {
    event.target.playVideo();
    handleHideMenu();
}

const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING || YT.PlayerState.PAUSED) handleHideMenu();
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

export const loadPlayerAPI = () => (window.YT) ? YT : createScriptTag();

export const videoPlayer = (key) => {
    handleScrollToTop();
    handleClassRemover(videoPlayerClass);
    selectedMovieClass[0].classList.add('hide');
    const videoPlayerElement = document.createElement('div');
    videoPlayerElement.classList.add('video-player', 'centered-flex');
    videoPlayerElement.innerHTML = `<div id='video-player'></div><a class='close-video' title='Close video'>close video</a>`;
    selectedMovieContainer.appendChild(videoPlayerElement);
    onYouTubeIframeAPIReady(key);
}