/** Main Controller for the entire Application.
 *
 */
var MainController = {};

//Variable for Page Data holder.
var pageCount = 0;
var tempStr = "";
var tempObj;
var currentPageLocationIndex = 0;
var lastPageReferenceIndex = -1;
var mainContainerHeight = 660;

var _isActiveRightClick = false;

//value re-assigned from ios slider resize event
MainController.firstLoad = true;
MainController.intervalValue = "";

MainController.pageInterval = 600;

MainController.noOfPagesToPreload = 1; // number of pages for assets preload
MainController.isGroup = false;

var eventMgr = new EventManager();
var shellInitialized = false;

var tempPathStr;
var tempPathArr = [];
var imgCounter = 0;
var currentPageNo = -1;
var homeBtnClicked = false;
var modulewiseScrollPos = [0, 0];
var modulewiseStartEndidx = [];

MainController.lockSlideNavigation = function() {
    $(".iosSlider").iosSlider('lock');
}

function finish() {}


$(document).ready(function() {

    DeviceHandler.bindOrientaionEvent();

    DataManager.orig_width = $(window).width();
    DataManager.orig_height = $(window).height();

    Parser.checkDataTypeFn();
    DeviceHandler.detectDevice();

    /*--------For Insert trace print------------*/

    $(document).keydown(function(e) {

        if (e.which == 17) {
            isCtrl = true;
        }
        if (e.which == 16) {
            isShift = true;
        }
        if (e.which == 45 && isCtrl && isShift) {
            FunctionLibrary.showPopup("#tracePopup");
        }
    });

    $(".traceClose").bind("click", function() {
        FunctionLibrary.hidePopup("#tracePopup");
    });
    /*--------For Insert trace print end------------*/

    if (DeviceHandler.device == StaticLibrary.DESKTOP) {
        //alert("Course is best viewed in maximize mode.")
        $("#exitBtn").show();
    } else {
        $("#exitBtn").hide();

    }

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_CONFIG_DATA, MainController.courseConfigurationHandler);

    if (scoCompliance == "local" && navigationMode == "locked") {
        APIService.loadCourseConfigFn("config_LOCAL_locked.json", false, "json");
    } else if (scoCompliance == "local" && navigationMode == "unlocked") {
        APIService.loadCourseConfigFn("config_LOCAL_unlocked.json", false, "json");
    } else if (scoCompliance == "scorm1_2" && navigationMode == "locked") {
        APIService.loadCourseConfigFn("config_SCORM12_locked.json", false, "json");
    } else {
        APIService.loadCourseConfigFn("config_SCORM12_unlocked.json", false, "json");
    }

    MainController.lockSlideNavigation();
    DeviceHandler.disableElementsOnDevice();
    DeviceHandler.adjustIntroVideo();
    FunctionLibrary.manageShellHover();

});


MainController.openPDF = function(pdfPath, win) {
    var winWidth = 1014;
    var winHeight = 660;
    var newWin;
    var option = "width=" + winWidth + ",height=" + winHeight + ", resizable=yes,top=" + 0 + ",left=" + 0 + "";
    newWin = window.open(pdfPath, win, option);
    newWin.focus();
}
MainController.courseConfigurationHandler = function(event) {

    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_CONFIG_DATA, MainController.courseConfigurationHandler);

    MainController.showLoading();
    DataManager.configData = Parser.loadConfigDataFn(event.obj);

    DataManager.settingDataObj.courseDataType = DataManager.configData.course.courseDataType;
    UIController.initUI();

    var pageurl = DataManager.configData[StaticLibrary.CONFIG_SHORTCUTFILEPATH]["shortcutUrl"] + 'shortcutkey.txt';

    $.ajax({
        url: pageurl,
        async: false,
        dataType: "text",
        success: function(data) {
            DataManager.shortcutData = data;
            DeviceHandler.disableElementsOnDevice();
        },
        error: function() {

        }
    });

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_APPLICATION_SETTING, MainController.courseSettingHandler);

    var dataURLPath = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/data/courseDataURL.json";

    //trace(":: CALL TO COURSE SETTING STARTS ::" + dataURLPath);

    APIService.loadCourseSettingFn(dataURLPath, false, DataManager.settingDataObj.courseDataType);

    //trace(":: CALL TO COURSE SETTING ENDS ::");
}

