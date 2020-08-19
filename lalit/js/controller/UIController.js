/** UI Controller for the intializing shell elemets as per config data.
 *
 */

var UIController = {};
UIController.isdraggableSet = false;
UIController.current = false;
UIController.initUI = function() {
    $("#welcomeBox").hide();
    //$("#bodyOverlay").hide();
    UIController.builtShellUI();
}

UIController.builtShellUI = function() {
    if (DataManager.configData.features.showGlossary == 'false') {
        UIController.hideBottomNavigationElement("bottomNav_glossary");
    }
    if (DataManager.configData.features.showHelp == 'false') {
        UIController.hideBottomNavigationElement("bottomNav_help");
    }

    if (DataManager.configData.features.showTranscript == 'false') {
        //UIController.hideBottomNavigationElement("bottomNav_transcript");
    }
    if (DataManager.configData.features.showResources == 'false') {
        //UIController.hideBottomNavigationElement("bottomNav_resource");
    }
    if (DataManager.configData.features.showAudio == 'false') {
        UIController.hideBottomNavigationElement("bottomNav_audio");
        UIController.hideBottomNavigationElement("bottomNav_pause");
        UIController.hideBottomNavigationElement("bottomNav_replay");
    }
    if (DataManager.configData.features.showFavorite == 'false') {
        UIController.hideBottomNavigationElement("bottomNav_favorite");
    }
    if (DataManager.configData.features.showSynopsis == 'false') {
        UIController.hideBottomNavigationElement("bottomNav_synopsis");
    }

    if (DataManager.configData.features.allowSwipe == 'true') {
        $("#PageContent").touchwipe({
            wipeLeft: function(e) {
                MainController.wipeLeftHandler();
            },
            wipeRight: function(e) {
                MainController.wipeRightHandler();
                DataManager.isSliderLocked = true;
            },
            wipeUp: function(e) {
                e.preventDafult();
            },
            wipeDown: function(e) {
                e.preventDafult();
            },
            min_move_x: 50,
            min_move_y: 20,
            preventDefaultEvents: false
        });
    }
}

UIController.hideBottomNavigationElement = function(btn) {
    var refBtn = "#" + btn;
    $(refBtn).hide();
    $(refBtn + "+ li").hide();
}

UIController.updateCourseProgress = function() {

    if (DataManager.configData.features.showProgressBar == 'true') {
        var scaleFactor = $('#bottomNav_progressBar').width() / 100;

        var count = 0;
        for (var k = 0; k < DataManager.visitedPageArray.length; k++) {
            if (Number(DataManager.visitedPageArray[k]) == 1) {
                count++;
            }
        }

        Percentage = (100 * count) / DataManager.visitedPageArray.length;
        $('#progressLevel').css("width", (Percentage * scaleFactor) + "px");
        $('#percentageLabel').html(Percentage.toFixed(0) + '%');
    }
}

UIController.adjustTemplateInShell = function(totalHeight) {
    if (DeviceHandler.device == StaticLibrary.ANDROID) {
        UIController.repositionDraggables();
        if (UIController.isdraggableSet == true) {
            UIController.isdraggableSet = false;
        }
        return;
    }
    setTimeout(function() {
        if (!DataManager.shellInitialized)
            return;
        UIController.repositionTemaplate();
        $("#div_" + currentPageLocationIndex).show();
        if (DataManager.audioElement) {
            UIController.playAudio();
        };
    }, 600);

    /*to set the calculator trancript drag*/
    UIController.repositionDraggables();
    if (UIController.isdraggableSet == true) {
        UIController.isdraggableSet = false;
    }
}

UIController.playAudio = function() {
    if (DataManager.audioElement.duration != null && DataManager.audioElement.duration != "null" && DataManager.audioElement.duration > 0) {
        MainController.hideLoading();
        AudioController.playAudio();
    } else {
        setTimeout(function() {
            UIController.playAudio();
        }, 2000);
    }
};

UIController.repositionTemaplate = function() {

    if (DeviceHandler.device == StaticLibrary.ANDROID)
        return;

    var contentHeight = $("#div_" + currentPageLocationIndex).height();
    if (contentHeight < 50)
        contentHeight = 560;
    var topOffset = (mainContainerHeight - contentHeight) / 2;

    if (DataManager.nAgt.indexOf("iPad") >= 0)
        $("#div_" + currentPageLocationIndex).css("top", topOffset - 5);
    else
        $("#div_" + currentPageLocationIndex).css("top", topOffset);
}

