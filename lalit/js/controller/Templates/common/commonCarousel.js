var carouselManager = {};
var carouselManager_playHead = -1;
carouselManager.pageContentObj = {};
carouselManager.pageCompleted;
carouselManager.audioEnded;
carouselManager.carousel;
carouselManager.visitedArr = [];
carouselManager.lastClicked;
carouselManager.audioEnded;
carouselManager.tabAudioEnded = true;
carouselManager.allClicked;
carouselManager.eventFiredOnce = false;
carouselManager.animFlag = false;
carouselManager.autoPlay = false;


carouselManager.initPage = function() {
    carouselManager.activityCompleted = false;
    carouselManager.audioEnded = false;
    carouselManager.allClicked = false;
    carouselManager.visitedArr = [];
    carouselManager.transcriptText = [];

}

carouselManager.init = function(autoPlayBool) {
    carouselManager.autoPlay = autoPlayBool == undefined ? true : autoPlayBool;
    $("#carousel").css("opacity", "1");
}
carouselManager.carouselINIT = function() {
    carouselManager.initPage();
    carouselManager.init(false);
    carouselManager.carousel = $("#carousel").waterwheelCarousel({
        flankingItems: 1,
        autoPlay: 0,
        separation: 100,
        stopOnAnimationComplete: true,
        imageNav: true,
        clickedCenter: function($item) {},
        movingToCenter: function($item) {

        },
        movedToCenter: function($item) {
            try {

                var curCenterItem;
                if ($item.attr('id') == undefined) {
                    curCenterItem = 1
                } else {
                    curCenterItem = Number($item.attr('id').slice(5, 6));
                }
                $("#carousel img").css("cursor", "pointer")
                $("#item-" + curCenterItem).css("cursor", "default")
                if (carouselManager.audioEnded) {
                    carouselManager.visitedArr[curCenterItem - 1] = 1;
                }

                $("#imgTitles p").html(carouselManager.pageContentObj["click_" + curCenterItem]);
                console.log("curCenterItem :" + curCenterItem)
                carouselManager.updateNavigation(curCenterItem - 1)
            } catch (err) {};
        },
        movingFromCenter: function($item) {



        },
        movedFromCenter: function($item) {
        }
    });

    $("#imgTitles").hide();
    $("#carousel").css("opacity", "0");
    $(".popupContainer").hide();
    $("#contentHolder").hide()

    setTimeout(function() {
        $("#imageContainer").fadeOut(100, function() { $("#imageContainer").html("") });
        $("#contentHolder").show()
    }, 100);
};

carouselManager.checkCompletion = function() {
    if (jQuery.inArray(0, carouselManager.visitedArr) == -1) {
        carouselManager.allClicked = true;
        carouselManager.markPageComplete();
    }
}

carouselManager.markPageComplete = function() {

    if (!carouselManager.activityCompleted && carouselManager.autoPlay) {
        carouselManager.activityCompleted = true;
        $("#carousel img").addClass("handCursor");
        $(".dummyOverlayBox").hide();
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();

    }
}

carouselManager.updateNavigation = function(num) {
    $("#carouselHolder .circle_enable").removeClass("active");
    $("#carouselHolder .circle_enable").eq(num).addClass("active");

    $("#carouselHolder .description").addClass('timeline');
    $("#carouselHolder .description").eq(num).removeClass('timeline');
}