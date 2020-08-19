var c01_m01_p04 = function() {
    this.init = function() {
        try {
            _jsonData = DataManager.templateXMLData.data;
        } 
        catch (err) {
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
    $(".mainContent .section").show();
    var _c01_m01_p04 = new c01_m01_p04();
    _c01_m01_p04.init();
});

function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m01_p04.playHead_new == _cTime) {
        return;
    }

    if (_cTime >= _tTime) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section.section1").fadeIn();
            $(".section .section01").fadeIn();
            break;

        case 26:
            $(".box_1").fadeOut();
            $(".box_2").fadeIn();
            break;  
			
		case 39:
            $(".box_2").fadeOut();
            $(".box_3").fadeIn();
            break;

      /*   case 39:
            $(".box_2").fadeOut(function() {
                $(".box_3").fadeIn();
            });
            break; */

        default:
            break;
    }

    c01_m01_p04.playHead_new = _cTime;
}