UIController.updateNavigationUIControls = function() {

    if (DataManager.isNavHighlightShown) {
        DataManager.isNavHighlightShown = false;
        UIController.removeHighlight();
    }

    UIController.normalizeHightlight();
    MainController.hideNextInstruction();
    MainController.hideGaapInstruction();

    $("#shellPopupContainer").hide();
    $("#internalPopupOverlay").hide();
    $("#navigatorCopyWriteBtn").parent().removeClass("disabled");

    $("#navigatorHelpBtn").parent().removeClass("disabled");
    $("#navigator_new_icon").parent().removeClass("disabled");

    $("#navigatorGlossaryBtn").parent().removeClass("disabled");
    $("#navigatorCalcBtn").parent().removeClass("disabled");
    $("#navigatorFavoritesBtn").parent().removeClass("disabled");
    $("#navigatorGAAPBtn").parent().removeClass("disabled");
    $("#navigatorPlayBookmarkBtn").parent().removeClass("disabled");
    $("#navigatorRespurceBtn").parent().removeClass("disabled");
    $("#quickNav").parent().removeClass("disabled");

    //Handle Audio and Transcript buttons
    if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.HAS_AUDIO] == "true") {

        $("#navigatorAudioBtn").parent().removeClass("disabled");
        $("#navigatorTranscriptBtn").parent().removeClass("disabled");

        if (DataManager.isTrancriptOpen != true) {
            $("#navigatorTranscriptBtn").parent().removeClass("disabled");
        } else {
            $("#navigatorTranscriptBtn").parent().addClass("disabled");
        }

        $("#navigatorPlayPauseBtn").parent().removeClass("disabled");

        $("#navigatorReplayBtn").parent().removeClass("disabled");

        $("#audioIndicator").removeClass("off").addClass("on");

    } else {

        $("#navigatorAudioBtn").parent().addClass("disabled");
        $("#navigatorTranscriptBtn").parent().addClass("disabled");
        $("#navigatorPlayPauseBtn").parent().addClass("disabled");
        $("#navigatorReplayBtn").parent().addClass("disabled");
        $(".audioSlider").hide();
        $("#navigatorAudioBtn").parent().removeClass("off");

        DataManager.AudioElementvalume = true;
        $("#audioIndicator").removeClass("on").addClass("off");

        if (DataManager.isTrancriptOpen == true) {
            FunctionLibrary.hideTranscriptPopup("#transcriptView");
        }


    }

    DeviceHandler.disableElementsOnDevice();

    $("#navigatorReplayBtn").parent().removeClass("disabled");

    if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.ENABLE_MENU] == "true")
        $("#navigatorMenuBtn").parent().removeClass("disabled");
    else
        $("#navigatorMenuBtn").parent().addClass("disabled");

    NextBackController.updateNextControl();

    if (currentPageLocationIndex != DataManager.TOCData.length - 1 && DataManager.visitedPageArray[currentPageLocationIndex] == 1) {
        $("#navigatorNextBtn").parent().removeClass("disabled");
    }
    if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.SHOW_TITLE] == "true")
        $("#moduleTitle").show();
    else
        $("#moduleTitle").hide();
}

UIController.normalizeHightlight = function() {
    $(".navHighlight").removeClass('navBtnHighlight');
    UIController.normalizeElement($("#navigatorNextBtn"));
    UIController.normalizeElement($("#navigatorBackBtn"));
    UIController.normalizeElement($("#navigatorPlayPauseBtn"));
    UIController.normalizeElement($("#navigatorGlossaryBtn"));
    UIController.normalizeElement($("#navigatorPlayBookmarkBtn"));
}

UIController.normalizeElement = function(obj) {
    if (DeviceHandler.browser == "IE" && DeviceHandler.browserVersion == 8) {
        obj.css("background-position-y", "");
    } else {
        obj.css("background-position", "");
    }
}

UIController.UIControlDisabledOnAssessment = function() {

    $("#navigatorCopyWriteBtn").parent().addClass("disabled");
    $("#navigatorAudioBtn").parent().addClass("disabled");

    FunctionLibrary.hideTranscriptPopup("#transcriptView");

    $("#navigatorTranscriptBtn").parent().addClass("disabled");
    $("#navigatorMenuBtn").parent().addClass("disabled");

    $("#navigatorHelpBtn").parent().addClass("disabled");
    $("#navigator_new_icon").parent().addClass("disabled");

    $("#navigatorGlossaryBtn").parent().addClass("disabled");
    $("#navigatorPlayPauseBtn").parent().addClass("disabled");

    $("#navigatorReplayBtn").parent().addClass("disabled");
    $("#navigatorBackBtn").parent().addClass("disabled");
    $("#navigatorNextBtn").parent().addClass("disabled");
    $("#navigatorFavoritesBtn").parent().addClass("disabled");
    $("#navigatorGAAPBtn").parent().addClass("disabled");
    $("#navigatorRespurceBtn").parent().addClass("disabled");
    $("#navigatorCalcBtn").parent().addClass("disabled");
    $("#navigatorPlayBookmarkBtn").parent().addClass("disabled");
    $("#quickNav").parent().addClass("disabled");
    //MainController.lockMoveNavigation();
    DataManager.isSliderLocked = true;
}

