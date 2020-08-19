var c01_m05_p04 = function() {
    var _jsonData = {};

    var startNo = 1,
        endNo = 5;

    var actComplete = false;
    var _backBtn = $(".nxtbck_button .backbtn");
    var _nextBtn = $(".nxtbck_button .nextbtn");
    _nextBtn.addClass("nextbtndisable disable");

    this.init = function() {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);

        setTimeout(function() {
            MainController.initializeTemplateInShell();
            addEvents();
            addNextbackHandler()
        }, MainController.pageInterval);

    }


    var addNextbackHandler = function() {
        _backBtn = $(".nxtbck_button .backbtn");
        _nextBtn = $(".nxtbck_button .nextbtn");
        _backBtn.off().on("click", updateNexBackBtn).addClass("backbtndisable disable");
        _nextBtn.off().on("click", updateNexBackBtn);
    }

    var updateNexBackBtn = function() {
        if (!$(this).hasClass("disable")) {
            if ($(this).hasClass("nextbtn")) {
                startNo++
                console.log("startNo add " + startNo);
            } else {
                startNo--;
                console.log("startNo minus " + startNo);
            }
            if (startNo >= endNo) {
                _nextBtn.addClass("nextbtndisable disable");
                if (!actComplete) {
                    actComplete = true;
                    MainController.markCurrentPageComplete();
                    MainController.showNextInstruction();
                }
            } else {
                _nextBtn.removeClass("nextbtndisable disable");
            }
            if (startNo == 1) {
                _backBtn.addClass("backbtndisable disable");
            } else {
                _backBtn.removeClass("backbtndisable disable");
            }
            for (var i = 1; i <= endNo; i++) {
                $(".section_" + i).hide();
            }
            $(".section_" + startNo).fadeIn();

        }
    }

    var addEvents = function() {
        addCarouselContent();
        var _imgs = $("#carousel").find('img')
        _imgs.unbind('click');

        _imgs.bind("click", function() {
            c01_m05_p04.carousel.rotCarouse1(0);
            $(this).addClass('visited');
            var _allVisited = true;
            _imgs.each(function() {
                if (!$(this).hasClass('visited')) {
                    _allVisited = false
                }
            })
            if (_allVisited) {
                MainController.markCurrentPageComplete();
                MainController.showNextInstruction();
            }
        });
        $(_imgs[0]).addClass('visited');
        $("#carousel").css("opacity", "1");
    }

    var addCarouselContent = function() {
        c01_m05_p04.carousel = $("#carousel").waterwheelCarousel({
            separation: 200,
            speed: 600,
            finalspeed: 600,
        });

    }
};

c01_m05_p04.playHead_new = -1;

$(document).ready(function() {
    var _c01_m05_p04 = new c01_m05_p04();
    _c01_m05_p04.init();

});

function pageAudioHandler(currTime, totTime) {

    if (parseInt(currTime) >= parseInt(totTime)) {
        // MainController.markCurrentPageComplete();
        // MainController.showNextInstruction();
        $(".nxtbck_button .nextbtn").removeClass("nextbtndisable disable");
    }

    var seconds = parseInt(currTime);

    if (c01_m05_p04.playHead_new == seconds) {
        return;
    }
    c01_m05_p04.playHead_new = seconds;

    switch (seconds) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        default:
            break;
    }
}