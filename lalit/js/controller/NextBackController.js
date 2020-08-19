var NextBackController = function() {

}

var isHomeMenuShown = false;
var firsPagesOfModules = [];
var navDirection = 0;

NextBackController.NextBtn = function() {
    clearInterval(MainController.intervalValue);
    $("#loadingContainer").css("display", "none");

    if (navDirection == 1 && !homeBtnClicked) {

        var shouldHomeScreen = false;
        for (var i = 0; i < firsPagesOfModules.length; i++) {
            if (firsPagesOfModules[i] == currentPageLocationIndex) {
                shouldHomeScreen = true;
                break;
            }
        }

        if (shouldHomeScreen && !isHomeMenuShown) {

            eventMgr.dispatchCustomEvent(document, StaticLibrary.ON_PAGE_UNLOADED, true, {});

            isHomeMenuShown = true;
            TileMenuController.updateMenu();
            MenuController.showTileMenu();

            $('#close_tile_menu').hide();
            $('#close_tile_menu01').show();
            $('#bodyOverlay').hide();

        } else {

            if (isHomeMenuShown) {
                $('#close_tile_menu').trigger('click');
                currentPageLocationIndex--;
            }

            if (currentPageLocationIndex != DataManager.TOCData.length) {
                if (DataManager.audioElement) {
                    DataManager.audioElement.pause();
                }
                MainController.PageLoader(currentPageLocationIndex);
            }
            isHomeMenuShown = false;
            $('.iosSlider').iosSlider('goToSlide', currentPageLocationIndex + 1);
            NextBackController.updateNextControl();
        }
    } else {
        isHomeMenuShown = false;
        if (currentPageLocationIndex != DataManager.TOCData.length) {
            if (DataManager.audioElement) {
                DataManager.audioElement.pause();
            }
            MainController.PageLoader(currentPageLocationIndex);
        }
    }
}

NextBackController.BackBtn = function() {
    isHomeMenuShown = false;
    if (currentPageLocationIndex != -1) {
        if (DataManager.audioElement) {
            DataManager.audioElement.pause();
        }
        MainController.PageLoader(currentPageLocationIndex);
    }
    if (currentPageLocationIndex == 0) {
        NextBackController.disableBackButton(true);
    }
}

NextBackController.updateNextControl = function() {

    if (currentPageLocationIndex == DataManager.TOCData.length - 1) {
        NextBackController.disableNextButton(true);
    } else {
        if (DataManager.visitedPageArray[currentPageLocationIndex] == 1) {
            NextBackController.disableNextButton(false);
        } else {
            MainController.lockSlideNavigation();
            NextBackController.disableNextButton(true);
        }
    }

    if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.ENABLE_BACK] == "true" && currentPageLocationIndex > 0) {
        NextBackController.disableBackButton(false);
    } else {
        NextBackController.disableBackButton(true);
    }
}

NextBackController.updatedNavigationButton = function() {
    if (currentPageLocationIndex == 0) {
        NextBackController.disableBackButton(true);
    } else {
        if (currentPageLocationIndex == DataManager.TOCData.length - 1) {
            NextBackController.disableNextButton(true);
        } else {
            NextBackController.disableNextButton(false);
        }
    }
}

NextBackController.disableNextButton = function(flag) {
    //trace("disableNext "+flag);
    if (flag)
        $(".prevNextBtns ,.btnNext").addClass("disabled");
    else
        $(".prevNextBtns ,.btnNext").removeClass("disabled");
}

NextBackController.disableBackButton = function(flag) {
    //trace("disableBack "+flag);
    if (flag)
        $(".prevNextBtns,.btnBack").addClass("disabled");
    else
        $(".prevNextBtns,.btnBack").removeClass("disabled");
}

NextBackController.getBackButtonState = function(flag) {
    var state = 'enable';
    if ($(".prevNextBtns,.btnBack").hasClass("disabled"))
        state = 'disable';

    return state;
}

NextBackController.getNextButtonState = function(flag) {
    var state = 'enable';
    if ($(".prevNextBtns,.btnNext").hasClass("disabled"))
        state = 'disable';

    return state;
}

NextBackController.disableNavigationButton = function() {
    //called only after clicking next or back button
    MainController.sliderStartLoadHandler();
    NextBackController.disableBackButton(true);
}