MainController.courseShortcutHandler = function(event) {
    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_SHORTCUT_DATA, MainController.courseShortcutHandler);
    DataManager.shortcutData = Parser.loadShortcutDataFn(event.obj);
    DeviceHandler.disableElementsOnDevice();
    // trace(DataManager.shortcutData)
}


MainController.courseSettingHandler = function(event) {

    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_APPLICATION_SETTING, MainController.courseSettingHandler);
    tempObj = event.obj;
    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        var tempScormURL = "";
        var tempScriptStr = "<script type='text/javascript'>";
        if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] == "scorm1_2") {
            tempScormURL = "libs/scorm/scorm1_2_api.js";
        } else {
            tempScormURL = "libs/scorm/scorm_2004_api.js";
        }
        MainController.scormScripLoader(tempScormURL, function() {
            MainController.scormScripLoadHandler();
        });
    } else {
        MainController.scormScripLoadHandler();
    }
}

MainController.scormScripLoader = function(currentScriptSRC, callback) {
    var s = document.createElement('script');
    s.src = currentScriptSRC;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}

MainController.scormScripLoadHandler = function() {
    if (DataManager.configData.course.navigationMode == "linear") {
        DataManager.isTOCLocked = true;
    } else {
        DataManager.isTOCLocked = false;
    }

    DataManager.settingDataObj.dataURL = DataManager.configData.course.courseFolder + tempObj[0].setting.dataURL;
    DataManager.settingDataObj.templateDataURL = DataManager.configData.course.courseFolder + tempObj[0].setting.dataURL + "course_data/";
    DataManager.settingDataObj.appVideoURL = DataManager.configData.course.courseFolder + tempObj[0].setting.videoURL;
    DataManager.settingDataObj.appSWFURL = DataManager.configData.course.courseFolder + tempObj[0].setting.swfURL;
    DataManager.settingDataObj.appImageURL = DataManager.configData.course.courseFolder + tempObj[0].setting.imageURL;
    DataManager.settingDataObj.appAudioURL = DataManager.configData.course.courseFolder + tempObj[0].setting.audioURL;
    DataManager.settingDataObj.appAssessmentURL = DataManager.configData.course.courseFolder + tempObj[0].setting.assessmentURL;
    DataManager.settingDataObj.retinaImageUrl = DataManager.configData.course.courseFolder + tempObj[0].setting.retinaImageUrl;

    var audioArrStr = tempObj[0].setting.courseAudio;
    DataManager.audioArray = audioArrStr.split(",");

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_GAAP_DATA, globalGaapSuccessHandler);
    APIService.loadGaapContentDataFn(DataManager.settingDataObj.dataURL + "gaap.json", false, DataManager.settingDataObj.courseDataType);

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_RESOURCE_DATA, globalResourceSuccessHandler);
    APIService.loadResourceContentDataFn(DataManager.settingDataObj.dataURL + "resource.json", false, DataManager.settingDataObj.courseDataType);

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_DETAILS_DATA, globalDetailsSuccessHandler);
    APIService.loadDetailsContentDataFn(DataManager.settingDataObj.dataURL + "details.json", false, DataManager.settingDataObj.courseDataType);

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_GLOSSARY_DATA, glossarySuccessHandler);
    APIService.loadGlossaryDataFn(DataManager.settingDataObj.dataURL + "glossary.json", false, DataManager.settingDataObj.courseDataType);

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_GLOBAL_CONTENT, globalContentSuccessHandler);
    APIService.loadExternalGlobalContentDataFn(DataManager.settingDataObj.dataURL + "globalContent.json", false, DataManager.settingDataObj.courseDataType);

    eventMgr.addControlEventListener(document, StaticLibrary.LOAD_TOC_COURSE_DATA, tocSuccessHandler);

    APIService.loadTOCCourseDataFn(DataManager.settingDataObj.dataURL + "toc.json", false, DataManager.settingDataObj.courseDataType);
}

globalResourceSuccessHandler = function(event) {
    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_RESOURCE_DATA, globalResourceSuccessHandler);

    DataManager.ResourceObj = JSONParser.parseResourceData(event.obj);
    ResourceController.createResource();
}

globalDetailsSuccessHandler = function(event) {
    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_DETAILS_DATA, globalDetailsSuccessHandler);
    DataManager.DetailsObj = JSONParser.parseDetailsData(event.obj);
    DetailsController.createDetails();
}

