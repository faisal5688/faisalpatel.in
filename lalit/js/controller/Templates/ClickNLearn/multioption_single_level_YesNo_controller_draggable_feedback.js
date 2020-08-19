
var MultiOptSingleLevelYesNo = function(){};
MultiOptSingleLevelYesNo.mainContainer;
MultiOptSingleLevelYesNo.activityInitialized;
MultiOptSingleLevelYesNo.currentId=0;
MultiOptSingleLevelYesNo.clickVisitedArr	=	[];
MultiOptSingleLevelYesNo.pageCompleted	=	false;
var SingleLevelYesNoData;

var evtMrg = new EventManager();
MultiOptSingleLevelYesNo.imgRefArr = [];

MultiOptSingleLevelYesNo.init=function(data){	
	SingleLevelYesNoData=data;
	MultiOptSingleLevelYesNo.pageCompleted	=	false;
	MultiOptSingleLevelYesNo.activityInitialized=false;
	MultiOptSingleLevelYesNo.mainContainerFB = $("#yesNoContainer .txtimgContainer");
	
	//initialize Feedback	
	Feedback.init($("#actFeedbackBox"), MultiOptSingleLevelYesNo.mainContainerFB);
	eventMgr.addControlEventListener(Feedback, "feedbackClosed", MultiOptSingleLevelYesNo.closeFeedback);
	
	MultiOptSingleLevelYesNo.mainContainer=$("#yesNoContainer");
	MultiOptSingleLevelYesNo.mainContainer.find("#instructionTxt").html(SingleLevelYesNoData.data.instruction);
	

	for(var t=0; t<SingleLevelYesNoData.data.clickable_items.length; t++){		
		MultiOptSingleLevelYesNo.clickVisitedArr.push(0);
	}
	var optCount=parseInt(SingleLevelYesNoData.data.clickable_items[0].opt_cout);
	
	var str="";
	
	for(var i=0;i<optCount;i++){
		str+="<div id='opt_"+(i+1)+"' class='opt_"+(i+1)+" clk_option icon'>"+SingleLevelYesNoData.data.clickable_items[0].opt_content[i].label+"</div>";	
	}
	$("#yesno_main").html(str);
	//eventMgr.addControlEventListener(MultiOptSingleLevelYesNo.mainContainer, "optionClicked", MultiOptSingleLevelYesNo.checkAnswer);
		
	MultiOptSingleLevelYesNo.addQustion(MultiOptSingleLevelYesNo.currentId);

	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		MultiOptSingleLevelYesNo.addListeners();
	} else{
		$(".clk_option").css("cursor","default");
	}
}

MultiOptSingleLevelYesNo.onOrientationChange= function(){	
		for(var i=0;i<MultiOptSingleLevelYesNo.imgRefArr.length;i++){
		
			MultiOptSingleLevelYesNo.imgRefArr[i].onOrientaionChange();
		}
}

MultiOptSingleLevelYesNo.addQustion=function(inrItemId){
		var questionStr	=	SingleLevelYesNoData.data.clickable_items[inrItemId].question;
		if(SingleLevelYesNoData.data.clickable_items[inrItemId].startDivText==""){
			$("#textContainer").hide();
		}else{
			$("#textContainer").html(SingleLevelYesNoData.data.clickable_items[inrItemId].startDivText);
		}
		
		trace(SingleLevelYesNoData.data.clickable_items[inrItemId].image);
		
		var contentImage = new ImageMain($("#imgHolder"),SingleLevelYesNoData.data.clickable_items[inrItemId].image.use_image_tag);		
		contentImage.setObject(SingleLevelYesNoData.data.clickable_items[inrItemId].image);
		MultiOptSingleLevelYesNo.imgRefArr.push(contentImage);		
		evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, MultiOptSingleLevelYesNo.onOrientationChange);
		
		$("#question").html(questionStr);	
		$("#YNResponse").show();	
	
		/*if(SingleLevelYesNoData.data.clickable_items[inrItemId].markVisit=="init"){
			MultiOptSingleLevelYesNo.enableTab();
		} */		
	
}

MultiOptSingleLevelYesNo.addListeners = function(){
	if(!MultiOptSingleLevelYesNo.activityInitialized){
		MultiOptSingleLevelYesNo.activityInitialized = true;		
		$(".clk_option").bind('click',MultiOptSingleLevelYesNo.checkAnswer);
	}
	$(".clk_option").css("cursor","pointer");
}


