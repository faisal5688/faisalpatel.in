//Sample Scorm Sample Strings
//var strSuspend_Data ="1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0$NA$0$";
//Assessment left in between
//var strSuspend_Data = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1$NA$0$0.0#1.2#2.1#3.2#4.0";
//Assessment failed
//var strSuspend_Data = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1$NA$1$0.0,0.1#1.2,1.1#2.1,2.0#3.2,3.0#4.0";
//Reattempt and failed
//var strSuspend_Data = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1$NA$2$0.1#1.2,1.1,1.0#2.1,2.0,2.2#3.2,3.0,3.3#4.0";
//Reattempt and passed
var strSuspend_Data = "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1$completed$3$0.1,0.0#1.2,1.1,1.0,1.3#2.0#3.2,3.0,3.3,3.1#4.0";

var ScormWrapper = {};
var _blnForcedCommit;
var lessonStatus_on_lms;

ScormWrapper.strSuspendData;
ScormWrapper.CourseProgress;
ScormWrapper.StatusForBMString;
ScormWrapper.Attempts;
ScormWrapper.AssessmentStatus;
ScormWrapper.AssessmentData;
ScormWrapper.CompletionStatus;

ScormWrapper.initializeScorm=function() {	
	initSco();
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":						
			ScormWrapper.fnGetScorm1_2Data();
		break;
		case "scorm2004":
			ScormWrapper.fnGetscorm2004Data();
		break;
	}
}

/* Get and set for Entry */

ScormWrapper.getEntry = function()
{
	return ScormWrapper.Entry;
};

ScormWrapper.setEntry = function(strEntry)
{
	ScormWrapper.Entry=strEntry;
	//Scorm 1.2
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
			set_val("cmi.core.entry",ScormWrapper.Entry);
		break;
		case "scorm2004":
			set_val("cmi.entry",ScormWrapper.Entry);
		break;
	}
};

/* Get and set for Lesson Location */

ScormWrapper.getLessonLocation = function()
{
	return ScormWrapper.LessonLocation;
};

ScormWrapper.setLessonLocation = function(strLessonLocation)
{
	ScormWrapper.LessonLocation = String(strLessonLocation);
	trace("setting lession location "+ScormWrapper.LessonLocation);
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
			set_val("cmi.core.lesson_location",ScormWrapper.LessonLocation);
		break;
		case "scorm2004":
			set_val("cmi.location",ScormWrapper.LessonLocation);
		break;
	}	
};

/* Get and set for score */
ScormWrapper.getScore = function(){
	return ScormWrapper.Score;
};
ScormWrapper.setScore = function(iScore)
{
	ScormWrapper.Score=iScore;
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
			set_val("cmi.core.score.raw",ScormWrapper.Score);
		break;
		case "scorm2004":
			set_val("cmi.score.raw",ScormWrapper.Score);
		break;
	}
};

/* Get and set for Course Progress */
ScormWrapper.getCourseProgress = function(){
	return ScormWrapper.CourseProgress;
};
ScormWrapper.setCourseProgress = function(strProgress)
{
	ScormWrapper.CourseProgress=strProgress;
};


/* Get and set for completion Status */
ScormWrapper.getCompletionStatus = function(){
	return ScormWrapper.CompletionStatus;
};
ScormWrapper.setCompletionStatus = function(strStatus)
{
	ScormWrapper.CompletionStatus=strStatus;
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
			set_val("cmi.core.lesson_status",ScormWrapper.CompletionStatus);
		break;
		case "scorm2004":
			set_val("cmi.completion_status",ScormWrapper.CompletionStatus);
		break;
	}
};


/* Get and set for success Status */
ScormWrapper.getSuccessStatus = function()
{
	return ScormWrapper.SuccessStatus;
};
ScormWrapper.setSuccessStatus = function(strStatus)
{
	ScormWrapper.SuccessStatus=strStatus;
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
			//nothing
		break;
		case "scorm2004":
			set_val("cmi.success_status",ScormWrapper.SuccessStatus);
		break;
	}	
};