globalGaapSuccessHandler = function(event) {
    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_GAAP_DATA, globalGaapSuccessHandler);
    DataManager.GaapObj = JSONParser.parseGaapData(event.obj);
    GaapController.createGaap();
}

//It loads global content
globalContentSuccessHandler = function(event) {
    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_GLOBAL_CONTENT, globalContentSuccessHandler);
    globalContentData = Parser.loadGlobalContentDataFn(event.obj);
    // MainController.updateCourseTitle(globalContentData.courseTitle);
    $("section").find("nav").find("#clickNextInfo").html(globalContentData.nextInstruction);
}

// TOC Success Handler
tocSuccessHandler = function(event) {

    eventMgr.removeControlEventListener(StaticLibrary.LOAD_TOC_COURSE_DATA, tocSuccessHandler);

    var TOCMenuData = Parser.loadCourseDataFn(event.obj);
    DataManager.multiLevelTOCData = TOCMenuData;
    MainController.getFistPageIndexOfEachMod();
    DataManager.TOCData = Parser.loadCourseDataSingleLevelFn(TOCMenuData);

    MainController.getModulewiseStartEndidx();
    var dataStr = "";

    for (var i = 0; i < DataManager.TOCData.length; i++) {
        dataStr += '<div id="div_' + i + '" class="item"></div>';
        DataManager.visitedPageArray.push(0);
        DataManager.alreadyPlayedVideoTimeArray.push(0);
    }

    showPageContentAfterPreload();

    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local")
        SCORMAPIService.initializeService();
    $(".slider").html(dataStr);

    $('.iosSlider').iosSlider({
        snapToChildren: true,
        desktopClickDrag: false,
        keyboardControls: false,
        navSlideSelector: $('.popupContent .linkData'),
        onSlideComplete: MainController.slideComplete,
        navNextSelector: $('#navigatorNextBtn'),
        navPrevSelector: $('#navigatorBackBtn'),
        onSlideChange: MainController.changeSlideIdentifier
    });

    SubNavMenuController.createSubNavMenu();
    MenuController.CreateMenu(TOCMenuData);
    MainController.loadUI();
}

MainController.updateCourseTitle = function(title) {
    var _cTitle = title
    document.title = _cTitle;
    $("header #shellCourseTitle").html(_cTitle);
    $("header").find("#courseTitle").html(_cTitle);
}

MainController.getFistPageIndexOfEachMod = function() {
    try {
        var dataLen = DataManager.multiLevelTOCData.length;
        var pagesLen = 0;
        var tempObj = {};
        for (var moduleNo = 0; moduleNo < dataLen; moduleNo++) {
            pagesLen = (DataManager.multiLevelTOCData[moduleNo]).length
            if (moduleNo > 0) {
                tempObj.startIndex = tempObj.endIndex + 1;
                tempObj.endIndex = (tempObj.startIndex) + (pagesLen) - 1;
            } else {
                tempObj.startIndex = moduleNo;
                tempObj.endIndex = pagesLen - 1;
            }
            firsPagesOfModules.push(tempObj.startIndex);
        }
    } catch (e) {
        trace("MainController:	getFistPageIndexOfEachMod" + e);
    }
}

glossarySuccessHandler = function(event) {
        eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_GLOSSARY_DATA, glossarySuccessHandler);
        DataManager.glossaryCollection = Parser.loadGlossaryDataFn(event.obj);
        GlossaryController.CreateGlossary(DataManager.glossaryCollection);
    }
    /* wipe left handler*/
MainController.wipeLeftHandler = function() {

    if (DataManager.isSliderLocked) {
        return;
    }
}
MainController.wipeRightHandler = function() {
    if (DataManager.isSliderLocked) {
        return;
    }

}


/*To manage the shell resize*/
MainController.onShellResize = function(ht) {
    mainContainerHeight = ht;
    UIController.repositionTemaplate();
}

MainController.initializeTemplateInShell = function() {

    DataManager.isPageLoaded = true;
    MainController.showPageInShell();
    UIController.repositionTemaplate();

    if (DeviceHandler.device == StaticLibrary.ANDROID) {
        MainController.hideLoading();
    }


}