MultiOptSingleLevelYesNo.checkAnswer	=	function(evt){	

	if(!$(this).hasClass("disabled")){
	
	
		var feedbackStr	='';	
		var correctOption=parseInt(SingleLevelYesNoData.data.clickable_items[MultiOptSingleLevelYesNo.currentId].correct_ans);
		
		var oName = $(evt.currentTarget).attr("id");
		var optId = parseInt(oName.substr(oName.lastIndexOf("_")+1));

		if(SingleLevelYesNoData.data.response=="specific"){
			
		if(optId == correctOption){
				feedbackStr    = SingleLevelYesNoData.data.quetionOptFeedback[MultiOptSingleLevelYesNo.currentId].option[(optId-1)].content;
				audioFileName	=SingleLevelYesNoData.data.quetionOptFeedback[MultiOptSingleLevelYesNo.currentId].option[(optId-1)].audio;
				$(this).addClass("correct");
			}else{
				feedbackStr    = SingleLevelYesNoData.data.quetionOptFeedback[MultiOptSingleLevelYesNo.currentId].option[(optId-1)].content;
				audioFileName	=SingleLevelYesNoData.data.quetionOptFeedback[MultiOptSingleLevelYesNo.currentId].option[(optId-1)].audio;
				$(this).addClass("incorrect");
			}
		}else{
			feedbackStr=SingleLevelYesNoData.data.generic[MultiOptSingleLevelYesNo.currentId].content;
			audioFileName	=	SingleLevelYesNoData.data.generic[MultiOptSingleLevelYesNo.currentId].audio;
			
			if(optId == correctOption){				
				$(this).addClass("correct");
			}else{			
				$(this).addClass("incorrect");
			}
			
		}
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		MultiOptSingleLevelYesNo.displayFeedback(feedbackStr);
		
		$(".clk_option").addClass("disabled");
		$("#instructionMain").addClass("feedbackHighlight");
		
		if(SingleLevelYesNoData.data.clickable_items[0].markVisit=="init"){
			MultiOptSingleLevelYesNo.enableTab();
		} 
	}
	
}
MultiOptSingleLevelYesNo.displayFeedback	=	function(feedbackStr){
	//$("#fb_content").html(feedbackStr);
	//$("#feedback").css('display','block');
	//$("#fb_content").scrollTop(0);
	Feedback.showFeedback(feedbackStr);
	MainController.initializeTemplateInShell();	
	eventMgr.dispatchCustomEvent(MultiOptSingleLevelYesNo,"optionClicked","","");
}

MultiOptSingleLevelYesNo.enableTab	=	function(){
	MultiOptSingleLevelYesNo.clickVisitedArr[0]=1;
	MultiOptSingleLevelYesNo.checkCompletion();
}


MultiOptSingleLevelYesNo.checkCompletion	=	function(){
	var vistedTab=0;
	for(var i=0;i<MultiOptSingleLevelYesNo.clickVisitedArr.length;i++){
		if(MultiOptSingleLevelYesNo.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}	
	if(vistedTab==parseInt(SingleLevelYesNoData.data.total_clickable)){
		MultiOptSingleLevelYesNo.markPageComplete();				
	}

}

MultiOptSingleLevelYesNo.closeFeedback=function(){
	$("#actFeedbackBox").hide();			
	
};
MultiOptSingleLevelYesNo.markPageComplete	=	function(){
	
	if(MultiOptSingleLevelYesNo.pageCompleted	==	false){
		MultiOptSingleLevelYesNo.pageCompleted	=	true;
		eventMgr.dispatchCustomEvent(MultiOptSingleLevelYesNo,"templateActivityCompleted","","");		
		/* MainController.markCurrentPageComplete();
		MainController.showNextInstruction();	 */
	}

}/* 
function pageAudioHandler(currTime,totTime){	
	trace(currTime +" - "+totTime)
	trace(DataManager.audioFileName)
	if(currTime >= totTime){		
		//MultiOptSingleLevelYesNo.addListeners();
		if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
			MultiOptSingleLevelYesNo.addListeners();
		}else{
			
			MultiOptSingleLevelYesNo.enableTab();
		}
	}
} */