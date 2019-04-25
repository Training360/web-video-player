// VideoPlayer Class
// =================

import 'video.js/dist/lang/hu';
import '../lang/hu';
import 'videojs-contrib-quality-levels';
import 'videojs-hotkeys';
import 'videojs-seek-buttons';
import 'videojs-persist-settings/src/plugin';
import 'videojs-quality-selector/src/plugin';

class VideoPlayer {

    constructor(item) {
       this.player = videojs(item.id, {
            html5: {
                hls: {
                    withCredentials: true
                }
            },
            overrideNative: true,
            playbackRates: [1, 1.2, 1.5, 1.8]
        });
        this.player.ready(() => this.setHotKeys());
        this.player.qualitySelector();
        this.player.persistSettings({
            register: [
                { name:'playbackrate', event:'ratechange', get:this.player.playbackRate.bind(this.player) },
                { name:'quality', event:'qualitychange', set:this.player.qualityValue }
            ]
        });
        this.player.seekButtons({
            forward: 30,
            back: 10
        });
    }

    static getPlaybackRateIndex(rates, value) {
        var index = 0;
        for (var i = 0; i < rates.length; i++) {
            if (rates[i] == value) {
                index = i;
                break;
            }
        }
        return index;
    }

    setHotKeys() {
        this.player.hotkeys({
            alwaysCaptureHotkeys: true,
            enableVolumeScroll: false,
            // Override fullscreen to trigger when pressing the F key or Ctrl+Enter
            fullscreenKey: function(event, player) {
                return ((event.which === 70) || (event.ctrlKey && event.which === 13));
            },
            customKeys: {
                // Page Up = Higher playback rate
                pageUpKey: {
                    key: function(event) {
                      return (event.which === 33);
                    },
                    handler: function(player, options, event) {
                        var i = VideoPlayer.getPlaybackRateIndex(player.options_.playbackRates, player.playbackRate());
                        i = Math.min(i + 1, player.options_.playbackRates.length - 1);
                        player.playbackRate(player.options_.playbackRates[i]);
                    }
                },
                // Page Down = Lower playback rate
                pageDownKey: {
                    key: function(event) {
                        return (event.which === 34);
                    },
                    handler: function(player, options, event) {
                        var i = VideoPlayer.getPlaybackRateIndex(player.options_.playbackRates, player.playbackRate());
                        i = Math.max(i - 1, 0);
                        player.playbackRate(player.options_.playbackRates[i]);
                    }
                }
            }
        });
    }

    setVideo(url) {
        this.player.getChild('posterImage').setSrc(url.replace('master.m3u8', 'media-4/poster.jpg'));
        this.player.src({
            src: url,
            type: 'application/x-mpegURL'
        });
    }

    toggleControlBar() {
        this.player.el().classList.toggle('vjs-pinned-controls');
    }

}

export default VideoPlayer;