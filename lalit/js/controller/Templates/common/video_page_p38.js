videoObject = {};
videoObject.activityCompleted = false;
videoObject.animdata = "";
videoObject.animPlayStatus = false;
videoObject.videoCompleted = false;
videoObject.animPauseStatus = false;
videoObject.videoStarted = false;
videoObject.isFullScreenBtnClicked = false;
var popupOpen = false;

//Mark Page Completed
videoObject.markPageComplete = function() {
    if (!videoObject.activityCompleted) {
        videoObject.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

//Audio Handler Completed
videoObject.pageAudioHandler = function(currTime, totTime) {
    if ((parseInt(currTime) != 0) && (parseInt(totTime) != 0)) {
        if (parseInt(currTime) >= parseInt(totTime)) {};
    };
};

//Init Screen - On Load
videoObject.initScreen = function(data) {
    TextImageObj1.initTextImage(data.textImageData);
    var alreadyPlayedVideoTime = DataManager.alreadyPlayedVideoTimeArray[currentPageLocationIndex];
    var videoFile = '' + DataManager.configData.course.courseFolder + '/media/video/' + DataManager.templateXMLData.data.animContent.video;
    var _width = '774px';
    var _height = '436px';

    try {
        if (data.size) {
            _width = data.size['width']
            _height = data.size['height']
        }
    } catch (err) {
        console.error(err)
    }
    $("#jquery_jplayer_video_page").jPlayer({
        ready: function() {
            $('#bottomNav_transcript').removeClass('disabled');
            $(this).jPlayer("setMedia", {
                m4v: videoFile + ".mp4"
            }).jPlayer("play");
            setTimeout(function() {
                //  MainController.initializeTemplateInShell();
                $(".jp-video-play").show();
                $("#jquery_jplayer_video_page").jPlayer("play");
            }, 200);
            setTimeout(function() {
                $(".jp-video-play").show();
            }, 1000);

            $(".jp-volume-controls .jp-mute").on("click", function() {
                AudioController.ManageAudio();
            });
        },
        swfPath: "libs/jplayer",
        supplied: "m4v",
        fullScreen: false,
        size: {
            width: _width,
            height: _height,
            cssClass: "jp-video-300p"
        },
        autohide: {
            restored: true,
            // Controls the interface autohide feature.
            full: true,
            // Controls the interface autohide feature.
            fadeIn: 200,
            // Milliseconds. The period of the fadeIn anim.
            fadeOut: 600,
            // Milliseconds. The period of the fadeOut anim.
            hold: 2000
                // Milliseconds. The period of the pause before autohide beings.
        },
        useStateClassSkin: true,
        autoBlur: false,
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: false,
        toggleDuration: false,
        enforceCompleteVideoView: true,
        alreadyPlayedVideoTimePercent: alreadyPlayedVideoTime,
        hideNavBandsOnFullscreen: true,
        topBandRef: "#header",
        bottomBandRef: "#footer",
        elementToHideWhenFullScreen: ".tabsContainer",
        cssSelector: {
            gui: ".jp-gui",
            // The interface used with autohide feature.
        },
        timeupdate: function(event) {
            // 4Hz
            // Restrict playback to first 60 seconds.
            $(".jp-video-play").hide();
            if (Math.floor(event.jPlayer.options.alreadyPlayedVideoTimePercent) > parseInt(DataManager.alreadyPlayedVideoTimeArray[currentPageLocationIndex])) {
                DataManager.alreadyPlayedVideoTimeArray[currentPageLocationIndex] = Math.floor(event.jPlayer.options.alreadyPlayedVideoTimePercent);
            }
            if (event.jPlayer.status.currentPercentAbsolute >= 99) {
                videoObject.markPageComplete();
            }
        },
        seeking: function(event) {
            // 4Hz
            //trace(event);
        },
        ended: function(event) {
            videoObject.videoCompleted = true;
            clearInterval(MainController.intervalValue);
            $("#loadingContainer").css("display", "none");
        },
        play: function(event) {
            videoObject.animPauseStatus = false;
            videoObject.animPlayStatus = true;
            DataManager.audioPausedByLearner = false;
            videoObject.lastPlayPos = 0;
            if (DeviceHandler.device != StaticLibrary.IPAD) {
                clearInterval(MainController.intervalValue);
                $("#loadingContainer").css("display", "none");
                MainController.intervalValue = setInterval(videoObject.checkBuffering, videoObject.checkInterval);
            }
        },
        pause: function(event) {
            if (!popupOpen) {
                DataManager.audioPausedByLearner = true;
            }
            videoObject.animPauseStatus = true;
            clearInterval(MainController.intervalValue);
            $("#loadingContainer").css("display", "none");
        }
    });
    setTimeout(function() {
        eventMgr.addControlEventListener(document, StaticLibrary.ON_PAGE_UNLOADED, videoObject.onPageUnloadedFromShell);

    }, 100);

    eventMgr.addControlEventListener(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, handleVideoControl);

};

videoObject.checkInterval = 500;
videoObject.lastPlayPos = 0;
videoObject.currentPlayPos = 0;
videoObject.bufferingDetected = false;
videoObject.checkBuffering = function() {

    videoObject.currentPlayPos = $("#jquery_jplayer_video_page").data("jPlayer").status.currentTime;
    var offset = 1 / videoObject.checkInterval;
    if (parseFloat(videoObject.currentPlayPos) <= parseFloat(videoObject.lastPlayPos)) {
        videoObject.bufferingDetected = true
    } else {
        videoObject.bufferingDetected = false;
    }

    if (videoObject.bufferingDetected == true || videoObject.bufferingDetected == "true") {
        $("#loadingContainer").css("display", "block");
    } else {
        $("#loadingContainer").css("display", "none");
    }
    videoObject.lastPlayPos = videoObject.currentPlayPos;
}

function handleVideoControl(state) {
    if (state.obj == "popupOpen") {
        popupOpen = true;
    } else {
        popupOpen = false;
    }
}

//On Page Unload Event
videoObject.onPageUnloadedFromShell = function() {
    eventMgr.removeControlEventListener(document, StaticLibrary.ON_PAGE_UNLOADED, videoObject.onPageUnloadedFromShell);
    $("#jquery_jplayer_video_page").jPlayer("destroy");
    //videoObject = null;
};

videoObject.PlayPauseAnimation = function() {
    if (!$('.jp-video-play').is(":visible") && !videoObject.videoCompleted) {
        if (videoObject.animPlayStatus) {
            $("#jquery_jplayer_video_page").jPlayer("pause");
            videoObject.animPlayStatus = false;
        } else {
            if (DataManager.audioPausedByLearner) {
                return;
            }
            if (videoObject.animPauseStatus && !homeBtnClicked) {
                $("#jquery_jplayer_video_page").jPlayer("play");
            }
            videoObject.animPlayStatus = true;
        };
    };
};

videoObject.notifyFullScreenTrigger = function() {
    videoObject.isFullScreenBtnClicked = true;
}

videoObject.notifyFullScreenExit = function() {
    videoObject.isFullScreenBtnClicked = false;
}