
var SingleLevelYesNo = function(){};
SingleLevelYesNo.mainContainer;
SingleLevelYesNo.activityInitialized;
SingleLevelYesNo.currentId=0;
SingleLevelYesNo.clickVisitedArr	=	[];
SingleLevelYesNo.pageCompleted	=	false;
var SingleLevelYesNoData;

var evtMrg = new EventManager();
SingleLevelYesNo.imgRefArr = [];

SingleLevelYesNo.init=function(data){	
	SingleLevelYesNoData=data;
	SingleLevelYesNo.pageCompleted	=	false;
	SingleLevelYesNo.activityInitialized=false;
	
	SingleLevelYesNo.mainContainer=$("#yesNoContainer");
	SingleLevelYesNo.mainContainer.find("#instructionTxt").html(SingleLevelYesNoData.data.instruction);
	

	for(var t=0; t<SingleLevelYesNoData.data.clickable_items.length; t++){		
		SingleLevelYesNo.clickVisitedArr.push(0);
	}
	
	eventMgr.addControlEventListener(SingleLevelYesNo.mainContainer, "optionClicked", SingleLevelYesNo.checkAnswer);	
	SingleLevelYesNo.addQustion(SingleLevelYesNo.currentId);

	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		SingleLevelYesNo.addListeners();
	} else{
		$(".clk_option").css("cursor","default");
	}
}

SingleLevelYesNo.onOrientationChange= function(){	
		for(var i=0;i<SingleLevelYesNo.imgRefArr.length;i++){
		
			SingleLevelYesNo.imgRefArr[i].onOrientaionChange();
		}
}

SingleLevelYesNo.addQustion=function(inrItemId){
		var questionStr	=	SingleLevelYesNoData.data.clickable_items[inrItemId].question;
		if(SingleLevelYesNoData.data.clickable_items[inrItemId].startDivText==""){
			$("#textContainer").hide();
		}else{
			$("#textContainer").html(SingleLevelYesNoData.data.clickable_items[inrItemId].startDivText);
		}
		
		trace(SingleLevelYesNoData.data.clickable_items[inrItemId].image);
		
		var contentImage = new ImageMain($("#imgHolder"),SingleLevelYesNoData.data.clickable_items[inrItemId].image.use_image_tag);		
		contentImage.setObject(SingleLevelYesNoData.data.clickable_items[inrItemId].image);
		SingleLevelYesNo.imgRefArr.push(contentImage);		
		evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, SingleLevelYesNo.onOrientationChange);
		
		$("#question").html(questionStr);	
		$("#YNResponse").show();	
	
		/*if(SingleLevelYesNoData.data.clickable_items[inrItemId].markVisit=="init"){
			SingleLevelYesNo.enableTab();
		} */		
	
}

SingleLevelYesNo.addListeners = function(){
	if(!SingleLevelYesNo.activityInitialized){
		SingleLevelYesNo.activityInitialized = true;		
		$(".clk_option").bind('click',SingleLevelYesNo.checkAnswer);
	}
	$(".clk_option").css("cursor","pointer");
}


SingleLevelYesNo.checkAnswer	=	function(){	

	if(!$(this).hasClass("disabled")){
	
		var feedbackStr	='';	

		if(SingleLevelYesNoData.data.response=="specific"){
			
			if(SingleLevelYesNoData.data.clickable_items[SingleLevelYesNo.currentId].correct_ans=="yes"){
				if($(this).hasClass("yes_click")){
					feedbackStr=SingleLevelYesNoData.data.correct[SingleLevelYesNo.currentId].content;
					audioFileName	=	SingleLevelYesNoData.data.correct[SingleLevelYesNo.currentId].audio;
					//$(this).addClass("yes_selected");
					$(this).addClass("yes_correct");
					
				}else{
					feedbackStr=SingleLevelYesNoData.data.incorrect[SingleLevelYesNo.currentId].content;
					audioFileName	=	SingleLevelYesNoData.data.incorrect[SingleLevelYesNo.currentId].audio;
					//$(this).addClass("no_selected");
					$(this).addClass("no_incorrect");
				}
			}else{
				if($(this).hasClass("yes_click")){
					feedbackStr=SingleLevelYesNoData.data.incorrect[SingleLevelYesNo.currentId].content;
					audioFileName	=	SingleLevelYesNoData.data.incorrect[SingleLevelYesNo.currentId].audio;	
					
					//$(this).addClass("yes_selected");
					$(this).addClass("yes_incorrect");
				}else{
					feedbackStr=SingleLevelYesNoData.data.correct[SingleLevelYesNo.currentId].content;
					audioFileName	=	SingleLevelYesNoData.data.correct[SingleLevelYesNo.currentId].audio;
					//$(this).addClass("no_selected");
					$(this).addClass("no_correct");
				}	
			}
		}else{
			feedbackStr=SingleLevelYesNoData.data.generic[SingleLevelYesNo.currentId].content;
			audioFileName	=	SingleLevelYesNoData.data.generic[SingleLevelYesNo.currentId].audio;
			if(SingleLevelYesNoData.data.clickable_items[SingleLevelYesNo.currentId].correct_ans=="yes"){
				if($(this).hasClass("yes_click")){
					$(this).addClass("yes_correct");
				}else{
					$(this).addClass("no_incorrect");
				}
			}else{
				if($(this).hasClass("yes_click")){
					$(this).addClass("yes_incorrect");
				}else{
					$(this).addClass("no_correct");
				}
			}
			/* if($(this).hasClass("yes_click")){
				$(this).addClass("yes_selected");
			}else{
				$(this).addClass("no_selected");
			} */
		
		}
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		SingleLevelYesNo.displayFeedback(feedbackStr);
		$(".clk_option").addClass("disabled");
		$("#instructionMain").addClass("feedbackHighlight");
		
		if(SingleLevelYesNoData.data.clickable_items[0].markVisit=="init"){
			SingleLevelYesNo.enableTab();
		} 
	}
}
SingleLevelYesNo.displayFeedback	=	function(feedbackStr){
	$("#fb_content").html(feedbackStr);
	$("#feedback").css('display','block');
	eventMgr.dispatchCustomEvent(SingleLevelYesNo,"diaplyingfeedback","","");	
}

SingleLevelYesNo.enableTab	=	function(){
	SingleLevelYesNo.clickVisitedArr[0]=1;
	SingleLevelYesNo.checkCompletion();
}


SingleLevelYesNo.checkCompletion	=	function(){
	var vistedTab=0;
	for(var i=0;i<SingleLevelYesNo.clickVisitedArr.length;i++){
		if(SingleLevelYesNo.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}	
	if(vistedTab==parseInt(SingleLevelYesNoData.data.total_clickable)){
		SingleLevelYesNo.markPageComplete();				
	}

}
SingleLevelYesNo.markPageComplete	=	function(){
	
	if(SingleLevelYesNo.pageCompleted	==	false){
		SingleLevelYesNo.pageCompleted	=	true;
		eventMgr.dispatchCustomEvent(SingleLevelYesNo,"templateActivityCompleted","","");		
		/* MainController.markCurrentPageComplete();
		MainController.showNextInstruction();	 */
	}

}/* 
function pageAudioHandler(currTime,totTime){	
	trace(currTime +" - "+totTime)
	trace(DataManager.audioFileName)
	if(currTime >= totTime){		
		//SingleLevelYesNo.addListeners();
		if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
			SingleLevelYesNo.addListeners();
		}else{
			
			SingleLevelYesNo.enableTab();
		}
	}
} */