UIController.UIControlEnabledOnAssessment = function() {
    $("#navigatorMenuBtn").parent().removeClass("disabled");
}


/*This is added to set the trancript and calculator  postion*/
UIController.repositionDraggables = function() {

    if (UIController.isdraggableSet == false) {

        var eleOffsetLeft = $("#calculatorContainer").offset().left;
        var eleOffsetTop = $("#calculatorContainer").offset().top;
        var eleOffsetLeft_t = $("#transcriptPopup").offset().left;
        var eleOffsetTop_t = $("#transcriptPopup").offset().top;
        var widthDiff = parseInt(DataManager.orig_width - $(window).width());
        var heightDiff = parseInt(DataManager.orig_height - $(window).height());
        DataManager.orig_width = $(window).width();
        DataManager.orig_height = $(window).height();
        var offsetLeftDiff = parseInt(eleOffsetLeft - widthDiff);
        var offsetTopDiff = parseInt(eleOffsetTop - heightDiff);
        var offsetLeftDiff_t = parseInt(eleOffsetLeft_t - widthDiff);
        var offsetTopDiff_t = parseInt(eleOffsetTop_t - heightDiff);
        if (($("#calculatorContainer").offset().left + $("#calculatorContainer").width()) > $(window).width()) {
            $("#calculatorContainer").offset({
                left: offsetLeftDiff
            });
            UIController.isdraggableSet = true;
        }
        if (($("#calculatorContainer").offset().top + $("#calculatorContainer").height()) > $(window).height()) {
            $("#calculatorContainer").offset({
                top: offsetTopDiff
            });
            UIController.isdraggableSet = true;
        }

        if (($("#transcriptPopup").offset().left + $("#transcriptPopup").width()) > $(window).width()) {
            $("#transcriptPopup").offset({
                left: offsetLeftDiff_t
            });
            UIController.isdraggableSet = true;
        }

        if (($("#transcriptPopup").offset().top + $("#transcriptPopup").height()) > $(window).height()) {

            $("#transcriptPopup").offset({
                top: offsetTopDiff_t
            });
            UIController.isdraggableSet = true;
        }
        if ($("#transcriptPopup").offset().top < 0) {
            $("#transcriptPopup").offset({
                top: 70
            });

        }
    }
}

UIController.removeHighlight = function() {
    $("#navigatorNextBtn").next().html("");
    $("#navigatorNextBtn").next().hide();
    $("#navigatorBackBtn").next().html("");
    $("#navigatorBackBtn").next().hide();

    $("#navigatorPlayPauseBtn").next().html("");
    $("#navigatorPlayPauseBtn").next().hide();

    $("#navigatorAudioBtn").next().html("");
    $("#navigatorAudioBtn").next().hide();
    $("#navigatorGlossaryBtn").next().html("");
    $("#navigatorGlossaryBtn").next().hide();
    $("#navigatorGAAPBtn").next().html("");
    $("#navigatorGAAPBtn").next().hide();
    $("#navigatorPlayBookmarkBtn").next().html("");
    $("#navigatorPlayBookmarkBtn").next().hide();
    $("#navigatorMenuBtn").next().html("");
    $("#navigatorMenuBtn").next().hide();
    $(".moduleNo .tooltip").html("");
    $(".moduleNo .tooltip").hide();
    $("#audioIndicatorTooltip").html("");
    $("#audioIndicatorTooltip").hide("");

    $(".navHighlight").removeClass('navBtnHighlight1');
    $(".navHighlight").removeClass('navBtnHighlight2');
    $(".navHighlight").removeClass('navBtnHighlight3');
    $(".navHighlight").removeClass('navBtnHighlight4');
    $(".navHighlight").removeClass('navBtnHighlight5');
    $(".navHighlight").removeClass('navBtnHighlight6');
    $(".navHighlight").removeClass('navBtnHighlight7');
    $(".navHighlight").removeClass('navBtnHighlight8');
    $(".navHighlight").removeClass('navBtnHighlight9');
    $(".navHighlight").removeClass('navBtnHighlight10');
    $(".navHighlight").removeClass('navBtnHighlight');
    $(".navHighlight").removeClass('navBtnHighlight');

}