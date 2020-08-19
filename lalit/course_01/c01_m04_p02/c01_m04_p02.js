var textImageData = {};
var m05_p02_playHead = -1;
var m05_p02 = {};

m05_p02.pageContentObj;

m05_p02.visitedArr = [];
m05_p02.lastClicked;
m05_p02.audioEnded;
m05_p02.tabAudioEnded = true;
m05_p02.allClicked;
m05_p02.eventFiredOnce = false;
m05_p02.animFlag = false;
m05_p02.slideSeenArr = ["item-1"];

var audioCount = 0;
var objPageData;

m05_p02.initPage = function (pageContent) {

    m05_p02.pageContentObj = pageContent;
    m05_p02.activityCompleted = false;
    m05_p02.audioEnded = false;
    m05_p02.allClicked = false;
    m05_p02.visitedArr = [];
    m05_p02.transcriptText = [];

    $("#popup_Container").show();
    $("#carousel").css("opacity", "1");
    $("#carousel").find('img').unbind("click");

    objPageData = DataManager.templateXMLData.data;

}

m05_p02.addCarouselContent = function () {

    var carouselLen = $("#carousel").children("img").length;


    if (!carouselLen) {
        $("#popup_Container .popupContent #carousel").html(m05_p02.pageContentObj["carousel_content"])

        m05_p02.carousel = $("#carousel").waterwheelCarousel({
            startingItem: 0,
            flankingItems: 5,
            forcedImageWidth: 623, // 696,
            forcedImageHeight: 350, // 391,
            delayOnAnimationComplete: 0,
            imageNav: true,
            preloadImages: false,
            separationMultiplier: 0.25,
            speed: 600,
            autoPlay: 500000000,
            activeClassName: 'carousel-center',
            movedToCenter: function ($newCenterItem) {

                // $newCenterItem is a jQuery wrapped object describing the image that was clicked.
                var imageID = $newCenterItem.attr('id');

                // Get the HTML element "id" for this image. Let's say it's "tigerpicture"

                if (m05_p02.slideSeenArr.indexOf(imageID) == -1) {
                    m05_p02.slideSeenArr.push(imageID);
                    if (m05_p02.slideSeenArr.length >= $("#carousel img").length) {
                        //m05_p02.markPageComplete();
                    }
                }
            }
        });

        $("#carouselHolder").append("<div class='button-nav button-prev'><i class='icon'></i></div><div class='button-nav button-next'><i class='icon'></i></div>");
        $(".button-nav.button-next").off("click").on("click", function () {
            if (m05_p02.carousel) {
                m05_p02.carousel.next();
            }
        });

    }
    $(".closeBtn").hide();

}



m05_p02.markPageComplete = function () {
    if (!m05_p02.activityCompleted) {
        m05_p02.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }
}

$(document).ready(function () {
    m05_p02.initPage(DataManager.templateXMLData.pageContent);
    setTimeout(function () {
        MainController.initializeTemplateInShell();
        m05_p02.addCarouselContent();
    }, MainController.pageInterval);
});

function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (m05_p02.playHead_new == _cTime) {
        return;
    }

    if (_cTime >= _tTime) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
        $(".dummyDivBtn").hide();
    }


    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {

    }

    switch (_cTime) {
        case 0:

            break;
        case 19:
            m05_p02.carousel.next();
            break;
        case 31:
            m05_p02.carousel.next();
            break;
        case 53:
            m05_p02.carousel.next();
            break;
        case 67:
            m05_p02.carousel.next();
            break;
        case 73:
            m05_p02.carousel.next();
            break;
       

        default:
            break;
    }


    m05_p02.playHead_new = _cTime;
}