/* Get and set for Attempts */
ScormWrapper.getAttempts = function()
{
	return ScormWrapper.Attempts;
};
ScormWrapper.setAttempts = function(strAttempts)
{
	ScormWrapper.Attempts=strAttempts;
};


/* Get and set for Assessment Data */
ScormWrapper.getAssessmentData = function()
{
	return ScormWrapper.AssessmentData;
};
ScormWrapper.setAssessmentData = function(strAssessmentData)
{
	ScormWrapper.AssessmentData=strAssessmentData;
};


/* Compose Sustpend Data Text */
ScormWrapper.getSuspendData = function()
{
	return ScormWrapper.strSuspendData;
};
ScormWrapper.composeSuspendData = function()
{
	//ScormWrapper.strSuspendData=ScormWrapper.CourseProgress+"$"+ScormWrapper.Status+"$"+ScormWrapper.Attempts+"$"+ScormWrapper.AssessmentData;
	//For both SCORM 1.2 and 2004
	set_val("cmi.suspend_data",ScormWrapper.strSuspendData);
};


/* Set Interactions data */
ScormWrapper.setInteractionData = function( strInteractionId,strInteractionType,strCurrTime,strLatency,strWeightage,strPattern,strStudentResponse,strInteractionResult,iCurrQuestionNum,iTotalQuestions){
	set_interaction_data(strInteractionId,strInteractionType,strCurrTime,strLatency,strWeightage,strPattern,strStudentResponse,strInteractionResult,iCurrQuestionNum,iTotalQuestions);
};

/*commiting and finising on scorm */
ScormWrapper.Commit = function()
{
	commit();
};
ScormWrapper.Finish = function(){
	finish();
};



ScormWrapper.updateSCOVariables=function()
{
	var iTotalVisited = 0;
	ScormWrapper.LessonLocation = currentPageLocationIndex;
	//mark the course status is completed on 2nd last page.				
	/*if (DataManager.visitedPageArray[DataManager.visitedPageArray.length - 3]==1 && DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["available"].toLowerCase() == "false"){
		DataManager.visitedPageArray[currentPageLocationIndex+1] = 1;
		DataManager.visitedPageArray[currentPageLocationIndex+2] = 1;
	}	*/
	ScormWrapper.strSuspendData = String(DataManager.visitedPageArray);			
	
	for (var i = 0; i < DataManager.visitedPageArray.length; i++){
		if (DataManager.visitedPageArray[i] == 1){
			iTotalVisited++;
		}
	}	
	
	if (iTotalVisited >= (DataManager.visitedPageArray.length-1))
	{	
		if (DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["available"].toLowerCase() == "true")
		{					
			//Assessment is available;					
			if (ScormWrapper.AssessmentStatus == "completed")
			{
				ScormWrapper.CompletionStatus = "completed";
				ScormWrapper.SuccessStatus = "passed";	
				//Assessment passed						
				/* if (lessonStatus_on_lms != "completed"){
					//Value on LMS is different
					ScormWrapper.CompletionStatus = "completed";
					ScormWrapper.SuccessStatus = "passed";	
				}
				else{
					//Nothing to do
					//SCO already in completed state
				} */				
				//ScormWrapper.LessonLocation = 0;
			}
			else
			{
				ScormWrapper.SuccessStatus = "failed";				
				//Assessment failed				
				if ((ScormWrapper.Attempts) == Number(DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["maxAttempts"]))
				{					
					//Attempts over
					//Leaving the course in incomplete state
					ScormWrapper.CompletionStatus = "incomplete";					
					ScormWrapper.LessonLocation = 0;					
				}
				else{
					//Attempts remaining | Status = incomplete
					ScormWrapper.CompletionStatus = "incomplete";
				}
			}
		}
		else
		{					
			//Assessment not available;
			if (lessonStatus_on_lms != "completed")
			{
				//Value on LMS is different
				ScormWrapper.CompletionStatus = "completed";
				ScormWrapper.SuccessStatus = "passed";				
			}
			else{
				//Nothing to do
				//SCO already in completed state
			}
		}
	}
	else{
		//Not all pages completed
		ScormWrapper.CompletionStatus = "incomplete";
	}	
	ScormWrapper.fnScormSetData();
}

