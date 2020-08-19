
/** API Call to Service to load any Type of JSON data.
 *  
 */
var SCORMAPIService = {};

	
/*SCORM SERVICES START*/
SCORMAPIService.initializeService=function(){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.initializeScorm();
		break;
	}
}

SCORMAPIService.updateScoVariables=function(){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.updateSCOVariables();
		break;
	}			
}

SCORMAPIService.getAssessmentStatus=function(){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	var status = "";
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			status = ScormWrapper.AssessmentStatus;
		break;
		case "local":
			status = "";
		break;
	}
	return status;
}

SCORMAPIService.getAssessmentData=function(){
	var data = "";
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];	
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			//alert("compliance "+compliance);
			data = ScormWrapper.getAssessmentData();			
		break;
	}
	//alert(data);
	return data; 	
}

SCORMAPIService.setAssessmentData=function(data){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.setAssessmentData(data);
			ScormWrapper.updateSCOVariables();
		break;
	}
}

SCORMAPIService.setAssessmentStatus=function(status){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];	
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.AssessmentStatus = status;
		break;
	}
}

SCORMAPIService.setAttempts=function(num){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];	
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.Attempts = num;
		break;
	}
	
}
SCORMAPIService.getAttempts=function(num){
	var attempts;
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];	
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			attempts = ScormWrapper.Attempts;
		break;
	}
	return attempts;
}

SCORMAPIService.setInteractionData=function(questionID,cmiType,timeStr,latency,weightage,strPattern,userResponse,userResult,questionCounter,totalQuestions){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.setInteractionData(questionID,cmiType,timeStr,latency,weightage,strPattern,userResponse,userResult,questionCounter,totalQuestions)
		break;
	}
}

SCORMAPIService.setScore=function(val){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			ScormWrapper.setScore(val);
		break;
	}
}

SCORMAPIService.getScore=function(){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	var score;
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			score = ScormWrapper.getScore();
		break;
	}	
	return score;
}

SCORMAPIService.getSuspendDataStr = function(){
	var compliance = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"];
	var str;
	switch(compliance){
		case "scorm1_2":
		case "scorm2004":
			if(ScormWrapper.strSuspendData == undefined || ScormWrapper.strSuspendData=="undefined")
				str = "";
			else
				str = ScormWrapper.strSuspendData;
		break;
	}	
	return str;
}
/*SCORM SERVICES ENDS*/