MainController.initializeAudioInShell = function() {
    if (!DataManager.isAudioLoaded) {
        DataManager.isAudioLoaded = true;
        MainController.showPageInShell();
    };
}

MainController.showPageInShell = function() {

    if (DataManager.isAudioLoaded && DataManager.isPageLoaded) {
        DataManager.isSliderLocked = false;
        currentPageNo = currentPageLocationIndex;
        DataManager.isAudioLoaded = false;
        DataManager.isPageLoaded = false;
        MainController.adjustTemplateInShell(mainContainerHeight);
    } else if (DataManager.isInternalAudioPlaying) {
        setTimeout(function() {
            DataManager.isAudioLoaded = false;
            if (DataManager.audioElement && DataManager.audioElement.paused)
                DataManager.audioElement.play();
        }, 600);

    }
}

MainController.adjustTemplateInShell = function(totalHeight) {
    UIController.adjustTemplateInShell(totalHeight);
    setTimeout(function() {
        UIController.repositionTemaplate();
        try {
            if (DataManager.enablePreCaching) {
                assetPreloader.initializeAssetLoader();
            }
        } catch (err) {}
    }, 1200)
}

MainController.changeSlideIdentifier = function() {
    MainController.hideNextInstruction();
    MainController.hideGaapInstruction();
}

MainController.sliderStartLoadHandler = function() {
    MainController.showLoading();
    AudioController.removeCurrentPageAudio();
}

MainController.slideComplete = function(args) {
    DataManager.menuOpenState = false;
    $('#navigatorNextBtn, #navigatorBackBtn').removeClass('unselectable');
    if (args.currentSlideNumber == 1) {
        $('#navigatorBackBtn').addClass('unselectable');
    } else if (args.currentSliderOffset == args.data.sliderMax) {
        $('#navigatorNextBtn').addClass('unselectable');
    }
}

MainController.loadUI = function() {
    NavigatorController.bindNavigatorEvents();
    HelpController.CreateHelp(DataManager.helpDataObj);
    $("#bodyOverlay").hide();
    $("#closePoopIntrBtn").one("click", function() {
        $("#instPopUp").hide();
        $("#bodyOverlay").hide();
        loadUIHandler()
    })

    function loadUIHandler() {
        if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local" && (currentPageLocationIndex > 0 || SCORMAPIService.getSuspendDataStr().length > 0)) {
            FunctionLibrary.showBookmarPopup(true);
        } else {
            FunctionLibrary.showWelcomeNote();

        }
    }

    setTimeout(function() {
        FunctionLibrary.showAndHideOverlay(true);
        $("#instPopUp").show();
    }, 400);

}

MainController.bookmarkPopupHandler = function(evt) {

    FunctionLibrary.showBookmarPopup(false);
    DataManager.shellInitialized = true;

    AudioController.InitializeAudioElement('#audioPlayerObj');
    AudioController.playInternalAudio('blank');

    if ($(evt.target).attr("id").indexOf("yes") >= 0) {

    } else {
        currentPageLocationIndex = 0;
    }

    $("#navigatorMenuBtn").parent().show();
    MainController.loadFirstPage();
    $('#startCourse').trigger('click');
}

MainController.loadFirstPage = function() {
    isHomeMenuShown = false;
    $('.iosSlider').iosSlider('goToSlide', currentPageLocationIndex + 1);
    MainController.PageLoader(currentPageLocationIndex);
    NextBackController.updateNextControl();
}

MainController.jumpToPage = function(index) {
    isHomeMenuShown = false;
    MainController.lockSlideNavigation();
    MainController.sliderStartLoadHandler();
    $('.iosSlider').iosSlider('goToSlide', index + 1);
    MainController.PageLoader(parseInt(index));

}

