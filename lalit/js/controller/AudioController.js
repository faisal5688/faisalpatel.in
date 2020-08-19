/*
 @audio controller to mamage the audio
 */
var AudioController = function() {
    this.callback = function() {
        console.log('AudioController: callback')
    }
}

AudioController.audioEnded = true;

AudioController.sndManagerReady = false;
DataManager.AudioElementvalume = true;

var timeUpdateHandler = "";
var tempAudioStr;
var checkAudioNaN = 0;

var animObject;
AudioController.inAudioLoad = false;

var _isMute = false;

var videoObject;

/* *Initializing Audio Element Object *** */
AudioController.InitializeAudioElement = function(audioElementObj) {
    if (!AudioController.sndManagerReady) {
        soundManager.setup({
            url: 'libs/swf/',
            allowScriptAccess: 'always',
            flashVersion: 9,
            debugMode: false,
            useConsole: false,
            defaultOptions: {
                // set global default volume for all sound objects
                volume: 100
            },
            onready: function() {
                AudioController.sndManagerReady = true;
            },
            ontimeout: function() {
                // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?
            }
        });
    };
}

AudioController.addAudioListener = function() {
    clearInterval(timeUpdateHandler);
}

AudioController.updateInternalAudio = function(data) {

    var _path = data['path']
    var _isAbsolute = data['isAbsolute']
    var _callback = data['callback']

    AudioController['isPopup'] = data['isPopup'] || false

    AudioController['callback'] = function() {
        console.log('AudioController... updateInternal: Audio callback')
        if (_callback) {
            _callback();
        }
    }

    AudioController.HandlePlayPauseReply("pageAndPopupLevelAudio", _path, _isAbsolute);


}

AudioController.playInternalAudio = function(path, isAbsolute) {
    AudioController['callback'] = function() {
        console.log('AudioController... playInternalAudio:  callback')
    }
    AudioController.HandlePlayPauseReply("pageAudio", path, isAbsolute);
}

AudioController.createAudioElement = function() {

    checkAudioNaN = 0;

    DataManager.AudioPlayStaus = false;
    DataManager.isAudioLoaded = false;
    AudioController.inAudioLoad = false;

    clearInterval(timeUpdateHandler);

    DataManager.isInternalAudioPlaying = false;
    DataManager.audioFileName = DataManager.audioArray[currentPageLocationIndex];

    AudioController.removeCurrentPageAudio();

    AudioController.HandlePlayPauseReply("startPlayPause", "");
}



AudioController.HandlePlayPauseReply = function(currentPlayType, currentPlayPath, isAbsolute) {

    console.log("AudioController:   HandlePlayPauseReply");

    DataManager.AudioPlayStaus = false;
    DataManager.isAudioLoaded = false;
    AudioController.inAudioLoad = false;

    clearInterval(timeUpdateHandler);

    DataManager.audioPausedByLearner = false;
    if (DeviceHandler.browserVersion != 8) {
        $('#bottom_blank').show();
    };

    if (currentPlayPath.length > 1) {
        DataManager.audioFileName = currentPlayPath;
        DataManager.isInternalAudioPlaying = true;
    } else {
        DataManager.isInternalAudioPlaying = false;
        DataManager.audioFileName = DataManager.audioArray[currentPageLocationIndex];
    }

    // AudioController.ClearTimeUpdateHandler(currentPlayPath);
    AudioController.updateAudio(DataManager.audioFileName, isAbsolute);

};

AudioController.ClearTimeUpdateHandler = function() {
    DataManager.AudioPlayStaus = false;
    DataManager.isAudioLoaded = false;
    AudioController.inAudioLoad = false;
    clearInterval(timeUpdateHandler);
    DataManager.audioPausedByLearner = false;
    if (DeviceHandler.browserVersion != 8) {
        $('#bottom_blank').show();
    };
    if (currentPlayPath.length > 1) {
        DataManager.audioFileName = currentPlayPath;
        DataManager.isInternalAudioPlaying = true;
    } else {
        DataManager.isInternalAudioPlaying = false;
        DataManager.audioFileName = DataManager.audioArray[currentPageLocationIndex];
    }
}

