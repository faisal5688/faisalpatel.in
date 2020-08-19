var c01_m04_p04 = function () {

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
    $(".mainContent .section").show();
    var _c01_m04_p04 = new c01_m04_p04();
    _c01_m04_p04.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m04_p04.playHead_new == _cTime) {
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
            $(".section").hide();
            $(".section1").fadeIn();
            break;
        case 2:
            $(".piller").addClass("inactive");
            $(".piller_4").removeClass("inactive");
            $(".section").hide();
            $(".section2").fadeIn();
            break;
        case 3:
            $(".section").hide();
            $(".section3").fadeIn();
            break;
        case 23:
            $(".section3 .txt_sec").hide();
            $(".section4").fadeIn();
            break;
        case 36:
            $(".section4 .txt_sec").hide();
            $(".section5").fadeIn();
            break;
        case 46:
            $(".section5 .txt_sec").hide();
            $(".section6").fadeIn();
            break;
        case 54:
            $(".section6 .txt_sec").hide();
            $(".section7").fadeIn();
            break;
        case 67:
            $(".section7 .txt_sec").hide();
            $(".section8").fadeIn();
            break;
        case 76:
            $(".section8 .txt_sec").hide();
            $(".section9").fadeIn();
            break;
        case 86:
            $(".section9 .txt_sec").hide();
            $(".section10").fadeIn();
            break;
        default:
            break;
    }


    c01_m04_p04.playHead_new = _cTime;

}