ScormWrapper.fnScormSetData=function(){
	switch(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.fnSetScormData();
		break;
	}	
}

ScormWrapper.scorm_GetStatus = function(isFromScorm1_2) {
    //return Status;
    var retVal = isFromScorm1_2 ? String(get_val("cmi.core.entry")).toLowerCase() : String(get_val("cmi.entry")).toLowerCase();
    /*the "" takes care of if the course is initially launched as standalone from shell outside of the lms By adding the Bookmark_location <2 It ensures that if the course is launched from the shell, exited prior to screen 2 and relaunched the course will consider that a non start and reinitialize the variables by having the "else" condition return resume --- this is our safety mechanism ensuring that if something else occurs at least the bookmark data will NOT be reinitialized and progress lost.*/
    if ((retVal == "" || retVal == "ab-initio") && ScormWrapper.strSuspendData.length < 2) {
        retVal = "ab-initio";
    } else {
        retVal = "resume";
    }
    return retVal
}

ScormWrapper.fnGetScorm1_2Data=function()
{	
	ScormWrapper.CompletionStatus = get_val("cmi.core.lesson_status");
	lessonStatus_on_lms = ScormWrapper.CompletionStatus;
	
	if (String(ScormWrapper.CompletionStatus).toLowerCase() != "completed" && String(ScormWrapper.CompletionStatus).toLowerCase() != "passed")
	{
		if (ScormWrapper.CompletionStatus != "incomplete"){
			ScormWrapper.setCompletionStatus("incomplete");
			lessonStatus_on_lms = ScormWrapper.CompletionStatus;			
		}
	}	
	ScormWrapper.Entry = String(get_val("cmi.core.entry")).toLowerCase();	
	ScormWrapper.strSuspendData = get_val("cmi.suspend_data");	
	trace("strSuspendData::"+ScormWrapper.strSuspendData);
	trace("lessonStatus_on_lms "+lessonStatus_on_lms);
	if(ScormWrapper.strSuspendData == undefined || ScormWrapper.strSuspendData=="undefined")
		ScormWrapper.strSuspendData = "";
	//if (lessonStatus_on_lms == "null" || lessonStatus_on_lms == "not attempted" || ScormWrapper.strSuspendData.length < 2){
	if (ScormWrapper.scorm_GetStatus(true) == "ab-initio" || (lessonStatus_on_lms == "null" || lessonStatus_on_lms == "not attempted" || ScormWrapper.strSuspendData.length < 2)){
		//Learner has launched the SCO for the first time	
		trace("launched course first time");
		ScormWrapper.strSuspendData = "";
		ScormWrapper.Attempts = 0;
		ScormWrapper.AssessmentStatus = "incomplete";		
	}
	else{
		//Returning learner - not first time		
		if(ScormWrapper.strSuspendData != "" && ScormWrapper.strSuspendData.length > 2){
			var arrSuspendData = ScormWrapper.strSuspendData.split("$");
			ScormWrapper.CourseProgress = arrSuspendData[0].split(",");	
			if(arrSuspendData[1]!=undefined){
				ScormWrapper.AssessmentStatus = arrSuspendData[1];
			}	
			if(arrSuspendData[2]!=undefined){
				ScormWrapper.Attempts = parseInt(arrSuspendData[2]);						
			}			
			if(arrSuspendData[3]!=undefined && arrSuspendData[3].length > 0){
				DataManager.favoriteArray = arrSuspendData[3].split(",");
				for(var f=0; f<DataManager.favoriteArray.length ;f++){
					DataManager.favoriteArray[f] = parseInt(DataManager.favoriteArray[f]);
				}
			}
			//ss
			if(arrSuspendData[4]!=undefined && arrSuspendData[4].length > 0){
				DataManager.alreadyPlayedVideoTimeArray = arrSuspendData[4].split(",");
				for(var f=0; f<DataManager.alreadyPlayedVideoTimeArray.length ;f++){
					DataManager.alreadyPlayedVideoTimeArray[f] = parseInt(DataManager.alreadyPlayedVideoTimeArray[f]);
				}
			}
			//ss
		}
		ScormWrapper.LessonLocation= parseInt(get_val("cmi.core.lesson_location"));
		trace("ScormWrapper.LessonLocation "+ScormWrapper.LessonLocation);
		currentPageLocationIndex = ScormWrapper.LessonLocation;
		DataManager.visitedPageArray = ScormWrapper.CourseProgress.concat();
		UIController.updateCourseProgress();
	}
	if (DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["available"].toLowerCase() == "true"){
		//Assessment present in Course
		var arrSuspendData = ScormWrapper.strSuspendData.split("$");
		if (ScormWrapper.strSuspendData[3] != "undefined" && ScormWrapper.strSuspendData!=undefined){
			ScormWrapper.AssessmentData = arrSuspendData[3];
			trace("got ASsesment data from LMS "+ScormWrapper.AssessmentData);
		}
	}
	else
	{
		//Assessment not present in SCO
		ScormWrapper.Attempts = 0;
		ScormWrapper.AssessmentStatus = "";
	}
	//User details
	ScormWrapper.Score = get_val("cmi.core.score.raw");			
	ScormWrapper.SuccessStatus = "";//Not available
	ScormWrapper.UserName = String(get_val("cmi.core.student_name"));
	ScormWrapper.UserID = String(get_val("cmi.core.student_id"));	
	ScormWrapper.PassingScore = DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["passingPercent"];	
	trace(ScormWrapper.strSuspendData);
}

