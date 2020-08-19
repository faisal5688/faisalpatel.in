var c01_m03_p05 = function () {

    this.init = function () {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title)

        setTimeout(function () {

            MainController.initializeTemplateInShell();

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);


    }

}

$(document).ready(function () {
    $(".mainContent .section");
    var _c01_m03_p05 = new c01_m03_p05();
    _c01_m03_p05.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m03_p05.playHead_new == _cTime) {
        return;
    }

    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section.section1").fadeIn();
            $(".section .section01").fadeIn();
            $(".popupWrapper, .popUp").fadeOut();
            break;
        case 5:
            $(".piller").addClass("inactive");
            $(".piller_1").removeClass("inactive");
            break;
        case 11:
            $(".popupWrapper").fadeIn();
            $(".popup_1").fadeIn();
            break;
        case 35:
            $(".popup_1").fadeOut();
            $(".flow_01").fadeIn();
            break;
        case 38:
            $(".flow_01").fadeOut();
            $(".popup_2").fadeIn();
            break;
        case 48:
            $(".popup_2").fadeOut();
            $(".flow_02").fadeIn();
            break;
        case 51:
            $(".flow_02").fadeOut();
            $(".popup_3").fadeIn();
            break;
        case 61:
            $(".popup_3").fadeOut();
            $(".flow_03").fadeIn();
            break;
        case 63:
            $(".flow_03").fadeOut();
            $(".popup_4").fadeIn();
            break;
        case 72:
            $(".popup_4").fadeOut();
            $(".flow_04").fadeIn();
            break;
        case 75:
            $(".flow_04").fadeOut();
            $(".popup_5").fadeIn();
            break;
        case 94:
            $(".popup_5").fadeOut();
            $(".flow_05").fadeIn();
            break;       
        default:
            break;
    }


    c01_m03_p05.playHead_new = _cTime;

}