MainController.PageLoader = function(currentIndex) {


    try {
        assetPreloader.abortAssetPreloader();
    } catch (err) {

    }

    try {
        if (videoObject && videoObject.videodata != "") {
            videoObject.PlayPauseAnimation();
        }
    } catch (e) {}

    clearInterval(MainController.intervalValue);

    $(".iosSlider .slider .item").css("display", "none");
    $("#loadingContainer").css("display", "none");

    videoObject = {};
    animObject = {};

    $("#navigatorPlayPauseBtn").next('span').html("Play");
    $("#bottomNav_pause").removeClass('pause').addClass('disabled play');

    TileMenuController.hideTileMenu();

    DataManager.isAudioLoaded = false;
    MainController.showLoading();

    currentPageLocationIndex = currentIndex;
    DataManager.gaapHighlight = false;

    FunctionLibrary.hidePopup("#menuView");
    MainController.lockSlideNavigation();

    var tempXMLURL;

    var _isGroup = DataManager.TOCData[currentPageLocationIndex].isGroup || "false"

    MainController.isGroup = _isGroup;

    if (MainController.isGroup == "true") {
        var _pageURL = DataManager.TOCData[currentPageLocationIndex].pageData;
        DataManager.settingDataObj['directoryURL'] = './course_01/' + _pageURL + '/' + _pageURL;
        tempXMLURL = DataManager.settingDataObj.directoryURL + '.json'
    } else if (DataManager.TOCData[currentPageLocationIndex].assessment == "true") {
        tempXMLURL = DataManager.settingDataObj.appAssessmentURL + "assessmentStartPage.json";
    } else {
        tempXMLURL = DataManager.settingDataObj.templateDataURL + DataManager.TOCData[currentPageLocationIndex][StaticLibrary.PAGE_SCRIPT] + "." + DataManager.settingDataObj.courseDataType;
    }


    try {

        eventMgr.addControlEventListener(document, StaticLibrary.LOAD_TEMPLATE_LEVEL_DATA, loadTemplateDataHandler);

        APIService.loadTemplateLevelDataFn(tempXMLURL, false, DataManager.settingDataObj.courseDataType);
    } catch (error) {
        trace('PageLoader:  ' + error);
    }

    UIController.updateNavigationUIControls();
    FavoriteController.checkFavorite();
    MainController.updatedPageNo();

    TranscriptController.CreateTranscript(currentPageLocationIndex);

    var currentGAApref = DataManager.TOCData[currentPageLocationIndex].gaapId[0];

    GaapController.updataGaap(currentGAApref);

    if (DataManager.isTOCLocked) {
        SubNavMenuController.updateEnabled();
    }


}


loadTemplateDataHandler = function(event) {

    eventMgr.removeControlEventListener(document, StaticLibrary.LOAD_TEMPLATE_LEVEL_DATA, loadTemplateDataHandler);

    if (DataManager.TOCData[currentPageLocationIndex].assessment == "true") {
        DataManager.assementStartEndData = Parser.loadAssessmentStartEndDataFn(event.obj);

    } else {
        DataManager.templateXMLData = event.obj;
        if (DeviceHandler.device == StaticLibrary.ANDROID) {
            tempPathStr = DataManager.templateXMLData.data.downloadAndroidImages;
        } else if (DeviceHandler.device == StaticLibrary.IPAD) {
            tempPathStr = DataManager.templateXMLData.data.downloadIpadImages;
        } else {
            tempPathStr = DataManager.templateXMLData.data.downloadImages;
        }
    }

    DataManager.pageThemePath = DataManager.TOCData[currentPageLocationIndex][StaticLibrary.PAGE_THEME];

    if ((tempPathStr != "") && (tempPathStr != undefined)) {
        tempPathArr = [];
        tempPathArr = tempPathStr.split(",");
        eventMgr.addControlEventListener(AssetPreloader, StaticLibrary.ASSET_LOADED, MainController.AllAssetsLoadedFn);
        AssetPreloader.loadAsset(tempPathArr);
    } else {
        MainController.AllAssetsLoadedFn();
    }
}

