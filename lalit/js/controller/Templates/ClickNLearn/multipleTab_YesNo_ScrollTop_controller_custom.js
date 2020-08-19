
var YesNoMultiple = function(){};
YesNoMultiple.mainContainer;
YesNoMultiple.activityInitialized;
YesNoMultiple.currentId;
YesNoMultiple.clickArray	=	[];
YesNoMultiple.clickVisitedArr	=	[];
YesNoMultiple.pageCompleted	=	false;
YesNoMultiple.YesNoAudioPlaying = false;
var YesNoMultipleData;

YesNoMultiple.init=function(data){	
	YesNoMultipleData=data;
	YesNoMultiple.pageCompleted	=	false;
	YesNoMultiple.activityInitialized=false;
	YesNoMultiple.mainContainer=$("#clickHolder");
	$("#instructionTxt").find(".instruction_details").html(YesNoMultipleData.data.instruction);
	
	for(var t=0; t<YesNoMultipleData.data.clickable_items.length; t++){
		var clickMC = YesNoMultiple.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");	
	
		var mc = new Clickable_Image(clickMC,t,YesNoMultipleData.data.clickable_items[t]);	
		YesNoMultiple.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", YesNoMultiple.tabClicked);	
		YesNoMultiple.mainContainer.find(".tempClick").before(mc.holder);		
		YesNoMultiple.clickVisitedArr.push(0);		
	}
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		$(".tempClick").hide();
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		YesNoMultiple.addListeners();
	} 
}
YesNoMultiple.tabClicked=function(evt){
	eventMgr.dispatchCustomEvent(YesNoMultiple,"tabClicked","","");
	if(!$(this).hasClass("current")){
		$("#question").scrollTop(0);
	}
	

	var e= $(this).attr("id");
	
	
	
	
	MainController.initializeTemplateInShell();
	if(!$(this).hasClass("disabled")){
		$("#optNo").removeClass("no_incorrect_joint");
		if(e == "click_1")
		{
			$("#optYes").removeClass("clk_option disabled ").addClass("clk_option_joint");
			$("#optNo").removeClass("clk_option disabled ").addClass("clk_option_joint no_click_joint");
		}
		
		if( e == "click_2"){
			$("#optYes").removeClass("clk_option_joint").addClass("clk_option");
			$("#optNo").removeClass("clk_option_joint no_click_joint").addClass("clk_option");
		}
		
		if( e == "click_3"){
			$("#optYes").removeClass("clk_option_joint").addClass("clk_option");
			$("#optNo").removeClass("clk_option_joint no_click_joint").addClass("clk_option");
		}


	
		var eName = $(evt.currentTarget).attr("id");
		var clickId = parseInt(eName.substr(eName.lastIndexOf("_")+1));			
		var questionStr	=	YesNoMultipleData.data.clickable_items[(clickId-1)].question;	
		var scenarioStr = YesNoMultipleData.data.clickable_items[(clickId-1)].scenarioText;
		$("#logoImage").hide();
		//uncomment below code to do squencing
		if(YesNoMultipleData.data.sequencing=="false"||YesNoMultipleData.data.sequencing==false){
			$(".clickItem").removeClass("disabled");
			$(".clickItem").removeClass("current");
		}else{	
			$("#click_"+YesNoMultiple.currentId).removeClass("disabled");
			$("#click_"+YesNoMultiple.currentId).removeClass("current");
		}
		
		//comment below line to do sequencing
		//$(".clickItem").removeClass("disabled");
		audioFileName	=	YesNoMultipleData.data.clickable_items[(clickId-1)].audio;
		$(this).addClass("disabled");
		$(this).addClass("current");
		$("#question").html(questionStr);
		if($.trim(scenarioStr).length>0){
			$("#scenarioText").html(scenarioStr);	
		}else{
			$("#scenarioText").hide();
		}
		$("#YNResponse").show();
		if(YesNoMultiple.currentId!=clickId){
				$("#feedback").css('display','none');
				$(".clk_option").removeClass("disabled");
				$(".clk_option_joint").removeClass("disabled");
				
				//$("#optNo").removeClass("no_selected");	
				//$("#optYes").removeClass("yes_selected");	
				if($("#optNo").hasClass("no_incorrect"))
				{
					$("#optNo").removeClass("no_incorrect");	
				}					
				if($("#optNo").hasClass("no_correct"))
				{
					$("#optNo").removeClass("no_correct");	
				}
				if($("#optYes").hasClass("yes_incorrect"))
				{
					$("#optYes").removeClass("yes_incorrect");	
				}	
				if($("#optYes").hasClass("yes_correct"))
				{
					$("#optYes").removeClass("yes_correct");	
				}
		}
		AudioController.playInternalAudio(audioFileName);
		YesNoMultiple.currentId=clickId;
		if(YesNoMultipleData.data.clickable_items[YesNoMultiple.currentId-1].markVisit=="init"){			
			YesNoMultiple.enableTab();		
		}	
		
	}
	
}