ScormWrapper.fnGetscorm2004Data=function()
{	
	ScormWrapper.CompletionStatus = get_val("cmi.completion_status");
	lessonStatus_on_lms = ScormWrapper.CompletionStatus;
	
	if (String(ScormWrapper.CompletionStatus).toLowerCase() != "completed" && String(ScormWrapper.CompletionStatus).toLowerCase() != "passed")
	{
		if (ScormWrapper.CompletionStatus != "incomplete"){
			ScormWrapper.setCompletionStatus("incomplete");
			lessonStatus_on_lms = ScormWrapper.CompletionStatus;			
		}
	}	
	ScormWrapper.Entry = String(get_val("cmi.entry")).toLowerCase();	
	ScormWrapper.strSuspendData = get_val("cmi.suspend_data");
	trace("strSuspendData::"+ScormWrapper.strSuspendData);
	trace("lessonStatus_on_lms "+lessonStatus_on_lms);
	if(ScormWrapper.strSuspendData == undefined || ScormWrapper.strSuspendData=="undefined")
		ScormWrapper.strSuspendData = "";
		
	//if (lessonStatus_on_lms == "null" || lessonStatus_on_lms == "not attempted" || ScormWrapper.strSuspendData.length < 2){
	if (ScormWrapper.scorm_GetStatus(false) == "ab-initio" || (lessonStatus_on_lms == "null" || lessonStatus_on_lms == "not attempted" || ScormWrapper.strSuspendData.length < 2)){
		//Learner has launched the SCO for the first time	
		trace("launched course first time");
		ScormWrapper.strSuspendData = "";
		ScormWrapper.Attempts = 0;
		ScormWrapper.AssessmentStatus = "incomplete";		
	}
	else{
		//Returning learner - not first time		
		if(ScormWrapper.strSuspendData != "" && ScormWrapper.strSuspendData.length > 2){
			var arrSuspendData = ScormWrapper.strSuspendData.split("$");
			ScormWrapper.CourseProgress = arrSuspendData[0].split(",");	
			if(arrSuspendData[1]!=undefined){
				ScormWrapper.AssessmentStatus = arrSuspendData[1];
			}	
			if(arrSuspendData[2]!=undefined){
				ScormWrapper.Attempts = parseInt(arrSuspendData[2]);
			}
			
			if(arrSuspendData[3]!=undefined && arrSuspendData[3].length > 0){
				DataManager.favoriteArray = arrSuspendData[3].split(",");
				for(var f=0; f<DataManager.favoriteArray.length ;f++){
					DataManager.favoriteArray[f] = parseInt(DataManager.favoriteArray[f]);
				}
			}
		}
		ScormWrapper.LessonLocation= parseInt(get_val("cmi.location"));
		trace("ScormWrapper.LessonLocation "+ScormWrapper.LessonLocation);
		currentPageLocationIndex = ScormWrapper.LessonLocation;
		DataManager.visitedPageArray = ScormWrapper.CourseProgress.concat();
		UIController.updateCourseProgress();
	}
	if (DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["available"].toLowerCase() == "true"){
		//Assessment present in Course
		var arrSuspendData = ScormWrapper.strSuspendData.split("$");
		if (ScormWrapper.strSuspendData[3] != "undefined" && ScormWrapper.strSuspendData!=undefined){
			ScormWrapper.AssessmentData = arrSuspendData[3];
			trace("got ASsesment data from LMS "+ScormWrapper.AssessmentData);
		}
	}
	else{
		//Assessment not present in SCO
		ScormWrapper.Attempts = 0;
		ScormWrapper.AssessmentStatus = "";
	}
	//User details
	ScormWrapper.Score = get_val("cmi.score.raw");			
	ScormWrapper.SuccessStatus = get_val("cmi.success_status");
	//ScormWrapper.UserName = String(get_val("cmi.core.student_name"));
	//ScormWrapper.UserID = String(get_val("cmi.core.student_id"));	
	ScormWrapper.PassingScore = DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["passingPercent"];	
	trace(ScormWrapper.strSuspendData);
}

