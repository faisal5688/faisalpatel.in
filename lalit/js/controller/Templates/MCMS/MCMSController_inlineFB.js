var customMCMSinlineFB={};
customMCMSinlineFB.questionData={};
customMCMSinlineFB.optionArr = [];
customMCMSinlineFB.mainContainer;
customMCMSinlineFB.maxOptions= 6;
customMCMSinlineFB.prevOption;
customMCMSinlineFB.userAnswer;
customMCMSinlineFB.correctAnswer;
customMCMSinlineFB.currentAttempt;
customMCMSinlineFB.activityInitialized;
customMCMSinlineFB.activityCompleted=false;

customMCMSinlineFB.initMCMS=function(data){	
	customMCMSinlineFB.mainContainer = $("#mcmsContainer").find("#mcmsHolder");	
	customMCMSinlineFB.questionData = data;
	customMCMSinlineFB.currentAttempt = 0;
	customMCMSinlineFB.activityInitialized = false;
	
	
	//initialize submit button
	SubmitButton.init($("#mcmsHolder").find("#mcmsSubmitBtn"));
	eventMgr.addControlEventListener(SubmitButton, "submitClicked", customMCMSinlineFB.submitClicked);
	
	customMCMSinlineFB.createOptions();	
	customMCMSinlineFB.disableOptions();
	customMCMSinlineFB.showQuestion();
	
	customMCMSinlineFB.mainContainer.find("#mcmsNextBtn").hide();	
	setTimeout(function(){		
		MainController.initializeTemplateInShell();	
	},60);
	//if(MainController.getCurrentPageCompletionStatus() == 1){
		customMCMSinlineFB.addListeners();
	//}
}

customMCMSinlineFB.createOptions=function(){

	//create clone options for assessment
	for(var o=0;o<customMCMSinlineFB.maxOptions;o++){
		var option = $(customMCMSinlineFB.mainContainer.find("#mcmsOptionContainer").find(".cloneOption")).clone();
		option.removeClass("cloneOption");		
		var opt = new Option(option,"mcms",o);		
		customMCMSinlineFB.optionArr.push(opt);
		eventMgr.addControlEventListener(opt.holder, "optionClicked", customMCMSinlineFB.mcmsOptionClicked);
		customMCMSinlineFB.mainContainer.find("#mcmsOptionContainer").append(opt.holder)
		option.appendTo(customMCMSinlineFB.mainContainer.find("#mcmsOptionContainer"));		
	}	

};

customMCMSinlineFB.addListeners=function(){
	//addlisteners to buttons		
	if(!customMCMSinlineFB.activityInitialized){
		customMCMSinlineFB.activityInitialized = true;
		for(var o=1;o<=customMCMSinlineFB.maxOptions;o++){
			var option = customMCMSinlineFB.optionArr[o-1];	
			option.addListeners();		
		}
	}
};

customMCMSinlineFB.showQuestion=function(){
	customMCMSinlineFB.initializeMCMS();		
};

/*MCMS functionality*/
customMCMSinlineFB.initializeMCMS=function(){	
	customMCMSinlineFB.userAnswer=[];
	customMCMSinlineFB.correctAnswer=[];
	customMCMSinlineFB.activityCompleted = false;
	$("#mcmsContainer").find("#mcmsQuestionTxt").html(customMCMSinlineFB.questionData.question);
	$("#mcmsContainer").find("#mcmsScenarioTxt").html(customMCMSinlineFB.questionData.scenarioText);
	$("#mcmsContainer").find("#mcmsInstructionTxt").html(customMCMSinlineFB.questionData.instructionText);	
	customMCMSinlineFB.correctAnswer = customMCMSinlineFB.questionData.correctAnswer.split(",");			
	$("#mcmsContainer").find(".mcssOption").addClass("hiddenOption");
	for(c=0; c<customMCMSinlineFB.questionData.options.length; c++){		
		var option = customMCMSinlineFB.optionArr[c];		
		option.showOption("<span>"+customMCMSinlineFB.questionData.options[c]+"</span>");			
	}
}

customMCMSinlineFB.resetMCMS=function(){
	customMCMSinlineFB.userAnswer=[];	
	for(c=0; c<customMCMSinlineFB.questionData.options.length; c++){		
		var option = customMCMSinlineFB.optionArr[c];
		option.reset();		
	}
}

customMCMSinlineFB.mcmsOptionClicked=function(evt){
	var clicked = $(evt.target).parent().parent();
	var str = clicked.attr("id");	

	if(clicked.find("#optionBox").hasClass("MCMSbulletPointsSelected")){		
		customMCMSinlineFB.userAnswer.push(str.split("_")[1]);		
	}else{
		customMCMSinlineFB.userAnswer.splice(jQuery.inArray(str.split("_")[1],customMCMSinlineFB.userAnswer),1);	}

	if(customMCMSinlineFB.userAnswer.length > 0)
		SubmitButton.chkSubmitEnable(true);
	else
		SubmitButton.chkSubmitEnable(false);
}

customMCMSinlineFB.submitClicked=function(evt){	

	if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
		AudioController.playInternalAudio("blank");
	}
	customMCMSinlineFB.disableOptions();	
	customMCMSinlineFB.chkUserAnswer();
	customMCMSinlineFB.resetFeedback();	
};

