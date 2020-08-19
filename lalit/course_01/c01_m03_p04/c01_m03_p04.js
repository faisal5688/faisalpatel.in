var c01_m03_p04 = function () {

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
    var _c01_m03_p04 = new c01_m03_p04();
    _c01_m03_p04.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m03_p04.playHead_new == _cTime) {
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
            $(".img_overlayWrapper").fadeOut();
            break;
        case 1:
            $(".piller_wraper").fadeIn();
            break;
        case 2:
            $(".piller.piller_1").fadeIn();
            $(".piller.piller_2").fadeIn();
            $(".piller.piller_3").fadeIn();
            $(".piller.piller_4").fadeIn();
            $(".piller.piller_5").fadeIn();
            $(".piller.piller_6").fadeIn();
            $(".piller.piller_7").fadeIn();
            $(".piller.piller_7").fadeIn();
            break;

        case 22:
            $(".values_wraper").fadeIn();
            $(".piller.piller_1 .ptext").fadeIn();
            break;
        case 5:

            break;
        case 47:
            $(".img_overlayWrapper").fadeIn();
            $(".values_wraper").hide();
            $(".img_wraper").fadeIn();
            $(".piller.piller_2 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img1')
            break;
        case 68:
            $(".piller.piller_3 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img2')
            break;

        case 91:
            $(".piller.piller_4 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img3')
            break;
        case 111:
            $(".piller.piller_5 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img4')
            break;
        case 130:
            $(".piller.piller_6 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img5')
            break;
        case 160:
            $(".piller.piller_7 .ptext").fadeIn();
            $("#img_wraper").removeClass().addClass('img_wraper img6')
            break;
        case 180:
            $(".img_wraper").hide();
            break;

        default:
            break;
    }


    c01_m03_p04.playHead_new = _cTime;

}