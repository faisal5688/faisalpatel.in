var c01_m03_p01_1 = function() {

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

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);


    }

}

$(document).ready(function() {
    $(".mainContent .section").show();
    var _c01_m03_p01_1 = new c01_m03_p01_1();
    _c01_m03_p01_1.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m03_p01_1.playHead_new == _cTime) {
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
			$(".section_01 ul li").fadeOut().hide();
            break;
		case 1:
			$(".section_01 ul li").eq(0).fadeIn().show();
			$(".section_01 ul li").eq(1).fadeOut().hide();
            break;
		case 29:
			$(".section_01 ul li").eq(1).fadeIn().show();
            break;		
        default:
            break;
    }


    c01_m03_p01_1.playHead_new = _cTime;

}