customMCMSinlineFB.disableOptions=function(){	
	for(var c=1;c<=customMCMSinlineFB.maxOptions;c++){		
		var option = customMCMSinlineFB.optionArr[c-1];
		option.disable();
	}
}

customMCMSinlineFB.chkUserAnswer=function(){
	var tempArr = [];
	tempArr = customMCMSinlineFB.correctAnswer.concat();	
	for(var c=0; c<customMCMSinlineFB.userAnswer.length; c++){
		//var ind = tempArr.indexOf(customMCMSinlineFB.userAnswer[c]);		 
		var ind = jQuery.inArray(customMCMSinlineFB.userAnswer[c],tempArr);
		if(ind >=0)
			tempArr.splice(ind,1);
	}	
	var result="Incorrect";
	if(tempArr.length <= 0 && customMCMSinlineFB.userAnswer.length == customMCMSinlineFB.correctAnswer.length){
		result = 'Correct';	
	}
	customMCMSinlineFB.showFeedback(result);	
};


customMCMSinlineFB.showFeedback=function(result){

	customMCMSinlineFB.currentAttempt++;	
	var feedBackStr="";
	if(customMCMSinlineFB.questionData.responseType=="generic"){
		if(result=="Correct"){			
			//Feedback.showFeedback(customMCMSinlineFB.questionData.feedback.genericResponse.correct.content);
			feedBackStr=customMCMSinlineFB.questionData.feedback.genericResponse.correct.content;
			customMCMSinlineFB.showTickOnly();
		}
		else{
			if(customMCMSinlineFB.currentAttempt < customMCMSinlineFB.questionData.maxAttempts){
				//Feedback.showFeedback(customMCMSinlineFB.questionData.feedback.genericResponse.incorrect.content);
				feedBackStr=customMCMSinlineFB.questionData.feedback.genericResponse.incorrect.content;
			}else{
				//Feedback.showFeedback(customMCMSinlineFB.questionData.feedback.genericResponse.solution.content);
				feedBackStr=customMCMSinlineFB.questionData.feedback.genericResponse.solution.content;
				customMCMSinlineFB.showSolution();
			}
		}
	}else{
		var feedStr="";
		for(var c=0; c<customMCMSinlineFB.userAnswer.length ;c++){
			 feedStr += customMCMSinlineFB.questionData.specificResponse.response[customMCMSinlineFB.userAnswer[c]-1].content;
			 if(c>0)
			 	 feedStr += "<BR>"
		}
		
		//uncomment the line, if for specific response we require the instruction to de displayed.
		
		/*if(customMCMSinlineFB.currentAttempt >= customMCMSinlineFB.questionData.maxAttempts){
				 feedStr += "Correct answers are displayed on screen."
		}*/
		
		//Feedback.showFeedback(feedStr);
		feedBackStr=feedStr;
	
		if(result=="Correct"){
			customMCMSinlineFB.showTickOnly();
		}else{
			if(customMCMSinlineFB.currentAttempt >= customMCMSinlineFB.questionData.maxAttempts)
				customMCMSinlineFB.showSolution();
		}
	}

	$("#fbTextContainer").html(feedBackStr);
};

customMCMSinlineFB.closeFeedback=function(){
	if(customMCMSinlineFB.activityCompleted)
		return;
	if(customMCMSinlineFB.currentAttempt < customMCMSinlineFB.questionData.maxAttempts){
		customMCMSinlineFB.activityInitialized = false;
		customMCMSinlineFB.addListeners();
		customMCMSinlineFB.resetMCMS();
	}
};
customMCMSinlineFB.resetFeedback=function(){
	if(customMCMSinlineFB.activityCompleted)
		return;
	if(customMCMSinlineFB.currentAttempt < customMCMSinlineFB.questionData.maxAttempts){
		customMCMSinlineFB.activityInitialized = false;
		customMCMSinlineFB.addListeners();
		customMCMSinlineFB.resetMCMS();
	}
};
customMCMSinlineFB.showTickOnly=function(){
	customMCMSinlineFB.markPageComplete();
	for(var u=1; u<=customMCMSinlineFB.userAnswer.length; u++){
		var option = customMCMSinlineFB.optionArr[customMCMSinlineFB.userAnswer[u-1]-1];
		option.showTickCross("mcssTick");
	}
}

customMCMSinlineFB.markPageComplete=function (){
	if(!customMCMSinlineFB.activityCompleted){
		customMCMSinlineFB.activityCompleted = true;
		eventMgr.dispatchCustomEvent(customMCMSinlineFB,"templateActivityCompleted","","");
	}
}

customMCMSinlineFB.showSolution=function(){
	customMCMSinlineFB.markPageComplete();
			
	for(c=1; c<=customMCMSinlineFB.questionData.options.length; c++){
		var option = customMCMSinlineFB.optionArr[c-1];
		$("#mcmsContainer").find("#mcmsOption_"+c).find("#mcmsTickCross").show();		
	
		if(jQuery.inArray(c.toString(),customMCMSinlineFB.correctAnswer) >=0)
			option.showTickCross("mcssTick");
		else
			option.showTickCross("mcssCross");
	}
}

//randomization
customMCMSinlineFB.randomizeArr=function(arr){
	var randomizeArr = arr.concat();
	randomizeArr.sort(customMCMSinlineFB.shuffle);
	return randomizeArr;
};

customMCMSinlineFB.shuffle=function() {
	var ran = 0.5 - Math.random();	
	return ran;
};