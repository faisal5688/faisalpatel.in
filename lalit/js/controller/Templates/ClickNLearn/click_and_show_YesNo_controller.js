
var ClickNShow = function(){};
ClickNShow.mainContainer;
ClickNShow.activityInitialized;
ClickNShow.currentId;
ClickNShow.clickArray	=	[];
ClickNShow.clickVisitedArr	=	[];
ClickNShow.pageCompleted	=	false;
var ClickNShowData;
ClickNShow.init=function(data){	
	ClickNShowData=data;
	ClickNShow.pageCompleted	=	false;
	ClickNShow.activityInitialized=false;
	ClickNShow.mainContainer=$("#clickHolder");
	ClickNShow.mainContainer.find("#instructionTxt").html(ClickNShow.instruction);
	
	for(var t=0; t<ClickNShowData.data.clickable_items.length; t++){
		var clickMC = ClickNShow.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");	
	
		var mc = new Clickable_Image(clickMC,t,ClickNShowData.data.clickable_items[t]);	
		
		ClickNShow.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNShow.tabClicked);	
		ClickNShow.mainContainer.find(".tempClick").before(mc.holder);		
		ClickNShow.clickVisitedArr.push(0);		
	}
		for(var o=0;o<ClickNShow.clickArray.length;o++){
			trace(ClickNShow.clickArray[o].id);
			$("#click_"+ClickNShow.clickArray[o].id).addClass("click_"+ClickNShow.clickArray[o].id);
			
		}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		$(".tempClick").hide();
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		ClickNShow.addListeners();
	} 
}
ClickNShow.tabClicked=function(evt){

	if(!$(this).hasClass("disabled")){
		AudioController.playInternalAudio("blank");		
		var eName = $(evt.currentTarget).attr("id");
		var clickId = parseInt(eName.substr(eName.lastIndexOf("_")+1));			
		var questionStr	=	ClickNShowData.data.clickable_items[(clickId-1)].question;	
		
		//uncomment below code to do squencing
		/*if(ClickNShowData.data.sequencing=="false"||ClickNShowData.data.sequencing==false){
			$(".clickItem").removeClass("disabled");
		}else{	
			$("#click_"+ClickNShow.currentId).removeClass("disabled");
		}*/
		
		//comment below line to do sequencing
		$(".clickItem").removeClass("disabled");
		$(this).addClass("disabled");
		$("#question").html(questionStr);
		$("#YNResponse").removeClass();
		$("#YNResponse").addClass("i_response response");
		$("#YNResponse").addClass("res_"+clickId);
		$("#feedback").removeClass();
		$("#feedback").addClass("fb_"+clickId);
		
		$("#YNResponse").show();
		if(ClickNShow.currentId!=clickId){
				$("#feedback").css('display','none');
				$(".clk_option").removeClass("disabled");				
				$("#optNo").removeClass("no_incorrect");	
				$("#optNo").removeClass("no_correct");	
				$("#optYes").removeClass("yes_correct");	
				$("#optYes").removeClass("yes_incorrect");	
		}
		ClickNShow.currentId=clickId;
		if(ClickNShowData.data.clickable_items[ClickNShow.currentId-1].markVisit=="init"){			
			ClickNShow.enableTab();		
		}	
	}
}
ClickNShow.closeFeedback = function(){
	if($("#fb_close").hasClass("disabled")){
		return;
	}else{
		AudioController.playInternalAudio('blank');	
		$("#feedback").css('display','none');
	}
}