MainController.AllAssetsLoadedFn = function() {

    SubNavMenuController.updateSubNavMenu();
    eventMgr.removeControlEventListener(AssetPreloader, StaticLibrary.ASSET_LOADED, MainController.AllAssetsLoadedFn);
    if (lastPageReferenceIndex != currentPageLocationIndex) {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.ON_PAGE_UNLOADED, true, {});
        $("#div_" + (lastPageReferenceIndex)).html("");
        lastPageReferenceIndex = currentPageLocationIndex;
    }

    $("#moduleTitle").text("");

    var modId = DataManager.TOCData[currentPageLocationIndex].moduleId;
    var topicId = DataManager.TOCData[currentPageLocationIndex].topicId;

    $('#wrapperCont').css('background-color', DataManager.courseStruct[modId].backgroundColor);
    if (DeviceHandler.device == StaticLibrary.DESKTOP) {
        $("#exitBtn").hover(function() {
            if ($("#tile_menu_container").is(':visible')) {
                $(this).css("color", "#00338d");
            } else {
                $(this).css("color", DataManager.courseStruct[modId].backgroundColor);
            }
        }, function() {
            $(this).css("color", "#ffffff");
        });
    }

    $('.exitButton_holder').css('border-color', DataManager.courseStruct[modId].backgroundColor);
    $('#topicTitle').css('color', DataManager.courseStruct[modId].backgroundColor);

    var modTitle = DataManager.courseStruct[modId].title;

    var topicPageTitle = DataManager.TOCData[currentPageLocationIndex].title;

    var pc = DataManager.TOCData[currentPageLocationIndex].pageContent;

    if (pc == 'blank') {
        pc = DataManager.TOCData[currentPageLocationIndex].template;
    }

    pc = currentPageLocationIndex + ":" + pc;

    $('#debugPageNum').html(pc);

    $('#topicTitle').html(topicPageTitle);
    $("#moduleTitle").text(modTitle);

    $('#moduleTitleContainer').attr('modId', modId);

    DataManager.templateCurrentParent = $("#div_" + currentPageLocationIndex);

    DataManager.templateCurrentParent.hide();

    var tempContainer = ($("#PageContent").find("#div_" + currentPageLocationIndex));

    var htmlPath;

    if (MainController.isGroup == "true") {
        htmlPath = DataManager.settingDataObj.directoryURL;
    } else if (DataManager.TOCData[currentPageLocationIndex].template != "blank") {
        htmlPath = StaticLibrary.SHELL_MASTER_TEMPLATE + DataManager.TOCData[currentPageLocationIndex].template;
    } else {
        htmlPath = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/pages/" + DataManager.TOCData[currentPageLocationIndex].pageContent;
    }

    try {
        var _pageData = DataManager.TOCData[currentPageLocationIndex].pageData;

        tempContainer.removeAttr('class')
        tempContainer.addClass('item ' + _pageData)
    } catch (err) {

    }

    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        ScormWrapper.setLessonLocation(currentPageLocationIndex);
        ScormWrapper.Commit();
    }

    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["navigationMode"] != "linear" || DataManager.TOCData[currentPageLocationIndex][StaticLibrary.MARK_VISIT] != "custom") {
        MainController.markCurrentPageComplete();
    } else if (DataManager.TOCData[currentPageLocationIndex][StaticLibrary.MARK_VISIT] == "init") {
        MainController.markCurrentPageComplete();
    }

    DataManager.isPageLoaded = false;

    console.log('Before... HTML Load...');

    tempContainer.load(htmlPath + ".html", function() {

        console.clear();

        console.log('After... HTML Load...');

        AudioController.createAudioElement();

        if (DeviceHandler.device == StaticLibrary.ANDROID) {
            DataManager.templateCurrentParent.show();
        }

        if ((DataManager.pageThemePath != "") && (DataManager.pageThemePath != undefined) && (DataManager.pageThemePath != "#")) {
            $("link").each(function() {
                if ($(this).attr('changetheme') === "true") {
                    $(this).attr('href', DataManager.pageThemePath);
                }
            });
        }

        if (MainController.isGroup !== "true") {
            MainController.loadPageCSSfromShell();
        }

        MainController.updatedPageNo();
        UIController.updateNavigationUIControls();
        tempContainer.off("click").on("click", ".glossaryLink", GlossaryController.onGlossaryLink);

    });
}

