var assetPreloader = {};
assetPreloader.initializeTimer = '';

assetPreloader.timerDelay = 1500;
assetPreloader.ajaxRef;
assetPreloader.data;
assetPreloader.imgLoadedCnt = 0;
assetPreloader.audioLoadedCnt = 0;
assetPreloader.videoLoadedCnt = 0;
assetPreloader.imgFile;
assetPreloader.audioFile;
assetPreloader.videoFile;
assetPreloader.imgRef;
assetPreloader.audioRef;
assetPreloader.videoRef;
assetPreloader.stopImgCaching = false;
assetPreloader.stopAudioCaching = false;
assetPreloader.stopVideoCaching = false;

assetPreloader.jsonPath = "./course_01/data/course_data/";
assetPreloader.imagePath = "./course_01/images/";
assetPreloader.audioPath = "./course_01/media/audio/";
assetPreloader.videoPath = "./course_01/media/video/";

assetPreloader.abortAssetPreloader = function() {
    try {
        if (assetPreloader.ajaxRef) {
            assetPreloader.ajaxRef.abort();
        }
        clearTimeout(assetPreloader.initializeTimer);
        assetPreloader.stopImgCaching = true;
        if (assetPreloader.imgLoadedCnt != 0 && assetPreloader.imgRef) {
            assetPreloader.imgRef.src = '';
        }
        assetPreloader.stopAudioCaching = true;
        if (assetPreloader.audioLoadedCnt != 0 && assetPreloader.audioRef) {
            assetPreloader.audioRef.src = '';
        }
        assetPreloader.stopVideoCaching = true;
        if (assetPreloader.videoLoadedCnt != 0 && assetPreloader.videoRef) {
            assetPreloader.videoRef.src = '';
        }
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	abortAssetPreloader:	" + err);
    }
}

assetPreloader.getImgUrl = function(imgArr) {
    try {
        var _imgPath = imgArr[assetPreloader.imgLoadedCnt];
        var _indexOf = _imgPath.indexOf('../images/')
        if (_indexOf == -1) {
            _imgPath = assetPreloader.data['basePath'] + _imgPath
        } else if (_indexOf == 0) {
            _imgPath = (assetPreloader.imagePath) + _imgPath.split('../images/')[1]
        }
        return _imgPath;
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	getImgUrl:	" + err);
    }
}

assetPreloader.loadedImg = function(imgArr, callback) {
    try {
        if (assetPreloader.stopImgCaching) return;
        assetPreloader.imgLoadedCnt++;
        if (assetPreloader.imgLoadedCnt >= imgArr.length) {
            assetPreloader.stopImgCaching = false;
            assetPreloader.imgLoadedCnt = 0;
            assetPreloader.trace("assetPreloader:	" + assetPreloader.imgFile + " file has been loaded");
            //  assetPreloader.trace("assetPreloader:	All img files has been loaded: ", imgArr);
            assetPreloader.imgFile = '';
            callback();
        } else {
            assetPreloader.trace("assetPreloader:	" + assetPreloader.imgFile + " file has been loaded");
            assetPreloader.preLoadImg(imgArr, callback);
        }
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	loadedImg:	" + err);
    }
}

assetPreloader.preLoadImg = function(imgArr, callback) {
    try {
        assetPreloader.imgRef = new Image();
        assetPreloader.imgRef.onload = function() {
            assetPreloader.loadedImg(imgArr, callback);
        }
        assetPreloader.imgRef.onerror = function() {
            assetPreloader.loadedImg(imgArr, callback);
        }
        assetPreloader.imgRef.src = assetPreloader.imgFile = assetPreloader.getImgUrl(imgArr);
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	preLoadImg:	" + err);
    }
}

assetPreloader.getAudioUrl = function(audioArr) {
    try {
        return (assetPreloader.audioPath + audioArr[assetPreloader.audioLoadedCnt]) + ".mp3";
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	getAudioUrl:	" + err);
    }
}

assetPreloader.loadedAudio = function(audioArr, callback) {
    try {
        if (assetPreloader.stopAudioCaching) return;
        assetPreloader.audioLoadedCnt++;
        if (assetPreloader.audioLoadedCnt >= audioArr.length) {
            assetPreloader.stopAudioCaching = false;
            assetPreloader.audioLoadedCnt = 0;
            assetPreloader.trace("assetPreloader:	" + assetPreloader.audioFile + " file has been loaded");
            // assetPreloader.trace("assetPreloader:	All audio files has been loaded: ", audioArr);
            assetPreloader.audioFile = '';
            callback();
        } else {
            assetPreloader.trace("assetPreloader:	" + assetPreloader.audioFile + " file has been loaded");
            assetPreloader.preLoadAudio(audioArr, callback);
        }
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	loadedAudio:	", err);
    }
}

assetPreloader.preLoadAudio = function(audioArr, callback) {
    try {
        assetPreloader.audioRef = new Audio();
        assetPreloader.audioRef.oncanplaythrough = function() {
            assetPreloader.loadedAudio(audioArr, callback)
        };
        assetPreloader.audioRef.src = assetPreloader.audioFile = assetPreloader.getAudioUrl(audioArr);
        assetPreloader.audioRef.autoplay = false;
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	preLoadAudio:	", err);
    }
}

