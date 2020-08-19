var c01_m05_p08 = function() {

    this.init = function() {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title)

        setTimeout(function() {
            MainController.initializeTemplateInShell();
        }, MainController.pageInterval);


    }

}

$(document).ready(function() {
    $(".mainContent .section").fadeOut();
    var _c01_m05_p08 = new c01_m05_p08();
    _c01_m05_p08.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m05_p08.playHead_new == _cTime) {
        return;
    }

    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section1").fadeIn();
            break;
        default:
            break;
    }


    c01_m05_p08.playHead_new = _cTime;

}