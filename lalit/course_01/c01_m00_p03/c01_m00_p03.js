var evtMrg = new EventManager();
var textImageData = {};
var c01_m00_p03 = {};
c01_m00_p03.activityCompleted = false;
c01_m00_p03.playHead = -1;

//Mark Page Completed
c01_m00_p03.markPageComplete = function() {
    if (!c01_m00_p03.activityCompleted) {
        c01_m00_p03.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

$(document).ready(function() {
    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }
    textImageData = Parser.loadTextImageDataFn(DataManager.templateXMLData);
    TextImageObj.initTextSection(textImageData);

    setTimeout(function() {
        MainController.initializeTemplateInShell();
        // var _audioData = _jsonData['audio']
        //  AudioController.updateInternalAudio(_audioData)
    }, MainController.pageInterval);
});



function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime);
    if (_cTime >= parseInt(totTime)) {
        c01_m00_p03.markPageComplete();
    }
    if (c01_m00_p03.playHead == _cTime) {
        return;
    }
    c01_m00_p03.playHead = _cTime;
    switch (_cTime) {
        case 0:
            $(".mainContent .timeLine_1").show();
            break;
        case 2:
            $(".mainContent .timeLine_2").show();
            break;
        case 4:
            $(".mainContent .timeLine_3").show();
            break;
        case 6:
            $(".mainContent .timeLine_4").show();
            break;

        default:
            break;
    }

}