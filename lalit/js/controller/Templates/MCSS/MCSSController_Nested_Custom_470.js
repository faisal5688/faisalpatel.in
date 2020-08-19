var MCSS={};
MCSS.questionCounter;
MCSS.MCQData = {};
MCSS.maxOptions= 6;
MCSS.totalQuestions;
MCSS.activityCompleted=false;
MCSS.activityInitialized=false;

//quetion level data
MCSS.questionData={};
MCSS.optionArr = [];
MCSS.mainContainer;
MCSS.prevOption;
MCSS.userAnswer;
MCSS.correctAnswer;
MCSS.currentAttempt;

MCSS.initMCSS=function(data){	
	MCSS.MCQData = data;
	MCSS.mainContainer = $("#mcssContainer").find("#mcssHolder");	
	MCSS.questionCounter = -1;
	MCSS.activityInitialized = false;
	
	Feedback.init($("#mcssFeedbackBox"), $(".mcmsContainer"));	
	eventMgr.addControlEventListener(Feedback, "feedbackClosed", MCSS.closeFeedback);
	
	SubmitButton.init($("#mcssHolder").find("#mcssSubmitBtn"));
	eventMgr.addControlEventListener(SubmitButton, "submitClicked", MCSS.submitClicked);
	NextButton.init($("#mcssHolder").find("#mcssNextBtn"));
	eventMgr.addControlEventListener(NextButton, "nextClicked", MCSS.nextClicked);
	
	if(MCSS.MCQData.scenarioText.length > 1){
		$("#mcssScenarioTxt").html(MCSS.MCQData.scenarioText);
	}
	else{
		$("#mcssScenarioTxt").hide();
		$(".mcmsContainer").css("margin","0");
	}
	
	MCSS.totalQuestions	= MCSS.MCQData.MCQArr.length;	
	if(MCSS.totalQuestions <= 1)
		MCSS.mainContainer.find("#mcssNextBtn").hide();
	
	MCSS.createOptions();
	MCSS.showNextQuestion();
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);
	if(MainController.getCurrentPageCompletionStatus() == 1){
		MCSS.addListeners();
	}
}

MCSS.showNextQuestion=function(){
	MCSS.questionCounter++;
	MCSS.questionData = MCSS.MCQData.MCQArr[MCSS.questionCounter];
	MCSS.currentAttempt = 0;			
	Feedback.hideFeedback();
	MCSS.disableOptions();
	MCSS.resetMCSS();
	MCSS.showQuestion();
	if(MCSS.questionCounter > 0){
		MCSS.activityInitialized = false;
		MCSS.addListeners();
	}
	
	trace(MCSS.questionCounter +" == "+ MCSS.totalQuestions);
	if((MCSS.questionCounter+1) == MCSS.totalQuestions)
	{
		MCSS.mainContainer.find("#mcssNextBtn").hide();
	}	
}

function pageAudioHandler(currTime,totTime){	
	//trace(Math.round(currTime) +" && "+Math.round(totTime));		
	if(currTime >= totTime){				
		MCSS.addListeners();
	}
}

MCSS.createOptions=function(){
	//create clone options for assessment	
	for(var o=0;o<MCSS.maxOptions;o++){
		var option = $(MCSS.mainContainer.find("#mcssOptionContainer").find(".cloneOption")).clone();
		option.removeClass("cloneOption");				
		var opt = new Option(option,"mcss",o);		
		MCSS.optionArr.push(opt);
		eventMgr.addControlEventListener(opt.holder, "optionClicked", MCSS.mcssOptionClicked);
		MCSS.mainContainer.find("#mcssOptionContainer").append(opt.holder)
	}	
};

MCSS.addListeners=function(){
	//addlisteners to buttons	
	if(!MCSS.activityInitialized){
		MCSS.activityInitialized = true;
		for(var o=1;o<=MCSS.optionArr.length;o++){		
			var option = MCSS.optionArr[o-1];	
			option.addListeners();
		}
	}
};

MCSS.showQuestion=function(){
	MCSS.initializeMCSS();		
};

/*MCSS functionality*/
MCSS.initializeMCSS=function(){	
	MCSS.userAnswer=[];
	MCSS.correctAnswer=[];
	MCSS.activityCompleted = false;
	$("#mcssContainer").find("#mcssQuestionTxt").html(MCSS.questionData.question);
	$("#mcssContainer").find("#mcssInstructionTxt").html(MCSS.questionData.instructionText);	
	MCSS.correctAnswer = MCSS.questionData.correctAnswer.split(",");		
	$("#mcssContainer").find(".mcssOption").addClass("hiddenOption");
	$("#mcssContainer #questionCount").html(MCSS.questionCounter+1 +" of "+ MCSS.totalQuestions);
	
	if((DataManager.nAgt.indexOf("Android")!=-1)){
		//update for android Note 8
		$("#mcssHolder").css("min-height","390px");
		$("#mcssContainer").css("margin-top","0%")
	}
	for(c=0; c<MCSS.questionData.options.length; c++){		
		var option = MCSS.optionArr[c];
		option.showOption(MCSS.questionData.options[c]);	
	}
	setTimeout(function(){
		//mainController.initializeTemplateInShell();
	},20);	
}

