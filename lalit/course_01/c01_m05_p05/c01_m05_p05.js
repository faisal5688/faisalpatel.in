var c01_m05_p05 = function () {

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



        $(".noteBtn").removeClass("active");


    }

    this.initActivity = function () {

        /* $(".noteBtn").on("click", function () {
            event.stopPropagation();
            $(this).addClass("active");
            $(".notePopup, .notePopup p").fadeIn();
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();

        });



        $(".noteBtn .closeBtn").on("click", function () {
            event.stopPropagation();
            $(".notePopup").hide();
            $(".noteBtn").removeClass("active");

        }); */



    }


}

$(document).ready(function () {
    $(".mainContent .section").show();
    var _c01_m05_p05 = new c01_m05_p05();
    _c01_m05_p05.init();
    //_c01_m05_p05.initActivity();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m05_p05.playHead_new == _cTime) {
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
            $(".section_01 ul li, .noteBtn").fadeOut().hide();
            break;
        case 1:
            $(".section_01 ul li").eq(0).fadeIn().show();
            break;
        case 30:
            $(".section_01 ul li").eq(1).fadeIn().show();
            break;
        case 50:
            $(".noteBtn").fadeIn().show();
            break;
        default:
            break;
    }


    c01_m05_p05.playHead_new = _cTime;

}