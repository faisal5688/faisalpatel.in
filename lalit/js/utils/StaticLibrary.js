var StaticLibrary = function() {}
    //Device 
StaticLibrary.ANDROID = "Android";
StaticLibrary.IPAD = "iPad";
StaticLibrary.DESKTOP = "desktop";

StaticLibrary.LOAD_APPLICATION_SETTING = "loadApplicationSettingEvent";
StaticLibrary.LOAD_CONFIG_DATA = "loadConfigDataEvent";
StaticLibrary.LOAD_SHORTCUT_DATA = "loadShortcutDataEvent"; //shortcut variable
StaticLibrary.LOAD_GLOBAL_CONTENT = "loadGlobalContentEvent";
StaticLibrary.LOAD_TOC_COURSE_DATA = "loadTOCCourseDataEvent";
StaticLibrary.LOAD_GLOSSARY_DATA = "loadGlossaryDataEvent";
StaticLibrary.LOAD_ASSESSMENT_STARTEND_DATA = "loadAssessmentStartEndDataEvent";
StaticLibrary.LOAD_TEMPLATE_LEVEL_DATA = "loadTemplateLevelDataEvent";
StaticLibrary.LOAD_GAAP_DATA = "loadGAAPDataEvent";
StaticLibrary.LOAD_RESOURCE_DATA = "loadResourceDataEvent";
StaticLibrary.LOAD_DETAILS_DATA = "loadDetailsDataEvent";
StaticLibrary.ASSET_LOADED = "assetLoaded";
StaticLibrary.ON_PAGE_UNLOADED = "onPageUnloaded";

StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT = "controlAudioVideoEvent";

//Event for GAAP notification System
StaticLibrary.GAAP_HIGHLIGHT_EVENT = "gaapHighlightEvent";
StaticLibrary.GAAP_NOTIFICATION_EVENT = "gaapNotificationEvent";
StaticLibrary.GAAP_CLOSE_EVENT = "gaapclosed";
//Event for image src change system
StaticLibrary.ORIENTATION_CHANGE = "orientationChanged";


//Storing orientaion
StaticLibrary.LANDSCAPE = "landscape";
StaticLibrary.PORTRAIT = "portrait";


/*
 * TOC ITEMS
 */
StaticLibrary.MODULETITLE = "moduleTitle";
StaticLibrary.TOPICTITLE = "topicName";
StaticLibrary.TITLE = "title";
StaticLibrary.TEMPLATE = "template";
StaticLibrary.PAGE_DATA = "pageData";
StaticLibrary.PAGE_TO_LOAD = "pageContent";
StaticLibrary.IS_ASSESSMENT = "assessment";
StaticLibrary.HAS_AUDIO = "audio";
StaticLibrary.MARK_VISIT = "markvisit";
StaticLibrary.SHOW_TITLE = "showTitle";
StaticLibrary.ENABLE_MENU = "enableMenu";
StaticLibrary.NEXT_PAGE_ID = "nextPageId";
StaticLibrary.BACK_PAGE_ID = "backPageId";
StaticLibrary.ENABLE_BACK = "enableBack";
StaticLibrary.GAAP_ID = "gaapId";
StaticLibrary.TRANSCRIPT = "pageTranscript";
StaticLibrary.PAGE_THEME = "PageTheme";
StaticLibrary.IS_OBJECTIVE = "isObjective";

/*
 * 
 */
StaticLibrary.CONFIG_COURSE = "course";
StaticLibrary.CONFIG_FEATURE = "features";
StaticLibrary.CONFIG_ASSESSMENT = "assessment";
StaticLibrary.CONFIG_SHORTCUTFILEPATH = "shortcutFilePath";
/** Section to defined all static path for the course modules */

StaticLibrary.SHELL_MASTER_TEMPLATE = "templates/pages/";

StaticLibrary.COURSE_TEMPLATE_PATH = "";
StaticLibrary.COURSE_CSS_PATH = "courseCSSPath";
StaticLibrary.COURSE_JS_PATH = "courseJSPath";


/*function used for debugging in any browser*/
function trace(str) {
    try {
        $("#traceViewContent").append('<p>' + str + '<p>');
        if (window.console && window.console.log) {
            //   console.log(str)
        } else {
            window.status = str;
        }
    } catch (err) {
        console.error(err)
    }

}