assetPreloader.getVideoUrl = function(audioArr) {
    try {
        var _pageURL = DataManager.TOCData[currentPageLocationIndex + 1].pageData;
        DataManager.settingDataObj['NextDirectoryURL'] = './course_01/' + _pageURL + '/' + _pageURL;
        return (DataManager.settingDataObj.NextDirectoryURL) + ".mp4";
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	getVideoUrl:	", err);
    }


}

assetPreloader.loadedVideo = function(videoArr, callback) {
    try {
        if (assetPreloader.stopVideoCaching) return;
        assetPreloader.videoLoadedCnt++;
        if (assetPreloader.videoLoadedCnt >= videoArr.length) {
            assetPreloader.stopVideoCaching = false;
            assetPreloader.videoLoadedCnt = 0;
            assetPreloader.trace("assetPreloader:	" + assetPreloader.videoFile + " file has been loaded");
            // assetPreloader.trace("assetPreloader:	All video files has been loaded: ", videoArr);
            assetPreloader.videoFile = '';
            callback();
        } else {
            assetPreloader.trace("assetPreloader:	" + assetPreloader.videoFile + " file has been loaded");
            assetPreloader.preLoadVideo(videoArr, callback);
        }
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	loadedVideo:	", err);
    }
}

assetPreloader.preLoadVideo = function(videoArr, callback) {
    try {
        assetPreloader.videoRef.oncanplaythrough = function() {
            assetPreloader.loadedVideo(videoArr, callback)
        };
        assetPreloader.videoRef.src = assetPreloader.videoFile = assetPreloader.getVideoUrl(videoArr);
        assetPreloader.videoRef.autoplay = false;
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	preLoadVideo:	", err);
    }
}

assetPreloader.actionAfterDataLoaded = function() {
    try {
        assetPreloader.videoRef = $("#cacheVideoElem")[0];
        assetPreloader.stopImgCaching = false;
        assetPreloader.imgLoadedCnt = 0;
        var videoCallBack = function() {
            assetPreloader.stopVideoCaching = false;
            assetPreloader.videoLoadedCnt = 0;
            if (assetPreloader.data.animContent && assetPreloader.data.animContent.video) {
                assetPreloader.preLoadVideo([assetPreloader.data.animContent.video], function() {});
            } else {
                assetPreloader.trace('assetPreloader:    No video found.');
            }
        };
        var audioCallBack = function() {
            assetPreloader.stopAudioCaching = false;
            assetPreloader.audioLoadedCnt = 0;
            if (DataManager.audioArray[currentPageLocationIndex + 1] != 'blank') {
                assetPreloader.preLoadAudio([DataManager.audioArray[currentPageLocationIndex + 1]], videoCallBack);
            } else {
                //  assetPreloader.trace('assetPreloader:    Skipped blank audio.');
                videoCallBack();
            }
        };
        if (assetPreloader.data.downloadImages && assetPreloader.data.downloadImages.split(',').length) {
            assetPreloader.preLoadImg(assetPreloader.data.downloadImages.split(','), audioCallBack);
        } else {
            assetPreloader.trace('assetPreloader:    No images found.');
            audioCallBack();
        }
    } catch (err) {
        assetPreloader.traceError("assetPreloader:	actionAfterDataLoaded:	", err);
    }
}

assetPreloader.getJSONData = function(num) {
    var _jsonPath = ""
    var _pageURL = DataManager.TOCData[currentPageLocationIndex + num].pageData;
    var _isGroup = DataManager.TOCData[currentPageLocationIndex + num].isGroup || "false"
    if (_isGroup == "true") {
        DataManager.settingDataObj['NextDirectoryURL'] = './course_01/' + _pageURL + '/' + _pageURL;
        _jsonPath = DataManager.settingDataObj.NextDirectoryURL + ".json";
    } else {
        _jsonPath = assetPreloader.jsonPath + _pageURL + ".json"
    }

    if (_jsonPath != "") {
        try {
            assetPreloader.ajaxRef = $.getJSON(_jsonPath, function(data) {
                    assetPreloader.data = data.data;
                    // assetPreloader.trace("getting JSON data: " + assetPreloader.data)
                })
                .done(function() {
                    assetPreloader.trace("Done: getting JSON data: ", _jsonPath);
                    assetPreloader.actionAfterDataLoaded();
                })
                .fail(function() {
                    // assetPreloader.traceError("fail: Error in getting JSON data: " + _jsonPath);
                })
                .always(function() {
                    //do nothing
                    // assetPreloader.traceError("always: getting JSON data: " + _jsonPath);
                });
        } catch (err) {
            assetPreloader.traceError("assetPreloader:	getJSONData:	", err);
        }
    }
}

assetPreloader.initializeAssetLoader = function() {
    try {
        assetPreloader.trace("assetPreCaching:	initializeAssetLoader:	");
        assetPreloader.abortAssetPreloader();
        if (currentPageLocationIndex < DataManager.TOCData.length - MainController.noOfPagesToPreload) {
            clearTimeout(assetPreloader.initializeTimer);
            for (var i = 1; i <= MainController.noOfPagesToPreload; i++) {
                assetPreloader.getJSONData(i)
            }
        }
    } catch (err) {
        assetPreloader.traceError("assetPreCaching:	initializeAssetLoader:	", err);
    }
}

assetPreloader.trace = function(msg) {
    try {
        console.log(msg);
    } catch (err) {}
}

assetPreloader.traceError = function(msg) {
    try {
        console.error(msg);
    } catch (err) {}
}