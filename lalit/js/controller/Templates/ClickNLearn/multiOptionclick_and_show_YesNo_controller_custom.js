
var MultiOptionClickNShow = function(){};
MultiOptionClickNShow.mainContainer;
MultiOptionClickNShow.activityInitialized;
MultiOptionClickNShow.currentId;
MultiOptionClickNShow.clickArray	=	[];
MultiOptionClickNShow.clickVisitedArr	=	[];
MultiOptionClickNShow.pageCompleted	=	false;
MultiOptionClickNShow.type;
var ClickNShowData;
MultiOptionClickNShow.init=function(data){	
	ClickNShowData=data;
	MultiOptionClickNShow.pageCompleted	=	false;
	MultiOptionClickNShow.activityInitialized=false;
	MultiOptionClickNShow.mainContainer=$("#clickHolder");
	MultiOptionClickNShow.mainContainer.find("#instructionTxt").html(MultiOptionClickNShow.instruction);
	MultiOptionClickNShow.type=ClickNShowData.data.type;
	for(var t=0; t<ClickNShowData.data.clickable_items.length; t++){
		var clickMC = MultiOptionClickNShow.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");	
	
		var mc = new Clickable_Image(clickMC,t,ClickNShowData.data.clickable_items[t]);	
		
		MultiOptionClickNShow.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", MultiOptionClickNShow.tabClicked);	
		MultiOptionClickNShow.mainContainer.find(".tempClick").before(mc.holder);		
		MultiOptionClickNShow.clickVisitedArr.push(0);		
	}
		for(var o=0;o<MultiOptionClickNShow.clickArray.length;o++){
			trace(MultiOptionClickNShow.clickArray[o].id);
			$("#click_"+MultiOptionClickNShow.clickArray[o].id).addClass("click_"+MultiOptionClickNShow.clickArray[o].id);
			
		}
		
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		$(".tempClick").hide();
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		MultiOptionClickNShow.addListeners();
	} 
}
MultiOptionClickNShow.tabClicked=function(evt){

	if(!$(this).hasClass("disabled")){
		
		AudioController.playInternalAudio("blank");		
		var eName = $(evt.currentTarget).attr("id");
		var clickId = parseInt(eName.substr(eName.lastIndexOf("_")+1));	
		var questionStr	=	ClickNShowData.data.clickable_items[(clickId-1)].question;	
		var questionRefContent=ClickNShowData.data.clickable_items[(clickId-1)].question_ref_Content;
		var optionCount = parseInt(ClickNShowData.data.clickable_items[(clickId-1)].opt_cout);
		var leftContent = ClickNShowData.data.clickable_items[(clickId-1)].leftContent;
		
		var str = "";
		for(var i=0;i<optionCount;i++){;
			
			str += "<li id='opt_"+(i+1)+"' class='opt_"+(i+1)+" clk_option icon' style='cursor: pointer;'>"+ClickNShowData.data.clickable_items[(clickId-1)].opt_content[i].label+"</li>";
		}
		
		$("#QA").html(str);

		
		//comment below line to do sequencing
		$(".clickItem").removeClass("disabled");
		
		$(this).addClass("disabled");
		$("#question").html(questionStr);
		$("#quesRefContent").html(questionRefContent);
		$("#imgLeftContent img").attr("src",leftContent);
		
		$("#YNResponse").removeClass();
		$("#YNResponse").addClass("i_response response");
		$("#YNResponse").addClass("res_"+clickId);
		$("#rgtFeedback").removeClass();
		$("#rgtFeedback").addClass("fb_"+clickId);
		$("#rgtFeedback").addClass("right_portion");
		
		$("#YNResponse").show();
		if(MultiOptionClickNShow.currentId!=clickId){
				$("#rgtFeedback").css('display','none');
				$(".clk_option").removeClass("disabled");

				for(var i=0;i<optionCount;i++){
					$("#opt_"+i).removeClass();	
					$("#opt_"+i).addClass("opt_"+(i+1)+" clk_option icon");	
				}

		}
		$(".clk_option").unbind('click',MultiOptionClickNShow.checkAnswer);
		$(".clk_option").bind('click',MultiOptionClickNShow.checkAnswer);
		MultiOptionClickNShow.currentId=clickId;
		eventMgr.dispatchCustomEvent(MultiOptionClickNShow,"templateTabClicked","","");	
		if(ClickNShowData.data.clickable_items[MultiOptionClickNShow.currentId-1].markVisit=="init"){			
			MultiOptionClickNShow.enableTab();		
		}	
	}
}
MultiOptionClickNShow.closeFeedback = function(){
	if($("#fb_close").hasClass("disabled")){
		return;
	}else{
		//AudioController.playInternalAudio('blank');	
		$("#rgtFeedback").css('display','none');
	}
}

