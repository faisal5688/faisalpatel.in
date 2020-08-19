var evtMrg = new EventManager();
var textImageData = {};
var c01_m00_p04 = {};
c01_m00_p04.activityCompleted = false;
c01_m00_p04.playHead = -1;

//Mark Page Completed
c01_m00_p04.markPageComplete = function() {
    if (!c01_m00_p04.activityCompleted) {
        c01_m00_p04.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

$(document).ready(function() {
    textImageData = Parser.loadTextImageDataFn(DataManager.templateXMLData);
    TextImageObj.initTextSection(textImageData);
});



function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime);
    // trace(Math.round(_cTime) + ' - ' + Math.round(totTime))

    if (_cTime >= parseInt(totTime)) {
        c01_m00_p04.markPageComplete();
    }

    if (c01_m00_p04.playHead == _cTime) {
        return;
    }

    c01_m00_p04.playHead = _cTime;

    switch (_cTime) {
        case 0:
            $(".mainContent .section").hide();
            $(".mainContent .section_1").show();
            break;
        default:
            break;
    }

}