MCSS.resetMCSS=function(){
	MCSS.userAnswer=[];	
	MCSS.prevOption = null;
	for(c=0; c<MCSS.questionData.options.length; c++){		
		var option = MCSS.optionArr[c];
		option.reset();
	}
}

MCSS.mcssOptionClicked=function(evt){
	var clicked = $(evt.target).parent().parent();
	if(MCSS.prevOption){
		MCSS.prevOption.find("#optionBox").removeClass("MCSSbulletPointsSelected");
	}	
	MCSS.prevOption = clicked;	
	var str = clicked.attr("id");
	MCSS.userAnswer[0] = str.split("_")[1];
	SubmitButton.chkSubmitEnable(true);
}

MCSS.submitClicked=function(evt){		
	if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
		AudioController.playInternalAudio("blank");
	}
	MCSS.disableOptions();	
	MCSS.chkUserAnswer();
};

MCSS.nextClicked=function(evt){	
	MCSS.showNextQuestion();
}

MCSS.disableOptions=function(){	
	for(var c=1;c<=MCSS.maxOptions;c++){		
		var option = MCSS.optionArr[c-1];
		option.disable();
	}
}

MCSS.chkUserAnswer=function(){
	var tempArr = [];
	tempArr = MCSS.correctAnswer.concat();	
	for(var c=0; c<MCSS.userAnswer.length; c++){
		//var ind = tempArr.indexOf(MCSS.userAnswer[c]);				
		var ind  = jQuery.inArray(MCSS.userAnswer[c],tempArr);
		if(ind >=0)
			tempArr.splice(ind,1);
	}	
	var result="Incorrect";
	if(tempArr.length <= 0){
		result = 'Correct';	
	}	
	MCSS.showFeedback(result);	
};


MCSS.showFeedback=function(result){
	MCSS.currentAttempt++;	
	$("#feedbackContent").animate({ scrollTop: 0 }, 10);
	if(MCSS.questionData.responseType=="generic"){
		if(result=="Correct"){
			Feedback.showFeedback(MCSS.questionData.genericResponse.correct.content);
			MCSS.showTickOnly();			
		}
		else{
			if(MCSS.currentAttempt < MCSS.questionData.maxAttempts){
				Feedback.showFeedback(MCSS.questionData.genericResponse.incorrect.content);
			}else{
				Feedback.showFeedback(MCSS.questionData.genericResponse.solution.content);
				MCSS.showSolution();				
			}
		}
	}else{
		var feedStr="";		
		for(var c=0; c<MCSS.userAnswer.length ;c++){
			 feedStr += MCSS.questionData.specificResponse.response[MCSS.userAnswer[c]-1].content;
			 if(c>0)
			 	 feedStr += "<BR>"
		}		
		
		//uncomment the line, if for specific response we require the instruction to de displayed.		
		/*if(MCSS.currentAttempt >= MCSS.questionData.maxAttempts){
				 feedStr += "Correct answer is displayed on screen."
		}*/	
		
		Feedback.showFeedback(feedStr);
		if(result=="Correct"){
			MCSS.showTickOnly();
		}else{
			if(MCSS.currentAttempt >= MCSS.questionData.maxAttempts){
				MCSS.showSolution();
			}
		}
	}
};

MCSS.closeFeedback=function(){
	if(MCSS.activityCompleted)
		return;
	if(MCSS.currentAttempt < MCSS.questionData.maxAttempts){
		MCSS.activityInitialized = false;
		MCSS.addListeners();
		MCSS.resetMCSS();
	}
};

MCSS.showTickOnly=function(){		
	for(var u=0; u<MCSS.userAnswer.length; u++){
		var option = MCSS.optionArr[MCSS.userAnswer[u]-1];
		option.showTickCross("mcssTick");
	}		
	MCSS.markPageComplete();
}

MCSS.showSolution=function(){	
	for(c=1; c<=MCSS.questionData.options.length; c++){		
		var option = MCSS.optionArr[c-1];				
		//if(MCSS.correctAnswer.indexOf(c.toString())>=0)		
		//trace(jQuery.inArray(c.toString(),MCSS.correctAnswer));
		if(jQuery.inArray(c.toString(),MCSS.correctAnswer) == -1)
			option.showTickCross("mcssCross");
		else
			option.showTickCross("mcssTick");
	}
	MCSS.markPageComplete();
	
}

MCSS.markPageComplete = function(){
	if(MCSS.questionCounter <  MCSS.totalQuestions-1){
		NextButton.chkNextEnable(true);
	}else{		
		if(!MCSS.activityCompleted){
			MCSS.activityCompleted = true;
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
			//eventMgr.dispatchCustomEvent(MCSS,"templateActivityCompleted","","");
		}
	}
}

//randomization
MCSS.randomizeArr=function(arr){
	var randomizeArr = arr.concat();
	randomizeArr.sort(MCSS.shuffle);
	return randomizeArr;
};

MCSS.shuffle=function() {
	var ran = 0.5 - Math.random();	
	return ran;
};