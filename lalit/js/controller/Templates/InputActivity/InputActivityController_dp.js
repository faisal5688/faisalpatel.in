
var ActivityObj = {};
ActivityObj.acitivityInitialized = false;
ActivityObj.acitivityCompleted = false;
ActivityObj.currentAttempt=0;
ActivityObj.maxCharLength=250;
ActivityObj.wrong = 0;
var ActivityData;


ActivityObj.initActivity=function(data){	
	ActivityData = data;
	ActivityObj.mainContainer = $("#activityContainer #activityHolder");
	ActivityObj.acitivityInitialized = false;
	ActivityObj.acitivityCompleted = false;

	//initialize Feedback	
	Feedback.init($("#actFeedbackBox"), ActivityObj.mainContainer);
	eventMgr.addControlEventListener(Feedback, "feedbackClosed", ActivityObj.closeFeedback);
	
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
		ActivityObj.mainContainer.find("#tick_"+(d+1)).removeClass("inputCross","inputTick");	//ActivityObj.addListenersToInput(ActivityObj.mainContainer.find("#input_"+(d+1)),data[d].type);	
	}
	ActivityObj.enableOptions(true);
	if(ActivityObj.currentAttempt < ActivityData.maxAttempts)
		SubmitButton.chkSubmitEnable(false);
}

ActivityObj.addListenersToInput=function(data){
ActivityObj.initialize();
	for(var d=0; d<data.length; d++){
		var obj = ActivityObj.mainContainer.find("#input_"+(d+1));
		switch(data[d].type){
			 
			case "dropDown":
				obj.change(function() {
					
					SubmitButton.chkSubmitEnable(ActivityObj.checkAcitivtyPerformed());
				});
			break;
		}
	}
}

ActivityObj.checkAcitivtyPerformed =function(){
	var allAttempted = true;
	for(var d=0; d<ActivityData.Activities.length; d++){
		 
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
		$("#buttonSub").removeClass("submitButton").addClass("disabled");
		$("#buttonSub").attr("disabled","disabled");
		ActivityObj.markComplete();
		ActivityObj.showTickCross();
	}
	else if(ActivityObj.currentAttempt < ActivityData.maxAttempts){		 
		Feedback.showFeedback(ActivityData.feedback.incorrect.content);
		ActivityObj.wrong++;
		
	}else{
		//ActivityObj.showSoluton();
		//ActivityObj.markComplete();
		Feedback.showFeedback(ActivityData.feedback.solution.content);
	}
	if(ActivityObj.currentAttempt ==2){
	ActivityObj.showTickCross();
	}
};

ActivityObj.showSoluton = function(){
	var dataRef = ActivityData.Activities;
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			 
			case "dropDown":				
				ActivityObj.mainContainer.find("#input_"+(d+1)).prop("selectedIndex",dataRef[d].answer) 	
				ActivityObj.mainContainer.find("#input_"+(d+1)).css("font-weight", "bold");
				ActivityObj.mainContainer.find("#input_"+(d+1)).css("color", "black");
			break;
		}
		ActivityObj.mainContainer.find("#tick_"+(d+1)).hide();
		ActivityObj.mainContainer.find("#tick_"+(d+1)).removeClass("inputCross","inputTick");
		ActivityObj.mainContainer.find("#tick_"+(d+1)).addClass("inputTick");
		ActivityObj.mainContainer.find("#tick_"+(d+1)).show();
	}
}

ActivityObj.showTickCross=function(){
	var dataRef = ActivityData.Activities;
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			 
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
	trace(Math.round(currTime) +"  &&  "+ Math.round(totTime-0.1));
	if(currTime >= totTime){				
		ActivityObj.initialize();
	}
}