ClickNShow.addListeners = function(){
	if(!ClickNShow.activityInitialized){
		ClickNShow.activityInitialized = true;
		for(var o=0;o<ClickNShow.clickArray.length;o++){
			ClickNShow.clickArray[o].addListeners();		
		}	
		$(".clk_option").bind('click',ClickNShow.checkAnswer);
		$("#fb_close").bind('click',ClickNShow.closeFeedback);
	}
	
	//uncomment below line of code if want sequencing	
	/*if(ClickNShowData.data.sequencing=="false"||ClickNShowData.data.sequencing==false){	
			$(".clickItem").removeClass("disabled");	
		}else{		
			$("#click_"+1).removeClass("disabled");		
	}*/
	
	//comment below line of code if want sequencing	
	$(".clickItem").removeClass("disabled");	
	
}
ClickNShow.checkAnswer	=	function(){	

	if(!$(this).hasClass("disabled")){
		MainController.initializeTemplateInShell();	
		$("#fb_close").addClass("disabled");
		//$(".clickItem").addClass("disabled");		
		var feedbackStr	='';
		var intCurrentId=parseInt(ClickNShow.currentId-1);
		
		if(ClickNShowData.data.clickable_items[intCurrentId].correct_ans=="yes"){
			if($(this).hasClass("yes_click")){
				feedbackStr=ClickNShowData.data.correct[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.correct[intCurrentId].audio;
				$(this).addClass("yes_correct");
				
			}else{
				feedbackStr=ClickNShowData.data.incorrect[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.incorrect[intCurrentId].audio;
				$(this).addClass("no_incorrect");
			}
		}else{
			if($(this).hasClass("yes_click")){
				feedbackStr=ClickNShowData.data.incorrect[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.incorrect[intCurrentId].audio;	
				$(this).addClass("yes_incorrect");
			}else{
				feedbackStr=ClickNShowData.data.correct[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.correct[intCurrentId].audio;
				$(this).addClass("no_correct");
			}	
		}
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		ClickNShow.displayFeedback(feedbackStr);
		$(".clk_option").addClass("disabled");
	}
}
ClickNShow.displayFeedback	=	function(feedbackStr){
	$("#fb_content").html(feedbackStr);
	$("#feedback").css('display','block');
}

ClickNShow.enableTab	=	function(){
	$("#click_"+ClickNShow.currentId).find(".imageZoom").addClass("visitedArrow");

	//uncomment below line of code if want sequencing	
	/*if(ClickNShowData.data.sequencing=="false"||ClickNShowData.data.sequencing==false){
			$(".clickItem").removeClass("disabled");
			$("#click_"+ClickNShow.currentId).addClass("disabled");
		}else{	
			ClickNShow.enableTabInSquence();
	}*/	
	
	//comment below two line of code if want sequencing	
	$(".clickItem").removeClass("disabled");
	$("#click_"+ClickNShow.currentId).addClass("disabled");
	
	ClickNShow.clickVisitedArr[ClickNShow.currentId-1]=1;
	ClickNShow.checkCompletion();
}

/*
@this function used for sequencing the tab
*/
ClickNShow.enableTabInSquence	=	function(){
	for(var i=0;i<ClickNShowData.data.clickable_items.length;i++){		
		if(i<ClickNShow.currentId-1){
			$("#click_"+(i+1)).removeClass("disabled");
		}
		if(ClickNShow.currentId<parseInt(ClickNShowData.data.total_clickable)){
			$("#click_"+(ClickNShow.currentId+1)).removeClass("disabled");		
					
		}
	}
}

ClickNShow.checkCompletion	=	function(){
	var vistedTab=0
	for(var i=0;i<ClickNShow.clickVisitedArr.length;i++){
		if(ClickNShow.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}	
	if(vistedTab==parseInt(ClickNShowData.data.total_clickable)){
				ClickNShow.markPageComplete();				
	}

}
ClickNShow.markPageComplete	=	function(){
	
	if(ClickNShow.pageCompleted	==	false){
		ClickNShow.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(ClickNShow,"templateActivityCompleted","","");	
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();	
	}

}

ClickNShow.removeDisabled = function(){
	$("#fb_close").removeClass("disabled");

}

/* 
function pageAudioHandler(currTime,totTime){	
	trace(currTime +" - "+totTime)
	trace(DataManager.audioFileName)
	if(currTime >= totTime){		
		//ClickNShow.addListeners();
		if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
			ClickNShow.addListeners();
		}else if(DataManager.audioFileName=="blank"){}else{
			
			ClickNShow.enableTab();
			ClickNShow.removeDisabled();
		}
	}
} */