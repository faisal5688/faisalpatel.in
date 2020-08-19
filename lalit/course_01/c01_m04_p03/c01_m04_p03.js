var c01_m04_p03 = function () {

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
    var _c01_m04_p03 = new c01_m04_p03();
    _c01_m04_p03.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m04_p03.playHead_new == _cTime) {
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
            $(".sectionBlock").hide();
            $(".img_wraper").fadeIn();
            $(".section_01").fadeIn();
            break;
        case 2:
            $(".piller").addClass('inactive')
            $(".piller_3").removeClass('inactive')
            $(".sectionBlock").hide();
            break;
        case 3:
            $(".section_02").fadeIn();
            break;
        case 22: //20
            $(".sectionBlock").hide();
            $("#imgWrapper").removeClass().addClass('imgWrapper img1')
            break;
        case 24:
            $("#imgWrapper").removeClass('img1')
            $(".section_03").fadeIn();
            break;
        case 51: //46
            $(".sectionBlock").hide();
            $("#imgWrapper").removeClass().addClass('imgWrapper img2')
            break;
        case 53: //46
            $("#imgWrapper").removeClass('img2')
            $(".section_04").fadeIn();
            break;
        case 60: //53
            $(".sectionBlock").hide();
            $("#imgWrapper").removeClass().addClass('imgWrapper img3')
            break;
        case 62: //53
            $("#imgWrapper").removeClass('img3')
            $(".section_05").fadeIn();
            break;
        case 75: //66
            $(".sectionBlock").hide();
            $("#imgWrapper").removeClass().addClass('imgWrapper img4')
            break;
        case 77: //66
            $("#imgWrapper").removeClass('img4')
            $(".section_06").fadeIn();
            break;
        case 95: //84
            $(".sectionBlock").hide();
            $("#imgWrapper").removeClass().addClass('imgWrapper img5')
            break;
        case 97: //84
            $("#imgWrapper").removeClass('img5')
            $(".piller_3").addClass('highlight')
            break;
        default:
            break;
    }


    c01_m04_p03.playHead_new = _cTime;

}