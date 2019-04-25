// TRAINING360 VIDEO PLAYER
// ========================

// Import dependencies, plugins
// ----------------------------

import './_globals.js';
import VideoPlayer from './_VideoPlayer';

// Initialize video elements with 'vjs-t360' class name
// ----------------------------------------------------

window.videoPlayers = [];
(function(window, videojs) {
    videojs.options.html5.nativeAudioTracks = false;
    videojs.options.html5.nativeVideoTracks = false;
    document.querySelectorAll('video.vjs-t360').forEach(
        (item) => {
            window.videoPlayers.push(new VideoPlayer(item));
        }
    )
})(window, videojs);
