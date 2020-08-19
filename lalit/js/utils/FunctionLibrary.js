var FunctionLibrary = function() {}
    /*this is added if we made it draggable then need it orignal position to set it to orignal position after dragging*/
    /* FunctionLibrary.trancriptLeft=0;
    FunctionLibrary.calcLeft=0; */


FunctionLibrary.showBookmarPopup = function(flag) {
    if (flag) {
        $("#bookMarkView").show();
        $("#bookMarkView").find("#yesBookmarkBtn").one("click", MainController.bookmarkPopupHandler);
        $("#bookMarkView").find("#noBookmarkBtn").one("click", MainController.bookmarkPopupHandler);
        setTimeout(function() {
            MainController.hideLoading();
        }, 200);
    } else {
        $("#bookMarkView").hide();
    }
    DataManager.shellInitialized = true;
}

FunctionLibrary.showWelcomeNote = function() {

    $("#bodyOverlay").hide();
    $("#welcomeBox").hide();

    $("#skipIntro").one("click", function() {
        $("#welcomeBox").hide();

        FunctionLibrary.showAndHideOverlay(false);
        //$("#welcomeBox").find("video").get(0).pause();	
        DataManager.shellInitialized = true;
        MainController.loadFirstPage();
        AudioController.InitializeAudioElement('#audioPlayerObj');
        AudioController.playInternalAudio('blank');
        NextBackController.updateNextControl();

    });

    /* $("#closePoopIntrBtn").one("click", function() {
        $("#instPopUp").hide();
        $("#skipIntro").trigger("click")
    }) */


    if (DeviceHandler.device == StaticLibrary.DESKTOP) {
        setTimeout(function() {
            $("#skipIntro").trigger('click');
        }, 300);
    } else {
        $("#welcomeBox").show();
    };

    /*  setTimeout(function() {
         FunctionLibrary.showAndHideOverlay(true);
         $("#instPopUp").show();
     }, 300); */


}

FunctionLibrary.showDisclaimer = function() {
    $("#bodyOverlay").hide();
    $("#acceptOverlay").show();
    $("#disclaimerBox").show();
    DisclaimerController.init();
}

FunctionLibrary.hideDisclaimer = function() {
    $("#disclaimerBox").hide();
    $("#acceptOverlay").hide();
    AudioController.InitializeAudioElement('#audioPlayerObj');
    AudioController.playInternalAudio('blank');
    MainController.loadFirstPage();
}

FunctionLibrary.showPopup = function(getCurrentScreen) {
    //FunctionLibrary.resetAllPopup();	
    //FunctionLibrary.resetPopup();
    FunctionLibrary.showAndHideOverlay(true);
    $(getCurrentScreen).removeClass("hidePopupCSS");
    $(getCurrentScreen).addClass("showPopupCSS").fadeIn();
    var top = parseInt($(getCurrentScreen).find('.popup').outerHeight()) / 2;
    $(getCurrentScreen).find('.popup').css('margin-top', -top);
}

FunctionLibrary.hidePopup = function(getCurrentScreen) {
    FunctionLibrary.showAndHideOverlay(false);
    $(getCurrentScreen).removeClass("showPopupCSS");
    $(getCurrentScreen).addClass("hidePopupCSS");
}

FunctionLibrary.resetAllPopup = function() {
    $(".showPopupCSS").removeClass("showPopupCSS").addClass("hidePopupCSS");
    $(".show").removeClass("show").addClass("hide");

    GlossaryController.reset();
    if (DataManager.isTrancriptOpen == true) {
        FunctionLibrary.showTranscriptPopup("#transcriptView");
    }
}

FunctionLibrary.showAndHideOverlay = function(blnFlag) {

    if (blnFlag == true) {
        $(".popupOverlay").show();
    } else {
        $(".popupOverlay").hide();
    }
}

FunctionLibrary.showTranscriptPopup = function(getCurrentScreen) {
    //FunctionLibrary.resetAllPopup();
    /*this is added if we made it draggable then need it orignal position to set it to orignal position after dragging*/
    //FunctionLibrary.trancriptLeft=$("#transcriptView #transcriptPopup").css("left");


    FunctionLibrary.showAndHideOverlay(false);
    if (DataManager.isTrancriptOpen == true) {
        FunctionLibrary.showTranscriptPopup("#transcriptView");
    } else {
        $("#transcriptView #transcriptPopup").height(0);
        $("#transcriptView #transcriptPopup").animate({
            height: 178
        }, 178);
    }
    DataManager.isTrancriptOpen = true;


    $(getCurrentScreen).removeClass("hidePopupCSS");
    $(getCurrentScreen).addClass("showPopupCSS");
}

