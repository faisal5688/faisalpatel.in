
var ActivityObj = {};
ActivityObj.acitivityInitialized = false;
ActivityObj.acitivityCompleted = false;
ActivityObj.currentAttempt=0;
ActivityObj.maxCharLength=250;
var ActivityData;


ActivityObj.initActivity=function(data){	
	ActivityData = data;
	ActivityObj.mainContainer = $("#activityContainer #activityHolder");
	ActivityObj.acitivityInitialized = false;
	ActivityObj.acitivityCompleted = false;

	//initialize Feedback	
	Feedback.init($("#actFeedbackBox"), ActivityObj.mainContainer);
//	eventMgr.addControlEventListener(Feedback, "feedbackClosed", ActivityObj.closeFeedback);
		$("#feedbackClose").hide();
	Feedback.holder.css("position","relative");
	
	SubmitButton.init(ActivityObj.mainContainer.find("#submitBtn"));
	eventMgr.addControlEventListener(SubmitButton, "submitClicked", ActivityObj.submitClicked);
	
	if(ActivityData.image){
		var contentImage = new Image();
		var retina = (window.retina || window.devicePixelRatio > 1);
		$(contentImage).attr("src",ActivityData.image);
		$("#activityContainer #imageHolder").append(contentImage);
		$("#activityContainer #imageHolder").show();	
	}else{
		setTimeout(function(){
			MainController.initializeTemplateInShell();	
		},60);
	}	
	ActivityObj.enableOptions(false);
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
		
	//if page already visited earlier		
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ActivityObj.initialize();
	}
}

ActivityObj.initialize = function(){
	if(!ActivityObj.acitivityInitialized){
		ActivityObj.acitivityInitialized = true;
		ActivityObj.initInternalActivity(ActivityData.Activities);
		ActivityObj.addListenersToInput(ActivityData.Activities);
		InputFocusController.initialize();
	}
}

ActivityObj.initInternalActivity=function(data){
	for(var d=0; d<data.length; d++){
		switch(data[d].type){
			case "input":
				if(data[d].answer.length >= ActivityObj.maxCharLength)
					ActivityObj.maxCharLength = data[d].answer.length+3;					
				ActivityObj.mainContainer.find("#input_"+(d+1)).val("");				
			break;
			case "dropDown":				
				var str = "";
				for(var i=0; i<data[d].options.length;i++){
					var opt = "<option value='"+$(data[d].options[i]).attr("option")+"'>"+$(data[d].options[i]).attr("option")+"</option>";
					str+= opt;
				}
				ActivityObj.mainContainer.find("#input_"+(d+1)).html(str);				
			break;
		}		
		ActivityObj.mainContainer.find("#tick_"+(d+1)).hide();
		ActivityObj.mainContainer.find("#tick_"+(d+1)).removeClass("inputCross","inputTick");	//ActivityObj.addListenersToInput(ActivityObjActivityObj.mainContainer.find("#input_"+(d+1)),data[d].type);	
	}
	ActivityObj.enableOptions(true);
	if(ActivityObj.currentAttempt < ActivityData.maxAttempts)
		SubmitButton.chkSubmitEnable(false);
}

ActivityObj.addListenersToInput=function(data){
	for(var d=0; d<data.length; d++){
		var obj = ActivityObj.mainContainer.find("#input_"+(d+1));
		switch(data[d].type){
			case "input":
				obj.keyup(function() {
					AudioController.playInternalAudio('blank');
					SubmitButton.chkSubmitEnable(ActivityObj.checkAcitivtyPerformed());
				});
			break;
			case "dropDown":
				obj.change(function() {
					AudioController.playInternalAudio('blank');
					SubmitButton.chkSubmitEnable(ActivityObj.checkAcitivtyPerformed());
				});
			break;
		}
	}
}

ActivityObj.checkAcitivtyPerformed =function(){
	var allAttempted = true;
	for(var d=0; d<ActivityData.Activities.length; d++){
		if(ActivityData.Activities[d].type == "input"){
			//trace(ActivityObj.mainContainer.find("#input_"+(d+1)).val().length)
			if(ActivityObj.mainContainer.find("#input_"+(d+1)).val().length <= 0){
				allAttempted = false;
				break;
			}
		}
		if(ActivityData.Activities[d].type == "dropDown"){
			if(ActivityObj.mainContainer.find("#input_"+(d+1)).prop("selectedIndex") == 0){
				allAttempted = false;
				break;
			}
		}
	}
	return allAttempted;
}

ActivityObj.enableOptions=function(flag){
	for(var d=0; d<ActivityData.Activities.length; d++){		
		ActivityObj.mainContainer.find("#input_"+(d+1)).prop('disabled',!flag);				
		if(ActivityData.Activities[d].type == 'input')
			ActivityObj.mainContainer.find("#input_"+(d+1)).prop('maxlength',ActivityObj.maxCharLength);
	}
}

