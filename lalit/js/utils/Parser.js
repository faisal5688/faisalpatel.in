var Parser = function(){
	
}
var parserRef;

Parser.checkDataTypeFn = function(currentDataType){	
	if(currentDataType == "xml"){
		parserRef = "XMLParser";
	}else{
		parserRef = "JSONParser";
	}
}


/* *** SHELL DATA PARSING ******** */

Parser.loadCourseDataFn = function(data){
	return eval(parserRef).parseCourseData(data);
}

Parser.loadConfigDataFn = function(data){
	return eval(parserRef).parseConfigData(data);
}

Parser.loadCourseDataSingleLevelFn = function(data){
	return eval(parserRef).parseCourseDataSingleLevel(data);
}

Parser.loadGlossaryDataFn = function(data){
	return eval(parserRef).parseGlossaryData(data);
}

Parser.loadTranscriptDataFn = function(data){
	return eval(parserRef).getTranscriptContent(data);
}

Parser.loadGlobalContentDataFn = function(data){
	return eval(parserRef).parseGlobalContentData(data);
}

/* *** SHELL DATA PARSING ENDS ******** */



/* ***** TEMPLATE DATA PARSING ********* */

Parser.loadMCSSDataFn = function(data){
	return eval(parserRef).parseMCSSData(data);
}
Parser.loadNestedMCSSDataFn = function(data){
	return eval(parserRef).parseNestedMCSSData(data);
}

Parser.loadTextImageDataFn = function(data){
	return eval(parserRef).parseTextImageData(data);
}

Parser.loadTextVideoDataFn = function(data){
	return eval(parserRef).parseTextVideoData(data);
}

Parser.loadDnDClassificationDataFn = function(data){
	return eval(parserRef).parseDNDClassificationData(data);
}

Parser.loadTabDataFn = function(data){
	return eval(parserRef).parseTabData(data);
}

Parser.loadClickNLearnDataFn = function(data){
	return eval(parserRef).parseClickNLearnData(data);
}
Parser.loadClickNLearn_interactivityDataFn = function(data){
	return eval(parserRef).parseClickNLearn_interactivityData(data);
}

Parser.loadActivityDataFn = function(data){
	return eval(parserRef).parseActivityData(data);
}

Parser.loadNavHighlightDataFn = function(data){
	return eval(parserRef).parseNavHighlightData(data);
}

Parser.loadTextImageTwoColumnDataFn = function(data){
	return eval(parserRef).parseTextImageTwoColumnData(data);
}
Parser.loadAnyImageAnyColumnFn = function(data){
	return eval(parserRef).parseloadAnyImageAnyColumnData(data);
}
Parser.loadTextImageTwoColumnWithContinueDataFn = function(data){
	return eval(parserRef).parseTextImageTwoColumnWithContinueData(data);
}

Parser.loadImpairmentTestingDataFn = function(data){
	return eval(parserRef).parseImpairmentTestingData(data);
}

Parser.loadAccordionDataFn = function(data){
	return eval(parserRef).parseAccordionData(data);
}

Parser.loadClickRevealDataFn = function(data){
	return eval(parserRef).parseClickRevealData(data);
}




/* ******** TEMPLATE PARSING ENDS ********** */



/* **** ASSESSMENT DATA PARSING ************ 
Parser.loadAssessmentDataFn = function(data){
	return eval(parserRef).parseAssessmentData(data);
}

Parser.loadAssessmentStartEndDataFn = function(data){
	return eval(parserRef).parseAssessmentStartEnd(data);
}
/* *****assessment Start END page data ****** */
/* **** ASSESSMENT DATA PARSING ************ */
Parser.loadAssessmentDataFn = function(data){
	return JSONParser.parseAssessmentData(data);
};

Parser.loadAssessmentStartEndDataFn = function(data){
	return eval(parserRef).parseAssessmentStartEnd(data);
};

/* *****assessment Start END page data ****** */

/* *****shortcut parser data ****** */
Parser.loadShortcutDataFn = function(data){
	return eval(parserRef).parseShortcutData(data);
};
/* *****shortcut parser data ends****** */

/* ***** PARSING ENDS ******** */