FunctionLibrary.hideTranscriptPopup = function(getCurrentScreen) {

    FunctionLibrary.showAndHideOverlay(false);
    $("#transcriptView #transcriptPopup").animate({
        height: 0
    }, 200, function() {
        $(getCurrentScreen).removeClass("showPopupCSS");
        $(getCurrentScreen).addClass("hidePopupCSS");
    });

    DataManager.isTrancriptOpen = false;
}

FunctionLibrary.checkVersion = function() {}

FunctionLibrary.showHideExitButton = function(blnFlagForDevice) {

    if (blnFlagForDevice)
        $("#exitBtn").hide();
    else
        $("#exitBtn").show();
}

FunctionLibrary.animatePopup = function(element, getCurrentScreen) {

    var currentElelemt = $(getCurrentScreen);
    currentElelemt.removeClass("hidePopup");
    currentElelemt.addClass("showPopup");
    element.addClass("active");
    var currentWidth = currentElelemt.width();
    element.parent().animate({
        right: currentWidth
    });

}
FunctionLibrary.resetAnimatedPopup = function(element, getCurrentScreen) {
    $(getCurrentScreen).css('right', -$(getCurrentScreen).width());
    var top = parseInt(element.css('top'));
    $(getCurrentScreen).css('margin-top', top);

    $(".rightnavPopup").removeClass("showPopup").addClass("hidePopup");
    $(".navitem").removeClass("active");
    $(".navitem").css('z-index', '9');
    element.css('z-index', '99999999');
    FunctionLibrary.animatePopup(element, getCurrentScreen);
    FunctionLibrary.showAndHideOverlay(true);
}
FunctionLibrary.hideAnimationPopup = function(element, getCurrentScreen) {
    element.parent().animate({
        right: 0
    }, { duration: 200, queue: false });
    FunctionLibrary.showAndHideOverlay(false);
    $(".navitem").css('z-index', '9');

}
FunctionLibrary.resetPopup = function(getCurrentScreen) {

        //$(getCurrentScreen).css('right',-$(getCurrentScreen).width());
        $(".rightNav").animate({
            right: 0
        }, {
            duration: 300,
            queue: false,
            complete: function() {

                $(".rightnavPopup").removeClass("showPopup").addClass("hidePopup");
                $(".navitem").removeClass("active");
                $(".navitem").css('z-index', '9');
                $(".rightNav").css('right', '0');
            }
        });
    }
    /**
    for making div draggable
    **/
FunctionLibrary.setDraggablePopup = function(divRef) {
    //$(getCurrentScreen).draggable({ containment: DataManager.dragConstraintBox});
    divRef.draggable({
        start: function(e, ui) {

        },
        containment: DataManager.dragConstraintBox
    });
}

FunctionLibrary.showCalculatorPopup = function(getCurrentScreen) {
    //FunctionLibrary.resetAllPopup();	
    //FunctionLibrary.resetPopup();
    /*this is added if we made it draggable then need it orignal position to set it to orignal position after dragging*/
    //FunctionLibrary.calcLeft=$("#calculatorContainer").css('left');

    FunctionLibrary.showAndHideOverlay(false);
    $("#calculatorContainer").height(0);
    $("#calculatorContainer").animate({
        height: 218
    }, 200);
    $(getCurrentScreen).removeClass("hide");
    $(getCurrentScreen).addClass("show");
}

FunctionLibrary.hideCalculatorPopup = function(getCurrentScreen) {
    /*this is added if we made it draggable then need it orignal position to set it to orignal position after dragging*/
    //$(getCurrentScreen).css('left',FunctionLibrary.calcLeft);
    //$(getCurrentScreen).css('top',"");
    FunctionLibrary.showAndHideOverlay(false);

    $("#calculatorContainer").animate({
        height: 0
    }, 200, function() {
        $(getCurrentScreen).removeClass("show");
        $(getCurrentScreen).addClass("hide");

    });


}


/**function for shelll hover*/
FunctionLibrary.manageShellHover = function() {
        if (DeviceHandler.device == "desktop") {
            $("#navigatorMenuBtn, #navigatorGAAPBtn, #navigatorFavoritesBtn, #navigatorGlossaryBtn, #navigatorRespurceBtn, #navigatorHelpBtn, #navigatorCalcBtn, #navigatorTranscriptBtn, #navigatorAudioBtn, #navigatorPlayPauseBtn, #navigatorReplayBtn, #navigatorPlayBookmarkBtn, #navigatorNextBtn, #navigatorBackBtn").hover(
                function() {
                    if (!$(this).parent().hasClass("disabled"))
                        $(this).addClass("hover");
                },
                function() {
                    $(this).removeClass("hover");
                });
        }



    }
    /**function for popUp hover*/
FunctionLibrary.managePopupHover = function() {

    }
    /**function for Templates hover*/
FunctionLibrary.manageTemplatesHover = function() {

}