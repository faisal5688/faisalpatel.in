var PlayPauseController = function() {

}

PlayPauseController.PlayPause = function() {
    trace(DataManager.audioElement.position + "  -  " + DataManager.audioElement.duration);
    if (DataManager.AudioPlayStaus == true) {
        DataManager.audioElement.pause();
        DataManager.AudioPlayStaus = false;
        $("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause");
        $("#navigatorPlayPauseBtn").next('span').html("Play");
    } else {
        $("#navigatorPlayPauseBtn").next('span').html("Pause");
        if (DataManager.audioPausedByLearner)
            return;
        AudioController.addAudioListener();
        if (DataManager.audioElement.paused)
            DataManager.audioElement.play();
        DataManager.AudioPlayStaus = true;
        $("#navigatorPlayPauseBtn").parent().addClass("pause").removeClass("play");
    }
}

PlayPauseController.disablePlayPause = function() {
    if ($('#videoHolder video').length == 0) {
        $("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
    };
}
PlayPauseController.enablePlayPause = function() {
    $("#navigatorPlayPauseBtn").parent().removeClass("disabled");
}