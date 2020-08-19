NavHighlightController = function() {}
NavHighlightController.data;
NavHighlightController.currentTime = -1;
//NavHighlightController.current=true;
NavHighlightController.lastXOff;
NavHighlightController.lastYOff;
NavHighlightController.description;

var evtMrg = new EventManager();
/*
@ this array store the refrence of the content images
*/
NavHighlightController.imgRefArr = [];

/*
@on orientaion change this function changes the images src and load it
*/
NavHighlightController.onOrientationChange = function() {
    for (var i = 0; i < NavHighlightController.imgRefArr.length; i++) {
        NavHighlightController.imgRefArr[i].onOrientaionChange();
    }
}


NavHighlightController.init = function(data) {
    MainController.markCurrentPageComplete();
    //NavHighlightController.current=false;
    $("#quickNav").parent().addClass("disabled");
    NavHighlightController.data = data;
    var NavHighlightControllerData = data;
    NavHighlightController.description = DataManager.templateXMLData.description;
    var contentImage = new ImageMain($("#imageHighlightContainer"), NavHighlightControllerData.image.use_image_tag);
    contentImage.setObject(NavHighlightControllerData.image);
    NavHighlightController.imgRefArr.push(contentImage);
    evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, NavHighlightController.onOrientationChange);

    setTimeout(function() {
        MainController.initializeTemplateInShell();
        if (NavHighlightController.data.disable_icon == "true") {
            NavHighlightController.disableAll();
        }
        DataManager.isNavHighlightShown = true;
    }, 300);

    NavHighlightController.removehighlight();
    $("#navigatorAudioBtn").parent().addClass("on").removeClass("off");
    DataManager.AudioElementvalume = false;
    AudioController.CheckAndUpdateMuteUnMute();

    $("#screenshot").remove();
}

NavHighlightController.disableAll = function() {
    $("#navigatorFavoritesBtn").parent().addClass('disabled');
    $("#navigatorGAAPBtn").parent().addClass('disabled');
    if (DataManager.isTrancriptOpen != true) {
        $("#navigatorTranscriptBtn").parent().removeClass("disabled");
    } else {
        $("#navigatorTranscriptBtn").parent().addClass("disabled");
    }
    $("#quickNav").parent().addClass("disabled");


}
NavHighlightController.enableAll = function() {
    $(".navHighlight").parent().removeClass('disabled');
    UIController.updateNavigationUIControls();
    if (DataManager.isTrancriptOpen == true) {
        $("#navigatorTranscriptBtn").parent().addClass("disabled");
    }

}

function pageAudioHandler(currTime, totTime) {
    trace(currTime + " -> " + totTime);
    var secs = parseInt(currTime);
    if (NavHighlightController.currentTime == secs) {
        return;
    }
    NavHighlightController.currentTime = secs;
    if (DeviceHandler.browser == "IE" && DeviceHandler.browserVersion == 8) {
        var secs = parseInt(currTime);
        switch (secs) {
            case 6:

                NavHighlightController.removehighlight();
                $("#navigatorNextBtn").addClass("navBtnHighlight1");
                $("#navigatorNextBtn").next().html($(NavHighlightController.description).attr("next"));
                $("#navigatorNextBtn").next().show();
                break;
            case 11:
                NavHighlightController.removehighlight();
                $("#navigatorBackBtn").addClass("navBtnHighlight2");
                $("#navigatorBackBtn").next().html($(NavHighlightController.description).attr("back"));
                $("#navigatorBackBtn").next().show();
                break;
            case 16:
                NavHighlightController.removehighlight();

                $("#navigatorPlayPauseBtn").addClass("navBtnHighlight3");
                $("#navigatorPlayPauseBtn").next().html($(NavHighlightController.description).attr("back"));
                $("#navigatorPlayPauseBtn").next().show();
                break;
            case 22:
                NavHighlightController.removehighlight();
                $("#navigatorAudioBtn").addClass("navBtnHighlight4");
                $("#navigatorAudioBtn").next().html($(NavHighlightController.description).attr("pause"));
                $("#navigatorAudioBtn").next().show();
                break;
            case 27:
                NavHighlightController.removehighlight();
                $("#navigatorMenuBtn").addClass("navBtnHighlight5");
                $("#navigatorMenuBtn").next().html($(NavHighlightController.description).attr("audio"));
                $("#navigatorMenuBtn").next().show();
                break;
            case 32:
                NavHighlightController.removehighlight();
                $("#navigatorGlossaryBtn").addClass("navBtnHighlight6");
                $("#navigatorGlossaryBtn").next().html($(NavHighlightController.description).attr("Glossery"));
                $("#navigatorGlossaryBtn").next().show();


                break;

            default:
                break;

        }
    } else {

        var secs = parseInt(currTime);
        switch (secs) {
            case 7:
                NavHighlightController.removehighlight();
                $("#navigatorNextBtn").addClass("navBtnHighlight1");
                $("#navigatorNextBtn").next().html($(NavHighlightController.description).attr("next"));
                $("#navigatorNextBtn").next().show();
                break;
            case 11:
                NavHighlightController.removehighlight();
                $("#navigatorBackBtn").addClass("navBtnHighlight2");
                $("#navigatorBackBtn").next().html($(NavHighlightController.description).attr("back"));
                $("#navigatorBackBtn").next().show();

                break;
            case 16:

                NavHighlightController.removehighlight();
                $("#navigatorPlayPauseBtn").addClass("navBtnHighlight3");
                $("#navigatorPlayPauseBtn").next().html($(NavHighlightController.description).attr("back"));
                $("#navigatorPlayPauseBtn").next().show();
                break;
            case 22:
                NavHighlightController.removehighlight();
                $("#navigatorAudioBtn").addClass("navBtnHighlight4");
                $("#navigatorAudioBtn").next().html($(NavHighlightController.description).attr("pause"));
                $("#navigatorAudioBtn").next().show();
                break;
            case 27:
                NavHighlightController.removehighlight();
                $("#navigatorMenuBtn").addClass("navBtnHighlight5");
                $("#navigatorMenuBtn").next().html($(NavHighlightController.description).attr("audio"));
                $("#navigatorMenuBtn").next().show();
                break;
            case 33:
                NavHighlightController.removehighlight();
                $("#navigatorGlossaryBtn").addClass("navBtnHighlight6");
                $("#navigatorGlossaryBtn").next().html($(NavHighlightController.description).attr("menu"));
                $("#navigatorGlossaryBtn").next().show();
                break;

            default:
                break;

        }
    }
    if (currTime >= totTime) {
        if (NavHighlightController.data.disable_icon == "true") {
            NavHighlightController.enableAll();
        }
        MainController.showNextInstruction();
        $("#btnSkip").hide();
        $("#quickNav").parent().removeClass("disabled");
        SubNavMenuController.screenshotPreview();
    }
}

NavHighlightController.highlightElement = function(obj) {
    if (DeviceHandler.browser == "IE" && DeviceHandler.browserVersion == 8) {
        NavHighlightController.lastYOff = obj.css("background-position-y");
        obj.css("background-position-y", "-292px");
    } else {
        var xOff = obj.css("background-position").split(" ")[0];
        var newStr = xOff + " -292px";
        obj.css("background-position", newStr);
    }
}
NavHighlightController.removehighlight = function(obj) {
    UIController.removeHighlight(obj);
}
NavHighlightController.normalizeElement = function(obj) {
    UIController.normalizeElement(obj);
}
NavHighlightController.isIE = function() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}