// Data Manager to store all global level variables.

//Application Level Global Setting Variables.
var DataManager = {};

DataManager.totalModules = 0;
DataManager.courseStruct = [];

DataManager.courseFolder;
DataManager.scormCompliance;
DataManager.retinaImageUrl; //retina images path
DataManager.settingDataObj = {}; // Object to hold all settingCourse.json entities of the application

DataManager.configData = [];
DataManager.shortcutData = []; //shortcut variable
DataManager.TOCData = [];
DataManager.glossaryCollection = [];
DataManager.globalContentData = [];
DataManager.favoriteArray = [];
DataManager.transcriptView_initX;
DataManager.transcriptView_initY;
DataManager.feedbackView_initX;
DataManager.feedbackView_initY;

DataManager.audioArray = [];
//DataManager.currentPage=1;
DataManager.visitedPageArray = new Array();

DataManager.templateXMLData;
DataManager.templateCurrentParent = "";

DataManager.assessmentData = [];
DataManager.assementStartEndData = [];

DataManager.pageThemePath = "";

//Audio element
/* DataManager.audioElement = document.createElement('audio');
DataManager.audioElement.id="pageAudio"; */
//DataManager.audioElement	=	$("#audioPlayerObj");

DataManager.audioElement;
DataManager.audioFileName;
DataManager.isAudioLoaded;
DataManager.isPageLoaded;

DataManager.AudioPlayStaus = false;
DataManager.AudioElementvalume = false;

DataManager.nAgt = navigator.userAgent;

/*setting variable for lockrd ad unlocked*/
DataManager.isTOCLocked = false;

DataManager.menuOpenState = false;

DataManager.isSliderLocked = false;

/*variable for checking whether transcript popup is open or not*/
DataManager.isTrancriptOpen = false;
/*
seting drag constraint box
*/
//DataManager.dragConstraintBox	=	"#PageContent";
DataManager.dragConstraintBox = ".iosSlider";

DataManager.currentModule = 0;
DataManager.multiLevelTOCData = "";
/*setting variable for device check*/
/* var isDevice	=	false;
var isIpad 		=	navigator.userAgent.match(/iPad/i) != null;
var isIphone	=	(navigator.userAgent.match(/iPhone/i) != null) || (navigator.userAgent.match(/iPod/i) != null); */

/*Help data*/
DataManager.helpDataObj = {
    "help_main_heading": "Help",
    "help_tab": [{
        "id": "1",
        "tab_heading": "sub heading1",
        "image": "Help-bg",
        "tab_content": ""
    }]
};

/*for storing current Gaap Ref link number*/
DataManager.currentGaapRefNum = 0;
DataManager.gaapObj;

/*for storing resource data*/
DataManager.ResourceObj;

/*for storing details data*/
DataManager.DetailsObj;

/*drag and drop one to one*/

DataManager.dragElementsLength;
DataManager.numberOfSubmitEvent = 0;

/*screen with Height*/
DataManager.orig_width;
DataManager.orig_height;

/*check feed back open staue*/
DataManager.isFeedBackOpen = false;
DataManager.shellInitialized = false;
DataManager.isNavHighlightShown = false;
DataManager.isInternalAudioPlaying = false;
DataManager.pageCSSCounter = 0;
DataManager.audioPausedByLearner = false;
/*For storing the orientation*/
DataManager.currentOrientaion = "";


/*for gaap Notification check*/
DataManager.gaapHighlight = false;

DataManager.objectivePageArr = [];
DataManager.alreadyPlayedVideoTime = 0;
DataManager.alreadyPlayedVideoTimeArray = new Array();
DataManager.enablePreCaching = true;