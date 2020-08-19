var c01_m05_p07 = function() {

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

            try{
                $("link[href*='course_01/css/mcms1.css']").remove();
                $("link[href*='course_01/css/mcms2.css']").remove();
                $("link[href*='course_01/css/mcms3.css']").remove();
                $("link[href*='course_01/css/mcms4.css']").remove();

            }catch(err){}

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);


    }

}

$(document).ready(function() {
    $(".mainContent .section").show();
    var _c01_m05_p07 = new c01_m05_p07();
    _c01_m05_p07.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m05_p07.playHead_new == _cTime) {
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
            $(".section3").hide();
            $(".section2").hide();
            //$(".section_01 ul li").fadeOut().hide();
            break;
        case 4:
            $(".section1").hide();
           $(".section2").fadeIn();
           $(".section3").hide();
            break;
       
        case 18:
            $(".section1").show();
            $(".section2").hide();
            $(".section3").fadeIn();
            break;
        default:
            break;
    }


    c01_m05_p07.playHead_new = _cTime;

}