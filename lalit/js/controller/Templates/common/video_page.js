videoObject = {};
videoObject.activityCompleted = false;
videoObject.animdata = "";
videoObject.animPlayStatus = false;
videoObject.videoCompleted = false;
videoObject.animPauseStatus = false;
videoObject.videoStarted = false;
videoObject.isFullScreenBtnClicked = false;
videoObject.pageAudioFinished = false;
videoObject.ignoreCompletion = false;

videoObject.checkInterval = 600;
videoObject.lastPlayPos = 0;
videoObject.currentPlayPos = 0;
videoObject.bufferingDetected = false;

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
        if (parseInt(currTime) >= parseInt(totTime)) {
            if (!videoObject.pageAudioFinished) {
                videoObject.pageAudioFinished = true;
                clearInterval(MainController.intervalValue);
                $("#loadingContainer").css("display", "none");
                $(".jp-video-play").hide().unbind();
                $("#jquery_jplayer_video_page").jPlayer("play");
                $("#bottomNav_audio").addClass("disabled");
            }
        };
    };
};

//Init Screen - On Load
videoObject.initScreen = function(data) {

    TextImageObj1.initTextImage(data.textImageData);
    var _static_path = '/media/video/';
    if (data['animContent']['isAbsolute']) {
        _static_path = data['basePath']
    }
    var alreadyPlayedVideoTime = DataManager.alreadyPlayedVideoTimeArray[currentPageLocationIndex];
    var videoFile = '' + DataManager.configData.course.courseFolder + _static_path + DataManager.templateXMLData.data.animContent.video;
    var _width = '600px';
    var _height = '338px';
    try {
        if (data.size) {
            _width = data.size['width']
            _height = data.size['height']
        }
    } catch (err) {
        console.error(err)
    }

    var _videoHolder = $("#jquery_jplayer_video_page")

    _videoHolder.jPlayer({
        ready: function() {
            $('#bottomNav_transcript').removeClass('disabled');
            $(this).jPlayer("setMedia", {
                m4v: videoFile + ".mp4"
            }).jPlayer("stop");

            setTimeout(function() {
                MainController.initializeTemplateInShell();
                $(".jp-video-play").hide().unbind();
                _videoHolder.jPlayer("stop");
                if (_width >= "774px") {
                    $('#jp_container_1').parent().addClass('fullvideo')
                } else {
                    $('#jp_container_1').parent().removeClass('fullvideo')
                }
            }, MainController.pageInterval);

            try {
                setTimeout(function() {
                    $(".jp-video-play").hide().unbind();
                    clearInterval(MainController.intervalValue);
                    $("#loadingContainer").css("display", "none");
                    if (DataManager.audioFileName == "blank") {
                        videoObject.pageAudioFinished = true;
                        videoObject.videoCompleted = false;
                        _videoHolder.jPlayer("play");
                        $("#bottomNav_audio").addClass("disabled");

                        $("#navigatorPlayPauseBtn").html("<span>Play</span>");
                        $("#navigatorPlayPauseBtn").attr("title", "");
                        $("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
                    }
                }, 1000);

                $(".jp-volume-controls .jp-mute").on("click", function() {
                    AudioController.ManageAudio();
                });

            } catch (err) {

            }
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

            try {
                var _time = {
                        'cTime': $(".videoTimer .jp-current-time").text(),
                        'tTime': $(".videoTimer .jp-duration").text()
                    }
                    // console.log("timeupdate: ", _time);
                _videoHolder.trigger('customTimeUpdate', _time)
            } catch (err) {
                console.log(err)
            }
        },

        seeking: function(event) {},
        ended: function(event) {
            videoObject.videoCompleted = true;
            clearInterval(MainController.intervalValue);
            $("#loadingContainer").css("display", "none");
            _videoHolder.trigger('customEnded');
        },
        play: function(event) {

            videoObject.videoCompleted = false;
            videoObject.animPauseStatus = false;
            videoObject.animPlayStatus = true;

            videoObject.videoCompleted = false;
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
    }, 20);

    eventMgr.addControlEventListener(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, handleVideoControl);

};


//Init Screen - On Load
videoObject.initScreen_1 = function(data) {

    var __videoHolder = $("#jquery_jplayer_video_page");
    try {
        __videoHolder.jPlayer("destroy");
    } catch (err) {

    }

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

    var _videoHolder = $("#jquery_jplayer_video_page")

    if (_width >= "774px") {
        $('#jp_container_1').parent().addClass('fullvideo')
    } else {
        $('#jp_container_1').parent().removeClass('fullvideo')
    }

    _videoHolder.jPlayer({
        ready: function() {
            $('#bottomNav_transcript').removeClass('disabled');
            $(this).jPlayer("setMedia", {
                m4v: videoFile + ".mp4"
            }).jPlayer("play");




            try {
                setTimeout(function() {
                    $(".jp-video-play").hide();
                    clearInterval(MainController.intervalValue);
                    $("#loadingContainer").css("display", "none");
                    $("#bottomNav_audio").addClass("disabled");
                    videoObject.videoCompleted = false;
                }, 1000);
            } catch (err) {

            }

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


            if (event.jPlayer.status.currentPercentAbsolute >= 99 && !videoObject.ignoreCompletion) {
                videoObject.markPageComplete();
            }

            try {

                var _time = {
                    'cTime': $(".videoTimer .jp-current-time").text(),
                    'tTime': $(".videoTimer .jp-duration").text()
                }

                //  console.log("timeupdate: ", _time);
                _videoHolder.trigger('customTimeUpdate', _time)

            } catch (err) {
                console.log(err)
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
            _videoHolder.trigger('customEnded');
        },
        play: function(event) {
            videoObject.animPauseStatus = false;
            videoObject.animPlayStatus = true;
            DataManager.audioPausedByLearner = false;
            videoObject.lastPlayPos = 0;
            videoObject.videoCompleted = false;

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
        },
        mute: function(event) {
            alert()
        }
    });

    setTimeout(function() {
        eventMgr.addControlEventListener(document, StaticLibrary.ON_PAGE_UNLOADED, videoObject.onPageUnloadedFromShell);
    }, 20);


    eventMgr.addControlEventListener(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, handleVideoControl);


};

//Init Screen - On Load
videoObject.updateVideo = function(data) {

    var _static_path = '/media/video/';

    if (data['animContent']['isAbsolute']) {
        _static_path = data['basePath']
    }
    var videoFile = '' + DataManager.configData.course.courseFolder + _static_path + data.video;

    var _videoHolder = $("#jquery_jplayer_video_page");

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

    if (_width >= "774px") {
        $('#jp_container_1').parent().addClass('fullvideo')
    } else {
        $('#jp_container_1').parent().removeClass('fullvideo')
    }

    _videoHolder.jPlayer("setMedia", {
        m4v: videoFile + ".mp4"
    }).jPlayer("play");

    _videoHolder.jPlayer({
        swfPath: "libs/jplayer",
        supplied: "m4v",
        fullScreen: false,
        size: {
            width: _width,
            height: _height
        }
    })

    videoObject.videoCompleted = false;

    clearInterval(MainController.intervalValue);
    $("#loadingContainer").css("display", "none");
    $(".jp-video-play").hide();

}




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