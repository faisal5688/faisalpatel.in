var c01_m05_p03 = function () {

    this.init = function () {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title)

        $(".block").hide();

        setTimeout(function () {

            MainController.initializeTemplateInShell();

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);


    }

}

$(document).ready(function () {
    $(".mainContent .section").show();
    var _c01_m05_p03 = new c01_m05_p03();
    _c01_m05_p03.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m05_p03.playHead_new == _cTime) {
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
            //$(".section_01 ul li").fadeOut().hide();
            break;
        case 1:
            $(".block_01").fadeIn();
            break;
        case 2:
            $(".block_03").fadeIn();
            break;
        case 3:
            $(".block_02").fadeIn();
            break;
        case 4:
            $(".block_04").fadeIn();
            break;
        default:
            break;
    }


    c01_m05_p03.playHead_new = _cTime;

}