MultiOptionClickNShow.addListeners = function(){

	if(!MultiOptionClickNShow.activityInitialized){
		MultiOptionClickNShow.activityInitialized = true;
		for(var o=0;o<MultiOptionClickNShow.clickArray.length;o++){
			MultiOptionClickNShow.clickArray[o].addListeners();		
		}	
	
		$("#fb_close").bind('click',MultiOptionClickNShow.closeFeedback);
	}	

	
	$(".clickItem").removeClass("disabled");	
	
}
MultiOptionClickNShow.checkAnswer	=	function(evt){	

	if(!$(this).hasClass("disabled")){
		MainController.initializeTemplateInShell();	
		
		$("#fb_close").addClass("disabled");
		$(".clickItem").addClass("disabled");		
		var feedbackStr	='';
		var intCurrentId=parseInt(MultiOptionClickNShow.currentId-1);
		var correctOption=parseInt(ClickNShowData.data.clickable_items[intCurrentId].correct_ans);
		
		var oName = $(evt.currentTarget).attr("id");
		var optId = parseInt(oName.substr(oName.lastIndexOf("_")+1));	
		
		if(MultiOptionClickNShow.type == 'generic')
		{
			if(optId == correctOption){
				feedbackStr    = ClickNShowData.data.correct[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.correct[intCurrentId].audio;
				$(this).addClass("correct");
			}else{
				feedbackStr    = ClickNShowData.data.incorrect[intCurrentId].content;
				audioFileName	=	ClickNShowData.data.incorrect[intCurrentId].audio;
				$(this).addClass("incorrect");
			}
		}
		else{
		
			if(optId == correctOption){
				feedbackStr    = ClickNShowData.data.quetionOptFeedback[intCurrentId].option[(optId-1)].content;
				audioFileName	=ClickNShowData.data.quetionOptFeedback[intCurrentId].option[(optId-1)].audio;
				$(this).addClass("correct");
			}else{
				feedbackStr    = ClickNShowData.data.quetionOptFeedback[intCurrentId].option[(optId-1)].content;
				audioFileName	=ClickNShowData.data.quetionOptFeedback[intCurrentId].option[(optId-1)].audio;
				$(this).addClass("incorrect");
			}
		
		}
		

		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		MultiOptionClickNShow.displayFeedback(feedbackStr);
		$(".clk_option").addClass("disabled");
	}
}
MultiOptionClickNShow.displayFeedback	=	function(feedbackStr){
	$("#inFBContent").html(feedbackStr);
	
	$("#rgtFeedback").css('display','block');
	$("#inFBContent").scrollTop(0);
	MainController.initializeTemplateInShell();	
}

MultiOptionClickNShow.enableTab	=	function(){
	$("#click_"+MultiOptionClickNShow.currentId).find(".imageZoom").addClass("visitedArrow");

	//uncomment below line of code if want sequencing	
	if(ClickNShowData.data.sequencing=="false"||ClickNShowData.data.sequencing==false){
			$(".clickItem").removeClass("disabled");
			$("#click_"+MultiOptionClickNShow.currentId).addClass("disabled");
		}else{	
			MultiOptionClickNShow.enableTabInSquence();
	}
	
	//comment below two line of code if want sequencing	
/* 	$(".clickItem").removeClass("disabled");
	$("#click_"+MultiOptionClickNShow.currentId).addClass("disabled"); */
	
	MultiOptionClickNShow.clickVisitedArr[MultiOptionClickNShow.currentId-1]=1;
	MultiOptionClickNShow.checkCompletion();
}

/*
@this function used for sequencing the tab
*/
MultiOptionClickNShow.enableTabInSquence	=	function(){

	for(var i=0;i<ClickNShowData.data.clickable_items.length;i++){

		if(i<MultiOptionClickNShow.currentId-1){
			$("#click_"+(i+1)).removeClass("disabled");
		}
		
		if(MultiOptionClickNShow.currentId<parseInt(ClickNShowData.data.total_clickable)){
			$("#click_"+(MultiOptionClickNShow.currentId+1)).removeClass("disabled");		
		}
	}
}

MultiOptionClickNShow.checkCompletion	=	function(){
	var vistedTab=0
	for(var i=0;i<MultiOptionClickNShow.clickVisitedArr.length;i++){
		if(MultiOptionClickNShow.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}	
	if(vistedTab==parseInt(ClickNShowData.data.total_clickable)){
				MultiOptionClickNShow.markPageComplete();				
	}

}
MultiOptionClickNShow.markPageComplete	=	function(){
	
	if(MultiOptionClickNShow.pageCompleted	==	false){
		MultiOptionClickNShow.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(MultiOptionClickNShow,"templateActivityCompleted","","");	
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();	
	}

}

MultiOptionClickNShow.removeDisabled = function(){
	$("#fb_close").removeClass("disabled");

}

/* 
function pageAudioHandler(currTime,totTime){	
	trace(currTime +" - "+totTime)
	trace(DataManager.audioFileName)
	if(currTime >= totTime){		
		//MultiOptionClickNShow.addListeners();
		if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
			MultiOptionClickNShow.addListeners();
		}else if(DataManager.audioFileName=="blank"){}else{
			
			MultiOptionClickNShow.enableTab();
			MultiOptionClickNShow.removeDisabled();
		}
	}
} */