AudioController.updateAudio = function(aURL, isAbsolute) {
    //console.log(DataManager.shellInitialized)
    tempAudioStr = '';
    if (isAbsolute) {
        tempAudioStr = aURL;
    } else {
        tempAudioStr = DataManager.settingDataObj.appAudioURL + aURL
    }

    AudioController.removeCurrentPageAudio();

    tempAudioStr = (tempAudioStr.indexOf(".mp3") !== -1) ? tempAudioStr : tempAudioStr + '.mp3';

    DataManager.audioElement = soundManager.createSound({
        url: tempAudioStr,
        onload: function() {
            console.log('audioElement: onload:  ', tempAudioStr);

            AudioController.inAudioLoad = true;
            AudioController.audioEnded = false;

            if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.HAS_AUDIO] == "true") {
                $("#navigatorPlayPauseBtn").parent().removeClass("disabled");
                $("#navigatorPlayPauseBtn").parent().removeClass("play").addClass("pause");
                $("#navigatorPlayPauseBtn").next('span').html("Pause");
            }
            if (!DataManager.isInternalAudioPlaying) {
                MainController.initializeAudioInShell();
            } else if (AudioController['isPopup']) {
                AudioController.playAudio();
            }

            $("#transcriptViewContent").scrollTop(0);

        },
        whileloading: function() {
            if (!AudioController.inAudioLoad) {
                if (DeviceHandler.device == StaticLibrary.IPAD) {
                    this.pause();
                }
            };
        },
        onfinish: function() {
            AudioController.audioEnded = true;
            AudioController.updateOnEnded();
            if (AudioController.callback) {
                AudioController.callback();
            }
        }

    }).load();

    if (DeviceHandler.device == StaticLibrary.IPAD) {
        AudioController.audioEnded = false;
        DataManager.audioElement.play();
    }
}

AudioController.playAudio = function() {

    if (DataManager.audioElement) {
        AudioController.CheckAndUpdateMuteUnMute();
        DataManager.audioElement.currentTime = 1;
        DataManager.AudioPlayStaus = true;
        DataManager.audioElement.play({
            whileplaying: function() {
                if (!DataManager.isAudioLoaded) {
                    DataManager.isAudioLoaded = true;
                    AudioController.audioEnded = false;
                    $('#bottom_blank').hide();
                };
                var playHead = Math.round(this.position / 1000);
                var totalHead = Math.round(this.duration / 1000);
                if (typeof(pageAudioHandler) == "function") {
                    pageAudioHandler(playHead, totalHead);
                };
            }
        });
    };
}

//control play/pause of audio
AudioController.popupPlayPauseControl = function() {
    console.log("AudioController:   popupPlayPauseControl: ")
    try {
        if (DataManager.audioElement) {
            if (!AudioController.audioEnded) {
                console.log("AudioController: audioElement: ", AudioController.audioEnded);
                PlayPauseController.PlayPause();
            }
        };
    } catch (err) {
        console.log(err)
    }

    try {
        console.log("AudioController: animObject: ", animObject.videoEndedFlag);
        if (animObject && animObject.animdata != "" && typeof(animObject.videoEndedFlag) != 'undefined' && !animObject.videoEndedFlag) {
            animObject.PlayPauseAnimation();
        };
    } catch (err) {
        console.log(err)
    }

    try {
        console.log("AudioController: videoObject: ", videoObject.videoCompleted);
        if (videoObject && typeof(videoObject.videoCompleted) != 'undefined' && !videoObject.videoCompleted) {
            videoObject.PlayPauseAnimation();
        };
    } catch (err) {
        console.log(err)
    }

    try {
        if (videoTemp && videoTemp.allowPopupPlayPause) {
            videoTemp.PlayPauseAnimation();
        }
    } catch (e) {}

    AudioController.updateOnEnded();

}
AudioController.updateOnEnded = function() {
    try {
        if (AudioController.audioEnded) {
            $("#navigatorPlayPauseBtn").parent().addClass("disabled");
            $("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause");
            $("#navigatorPlayPauseBtn").next('span').html("Play");
        }
    } catch (e) {}
}
AudioController.removeCurrentPageAudio = function() {
    if (DataManager.audioElement) {
        DataManager.audioElement.pause();
        DataManager.audioElement.destruct();
        DataManager.audioElement = null;
        PlayPauseController.disablePlayPause();
    };
}

AudioController.ManageAudio = function() {
    _isMute = !_isMute;
    AudioController.CheckAndUpdateMuteUnMute();
}

AudioController.CheckAndUpdateMuteUnMute = function() {

    var _navigatorAudioBtn = $("#navigatorAudioBtn")
    var _bottomNav_audio = $("#bottomNav_audio")
    var _videoEle = $("video");

    var _title = "";
    var _vol = 80;

    try {

        if (!_isMute) {
            _title = "Audio On"
            _bottomNav_audio.removeClass('off');
            _vol = 80;
        } else {
            _bottomNav_audio.addClass('off');
            _title = "Audio Off"
            _vol = 0;
        }
        _bottomNav_audio.find(".tooltipText").html(_title);

    } catch (err) {

    }

    try {
        if (DataManager.audioElement) {
            DataManager.audioElement.setVolume(_vol);
            soundManager.defaultOptions.volume = _vol;
        }

    } catch (err) {

    }

    try {
        _videoEle[0].muted = _isMute;
    } catch (err) {

    }

}

AudioController.InitializeAudioElement();