ScormWrapper.fnSetScormData=function()
{
	if (DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["available"].toLowerCase() == "true")
	{
		var assessmentStatus = ScormWrapper.AssessmentStatus;
		if (assessmentStatus == "" || assessmentStatus == null || assessmentStatus == undefined || assessmentStatus == "null" || assessmentStatus == "undefined"){
			ScormWrapper.AssessmentStatus = assessmentStatus = "NA";
		}		
		if (ScormWrapper.AssessmentData == "undefined" || ScormWrapper.AssessmentData == undefined){
			ScormWrapper.AssessmentData = "";
		}		
		ScormWrapper.strSuspendData = ScormWrapper.strSuspendData + "$" + ScormWrapper.AssessmentStatus + "$" + ScormWrapper.Attempts + "$" + ScormWrapper.AssessmentData +"$" + String(DataManager.alreadyPlayedVideoTimeArray);
	}
	else{
		//Assessment not present in SCO
		ScormWrapper.strSuspendData =  ScormWrapper.strSuspendData + "$" + ScormWrapper.AssessmentStatus + "$" + ScormWrapper.Attempts + "$" + String(DataManager.favoriteArray)+"$" + String(DataManager.alreadyPlayedVideoTimeArray);
	}
	//trace("lessonStatus_on_lms = "+lessonStatus_on_lms +" -- "+ScormWrapper.CompletionStatus);
	if (lessonStatus_on_lms != ScormWrapper.CompletionStatus){
		//Status on LMS is different		
		ScormWrapper.setCompletionStatus(ScormWrapper.CompletionStatus)		
	}
	
	//Send data to API Object and commit data on LMS
	//if (lessonStatus_on_lms != "completed"){
		ScormWrapper.composeSuspendData(ScormWrapper.strSuspendData);
	//}
	ScormWrapper.setLessonLocation(ScormWrapper.LessonLocation);	
	ScormWrapper.Commit();		
	//Make the status on LMS same as in course
	lessonStatus_on_lms = ScormWrapper.CompletionStatus;
}

ScormWrapper.fnSetscorm2004Data=function(){
	
}