MainController.loadPageCSSfromShell = function() {


    console.log('loadPageCSSfromShell:')

    try {
        $("link[linkref=link_0]").remove();
        $("link[linkref=link_1]").remove();
        $("link[linkref=link_2]").remove();
        $("link[linkref=link_3]").remove();
        $("link[linkref=link_4]").remove();
        $("link[linkref=link_5]").remove();
    } catch (err) {

    }

    var tempCSSArr = [];

    try {
        if (DataManager.pageCSSCounter > 0) {
            for (var d = 0; d < DataManager.pageCSSCounter; d++) {
                $("link[linkref=link_" + d + "]").attr("href", "");
            }
        }

    } catch (err) {

    }

    DataManager.templateCurrentParent.find("link").each(function() {
        if ($(this).attr("href") != "" && $(this).attr("href") != undefined) {
            var linkTag = $(this);
            var linkPath = $(this).attr("href");
            tempCSSArr.push(linkPath);
        }
    });

    try {
        if (tempCSSArr.length > 0) {
            if (tempCSSArr.length > DataManager.pageCSSCounter) {
                for (var t = DataManager.pageCSSCounter; t < tempCSSArr.length; t++) {
                    var linkStr = "<link rel='stylesheet' href='' linkref='link_" + t + "'/>";
                    $("head").append(linkStr);
                }
                DataManager.pageCSSCounter = tempCSSArr.length;
            }
            for (var c = 0; c < tempCSSArr.length; c++) {
                $("link[linkref=link_" + c + "]").attr("href", tempCSSArr[c]);
            }
        }

    } catch (err) {

    }

}

MainController.markCurrentPageComplete = function() {

    MainController.updatedPageNo();

    if (DataManager.visitedPageArray[currentPageLocationIndex] != 1) {
        DataManager.visitedPageArray[currentPageLocationIndex] = 1;
    }

    UIController.updateCourseProgress();
    NextBackController.updateNextControl();

    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        SCORMAPIService.updateScoVariables();
    }
}

MainController.showNextInstruction = function() {
    if ((currentPageLocationIndex + 1) != DataManager.TOCData.length) {
        if ($("#clickNextInfo").css("display") == "none")
            $("#clickNextInfo").show();
    }
    if (DataManager.isTOCLocked) {
        SubNavMenuController.updateEnabled();
    }
}

MainController.showGaapInstruction = function() {
    if ($("#clickGaapInfo").css("display") == "none") {
        var label = DataManager.GaapObj[DataManager.currentGaapRefNum].instruction;
        $("#clickGaapInfo").html(label);
        $("#clickGaapInfo").show();
    }
}

MainController.getCurrentPageCompletionStatus = function() {
    if (DataManager.visitedPageArray[currentPageLocationIndex] == 1 || DataManager.visitedPageArray[currentPageLocationIndex] == "1") {
        return 1;
    } else {
        return 0;
    }
}

MainController.hideNextInstruction = function() {
    $("#clickNextInfo").fadeOut("fast");
}
MainController.hideGaapInstruction = function() {
    $("#clickGaapInfo").fadeOut("fast");
    $("#navigatorGAAPBtn").removeClass('GAAPBtnhighlight');
}

MainController.getModulewiseStartEndidx = function() {
    var pagesLen = 0,
        idx = 0;
    for (idx = 0; idx < DataManager.multiLevelTOCData.length; idx++) {
        pagesLen = (DataManager.multiLevelTOCData[idx]).length
        var tempObj = {};
        if (idx > 0) {
            tempObj.startIndex = (modulewiseStartEndidx[idx - 1].endIndex) + 1;
            tempObj.endIndex = (tempObj.startIndex) + (pagesLen) - 1;
        } else {
            tempObj.startIndex = idx;
            tempObj.endIndex = pagesLen - 1;
        }
        modulewiseStartEndidx.push(tempObj);
    }
}

MainController.updatedPageNo = function() {
    var _totalPages = DataManager.TOCData[currentPageLocationIndex].pageNo
    $(".pageCount").html(_totalPages);
}

MainController.showLoading = function() {
    $("#bodyOverlay").show();
}

MainController.hideLoading = function() {
    $("#bodyOverlay").hide();
}

MainController.updatedAssessmentPageNo = function(param) {
    $("#pageCount").html(param);
}

function quickJumpFunction() {
    var ind = parseInt($("#quickJumpTxt").val()) - 1;
    MainController.jumpToPage(ind);
}


$(document).ready(function() {

    /* 11 Nov. 2018 Fix the FOCUS content zooming issue which is happening due to launcher window removal */

    try {
        var meta = $('<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1.0"/>');
        var t = top.document.getElementsByTagName("head")[0].appendChild(meta.get(0));
    } catch (err) {
        trace(err);
    }

    $("body").on("contextmenu cut", function(e) {
        if (!_isActiveRightClick) {
            e.preventDefault();
            return false;
        }

    });

    window.addEventListener('focus', function() {
        var focused = document.hasFocus();
        if (focused) {}
    });

    // Inactive
    window.addEventListener('blur', function() {

    });

});