ActivityObj.submitClicked = function(){
	//trace($(this).find("input").hasClass("disabled"))
	if($(this).find("input").hasClass("disabled"))
		return;
	ActivityObj.enableOptions(false);
	$(this).find("input").addClass("disabled");
	ActivityObj.checkAnswer();
}

ActivityObj.checkAnswer = function(){
	var dataRef = ActivityData.Activities;
	var correctCounter = 0;
	
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			case "input":
				if(ActivityObj.mainContainer.find("#input_"+(d+1)).val().toLowerCase() == dataRef[d].answer.toLowerCase()){
					correctCounter++;
				}
			break;
			case "dropDown":				
				if(ActivityObj.mainContainer.find("#input_"+(d+1)).prop("selectedIndex") == dataRef[d].answer){
					correctCounter++;
				}				
			break;
		}
	}	
	if(correctCounter >= dataRef.length){
		ActivityObj.showFeedback(true);

	}else{
		ActivityObj.showFeedback(false);
	}
}

ActivityObj.showFeedback=function(result){
	ActivityObj.currentAttempt++;			
	//trace(result + " - "+ActivityObj.currentAttempt+ ' - '+ActivityData.maxAttempts)
	if(result){		
		Feedback.showFeedback(ActivityData.feedback.correct.content);
		ActivityObj.markComplete();	
		setTimeout(function(){
			MainController.initializeTemplateInShell();	
		},60);		
	}
	else if(ActivityObj.currentAttempt < ActivityData.maxAttempts){
		Feedback.showFeedback(ActivityData.feedback.incorrect.content);
	}else{
		//ActivityObj.showSoluton();
		//ActivityObj.markComplete();
		Feedback.showFeedback(ActivityData.feedback.solution.content);
	}
	if(ActivityObj.activityCompleted)
		return;
	if(ActivityObj.currentAttempt < ActivityData.maxAttempts){
		ActivityObj.initInternalActivity(ActivityData.Activities);
	}else{
		ActivityObj.showSoluton();
		ActivityObj.markComplete();
	}
	AudioController.playInternalAudio('blank');
	ActivityObj.showTickCross();
	MainController.initializeTemplateInShell();	
};

ActivityObj.showSoluton = function(){
	var dataRef = ActivityData.Activities;
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			case "input":
				ActivityObj.mainContainer.find("#input_"+(d+1)).val(dataRef[d].answer);				
			break;
			case "dropDown":				
				ActivityObj.mainContainer.find("#input_"+(d+1)).prop("selectedIndex",dataRef[d].answer) 			
			break;
		}
		ActivityObj.mainContainer.find("#tick_"+(d+1)).hide();
	}
}

ActivityObj.showTickCross=function(){
	var dataRef = ActivityData.Activities;
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			case "input":
				if(ActivityObj.mainContainer.find("#input_"+(d+1)).val().toLowerCase() == dataRef[d].answer.toLowerCase()){
					ActivityObj.mainContainer.find("#tick_"+(d+1)).addClass("inputTick");
				}else{
					ActivityObj.mainContainer.find("#tick_"+(d+1)).addClass("inputCross");
				}
			break;
			case "dropDown":								
				if(ActivityObj.mainContainer.find("#input_"+(d+1)).prop("selectedIndex").toString() == dataRef[d].answer){
					ActivityObj.mainContainer.find("#tick_"+(d+1)).addClass("inputTick");
				}else{
					ActivityObj.mainContainer.find("#tick_"+(d+1)).addClass("inputCross");
				}				
			break;
		}
		ActivityObj.mainContainer.find("#tick_"+(d+1)).show();
	}	
}

ActivityObj.markComplete = function(){
	if(!ActivityObj.activityCompleted){
		ActivityObj.activityCompleted = true;	
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();
		eventMgr.dispatchCustomEvent(ActivityObj,"templateActivityCompleted","","");
		//DataManager.isSliderLocked	= false;	
	}
}


ActivityObj.closeFeedback=function(){
	$("#actFeedbackBox").hide();			
	if(ActivityObj.activityCompleted)
		return;
	if(ActivityObj.currentAttempt < ActivityData.maxAttempts){
		ActivityObj.initInternalActivity(ActivityData.Activities);
	}else{
		ActivityObj.showSoluton();
		ActivityObj.markComplete();
	}
};

ActivityObj.pageAudioHandler = function(currTime,totTime){	
	//trace(Math.round(currTime) +"  &&  "+ Math.round(totTime-0.1));
	if(currTime >= totTime){				
		ActivityObj.initialize();
	}
}