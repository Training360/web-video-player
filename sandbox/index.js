(function(window, videojs){

    function toggleControlBar(playerid) {
        videojs(playerid).el().classList.toggle('vjs-pinned-controls');
    }

    function setVideo(playerid, url) {
        var player = videojs(playerid);
        player.getChild('posterImage').setSrc(url.replace('master.m3u8', 'media-4/poster.jpg'));
        player.src({
            src: url,
            type: 'application/x-mpegURL'
        });
    }

    window.setVideo = setVideo;
    window.toggleControlBar = toggleControlBar;

})(window, videojs);