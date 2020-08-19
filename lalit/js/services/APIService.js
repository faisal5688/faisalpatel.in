
/** API Call to Service to load any Type of JSON data.
 *  
 */
var APIService = function(){}

	var serviceObj = new ServiceLocator();
	var eventMgr = new EventManager();
	
	APIService.loadCourseConfigFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, courseConfigSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	/* *****shortcut call ****** */
	APIService.loadShortcutFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, courseShortcutSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	/* *****shortcut call ends****** */
	
	APIService.loadCourseSettingFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, courseSettingSuccessHandler, genericErrorHandler, isSync, dataType);
	}

	APIService.loadTOCCourseDataFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, courseTOCSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadGlossaryDataFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, glossarySuccessHandlerFn, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadExternalGlobalContentDataFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, globalContentSuccessHandlerFn, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadTemplateLevelDataFn = function(url, isSync, dataType){
		serviceObj.callToServer(url, loadTemplateLevelDataSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadAssessmentStartEndPageDataFn = function(url, isSync){
		serviceObj.callToServer(url, assessmentStartEndSuccessHandler, genericErrorHandler, isSync, "json");
	}
	
	APIService.loadGaapContentDataFn	=	function(url, isSync, dataType){		
		serviceObj.callToServer(url, loadGaapDataSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadResourceContentDataFn	=	function(url, isSync, dataType){		
		serviceObj.callToServer(url, loadResourceDataSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	
	APIService.loadDetailsContentDataFn	=	function(url, isSync, dataType){		
		serviceObj.callToServer(url, loadDetailsDataSuccessHandler, genericErrorHandler, isSync, dataType);
	}
	
	/** Method to handle the success for Config Setting */
	function courseConfigSuccessHandler(data){
		trace("R1");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_CONFIG_DATA, false, data);		
	}
	/* *****shortcut call ****** */
	function courseShortcutSuccessHandler(data){
		trace("R11");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_SHORTCUT_DATA, false, data);		
	}
	/* *****shortcut call end****** */
	/** Method to handle the success for Course Setting */
	function courseSettingSuccessHandler(data){
		trace("R2");		
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_APPLICATION_SETTING, false, data);				
	}
	
	/** Method to handle the success for TOC Data */
	function courseTOCSuccessHandler(data){
		trace("R3");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_TOC_COURSE_DATA, false, data);
	}
	
	/** Method to handle the success for Glossary Data */
	function glossarySuccessHandlerFn(data){
		trace("R4");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_GLOSSARY_DATA, false, data);
	}
	
	/** Method to handle the success for Glossary Data */
	function globalContentSuccessHandlerFn(data){
		trace("R5");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_GLOBAL_CONTENT, false, data);
	}
	
	/** Method to handle the success for Template XML Data */
	function loadTemplateLevelDataSuccessHandler(data){
		trace("R6");
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_TEMPLATE_LEVEL_DATA, false, data);
	}
	/** Method to handle the success for GAAP Data */
	function loadGaapDataSuccessHandler(data){
		trace("R7");	
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_GAAP_DATA, false, data);
	}
	
	/** Method to handle the success for Resource Data */
	function loadResourceDataSuccessHandler(data){
		trace("R8");	
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_RESOURCE_DATA, false, data);
	}
	
	/** Method to handle the success for Resource Data */
	function loadDetailsDataSuccessHandler(data){
		trace("R8");	
		eventMgr.dispatchCustomEvent(document, StaticLibrary.LOAD_DETAILS_DATA, false, data);
	}
	
	/** Method to handle the success for Assessment Start End Data */
	function assessmentStartEndSuccessHandler(data){
		trace("R9");
		$(document).trigger(
			{
				type:StaticLibrary.LOAD_ASSESSMENT_STARTEND_DATA,
				value:data
			});		
	}
	
	function genericErrorHandler(error){
		trace(":: API Service ERROR ::");
		trace(JSON.stringify(error));
		//console.error(error.responseText);
		trace("------------------------------------");
	}