YesNoMultiple.addListeners = function(){
	if(!YesNoMultiple.activityInitialized){
		YesNoMultiple.activityInitialized = true;
		for(var o=0;o<YesNoMultiple.clickArray.length;o++){
			YesNoMultiple.clickArray[o].addListeners();		
		}	
		$(".clk_option,.clk_option_joint").bind('click',YesNoMultiple.checkAnswer);
	}
	
	//uncomment below line of code if want sequencing	
	if(YesNoMultipleData.data.sequencing=="false"||YesNoMultipleData.data.sequencing==false){	
			$(".clickItem").removeClass("disabled");	
		}else{		
			$("#click_"+1).removeClass("disabled");		
	}
	
	//comment below line of code if want sequencing	
	//$(".clickItem").removeClass("disabled");	
	
}
YesNoMultiple.checkAnswer	=	function(){

		
	
	if(!$(this).hasClass("disabled")){
		$(".clickItem").addClass("disabled");		
		var feedbackStr	='';
		var intCurrentId=parseInt(YesNoMultiple.currentId-1);
		
		if(YesNoMultipleData.data.clickable_items[intCurrentId].correct_ans=="yes"){
			if($(this).hasClass("yes_click")){
				feedbackStr=YesNoMultipleData.data.correct[intCurrentId].content;
				audioFileName	=	YesNoMultipleData.data.correct[intCurrentId].audio;
				//$(this).addClass("yes_selected");
				$(this).addClass("yes_correct");
				
			}else{
				feedbackStr=YesNoMultipleData.data.incorrect[intCurrentId].content;
				audioFileName	=	YesNoMultipleData.data.incorrect[intCurrentId].audio;
				//$(this).addClass("no_selected");
				$(this).addClass("no_incorrect");
				$(".no_click_joint").removeClass("no_incorrect").addClass("no_incorrect_joint");
				
			}
		}else{
			if($(this).hasClass("yes_click")){
				feedbackStr=YesNoMultipleData.data.incorrect[intCurrentId].content;
				audioFileName	=	YesNoMultipleData.data.incorrect[intCurrentId].audio;	
				//$(this).addClass("yes_selected");
				$(this).addClass("yes_incorrect");
			}else{
				feedbackStr=YesNoMultipleData.data.correct[intCurrentId].content;
				audioFileName	=	YesNoMultipleData.data.correct[intCurrentId].audio;
				//$(this).addClass("no_selected");
				$(this).addClass("no_correct");
			}	
		}
		YesNoMultiple.YesNoAudioPlaying = true;
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		YesNoMultiple.displayFeedback(feedbackStr);
		$(".clk_option").addClass("disabled");
		$(".clk_option_joint").addClass("disabled");
		//$(".clk_option_joint").unbind("click");
	}
}
YesNoMultiple.displayFeedback	=	function(feedbackStr){
	$("#fb_content").html(feedbackStr);
	$("#fb_content").animate({ scrollTop: 0 }, 10);
	$("#feedback").css('display','block');
	YesNoMultiple.clickVisitedArr[YesNoMultiple.currentId-1]=1;
	trace(YesNoMultiple.clickVisitedArr);
	if(YesNoMultipleData.data.clickable_items[YesNoMultiple.currentId-1].markVisit=="init"){			
		YesNoMultiple.checkCompletion();
	}
	MainController.initializeTemplateInShell();
}

YesNoMultiple.enableTab	=	function(){
	//uncomment below line of code if want sequencing	
	if(YesNoMultipleData.data.sequencing=="false"||YesNoMultipleData.data.sequencing==false){
			$(".clickItem").removeClass("disabled");
			$("#click_"+YesNoMultiple.currentId).addClass("disabled");
		}else{	
			YesNoMultiple.enableTabInSquence();
	}
	//comment below two line of code if want sequencing	
	//$(".clickItem").removeClass("disabled");
	//$("#click_"+YesNoMultiple.currentId).addClass("disabled");
}

/*
@this function used for sequencing the tab
*/
YesNoMultiple.enableTabInSquence	=	function(){
	for(var i=0;i<YesNoMultipleData.data.clickable_items.length;i++){		
		if(i<YesNoMultiple.currentId-1){
			$("#click_"+(i+1)).removeClass("disabled");
		}
		if(YesNoMultiple.currentId<parseInt(YesNoMultipleData.data.total_clickable)){
			$("#click_"+(YesNoMultiple.currentId+1)).removeClass("disabled");								
		}
	}
}
YesNoMultiple.checkCompletion	=	function(){

	$("#click_"+YesNoMultiple.currentId).find(".inneritem").addClass("visitedtab");
	if(jQuery.inArray(0,YesNoMultiple.clickVisitedArr) <= -1){		
		YesNoMultiple.markPageComplete();
	}
}
YesNoMultiple.markPageComplete	=	function(){
	if(YesNoMultiple.pageCompleted	==	false){
		YesNoMultiple.pageCompleted	=	true;
		eventMgr.dispatchCustomEvent(YesNoMultiple,"templateActivityCompleted","","");
	}
}
