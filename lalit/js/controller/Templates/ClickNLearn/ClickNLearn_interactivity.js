
var ClickNLearn_interactivity = {};
ClickNLearn_interactivity.currentClickId;
ClickNLearn_interactivity.clickVisitedArr = [];
ClickNLearn_interactivity.mainContainer;
ClickNLearn_interactivity.activityInitialized;
ClickNLearn_interactivity.activityCompleted;
ClickNLearn_interactivity.clickArray	=	[];
ClickNLearn_interactivity.listenerAdded	=	false;
var ClickData;
var hintStr;
var helpStr;
var helpStr1;
ClickNLearn_interactivity.initTabs=function(data){	
	ClickNLearn_interactivity.activityInitialized = false;
	ClickData = data;	
	ClickNLearn_interactivity.mainContainer = $("#clickContainer #clickHolder");
	Popup_01.init($("#shellPopupContainer"));
	
	ClickNLearn_interactivity.mainContainer.find("#instructionTxt").html(ClickData.instruction);
	for(var t=0; t<ClickData.clickItems.length; t++){
		var clickMC = ClickNLearn_interactivity.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");			
		var mc = new Clickable_Image(clickMC,t,ClickData.clickItems[t]);	
		ClickNLearn_interactivity.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNLearn_interactivity.tabClicked);		
		ClickNLearn_interactivity.mainContainer.append(mc.holder);		
		ClickNLearn_interactivity.clickVisitedArr.push(0);		
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},50);	
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickNLearn_interactivity.addListeners();
	}
}
ClickNLearn_interactivity.closefeedback=function(){
	$("#feedback").hide();
};
ClickNLearn_interactivity.chkfeedbackClosed = function(){
ClickNLearn_interactivity.displayHint(hintStr);
}
ClickNLearn_interactivity.chkfeedbackClosed1 = function(){
ClickNLearn_interactivity.displayHelp(helpStr);
ClickNLearn_interactivity.displayHelp(helpStr1);


}
ClickNLearn_interactivity.tabClicked=function(evt){	
	if(DeviceHandler.device == StaticLibrary.DESKTOP){
		MainController.onShellResize($(document).height());
	}
	MainController.initializeTemplateInShell();	
	
	var eName = $(evt.currentTarget).attr("id");
	var tabId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
	if(ClickNLearn_interactivity.currentClickId != tabId){
		$(".clickItem").removeClass('current');
		$(this).addClass("current");
		ClickNLearn_interactivity.currentClickId = tabId;
	
		if(tabId==3){
		
			$('#shellPopupContainer .clickIntPopup').addClass("click3Popup");
			Popup_01.showPopup(ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].label,"<div id='feedback'><span id='innerFbHeading' class='innerFbHeading'>Feedback</span><span id='popupClose1' class='clickIntClose1'></span><div id='fb_content'></div><div class='clearboth'></div></div><div class='innerTxt clickTab3'>"+ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].content+"</div><div class='question_main'><div id='question'>"+ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].question+"<div><div id='optYes' class='yes_click clk_option'></div><div id='optNo' class='no_click clk_option'></div><div class='statusinst'>Select the correct answer.</div><div class='clearboth'></div></div></div></div><div id='HintBtn' class='left'><div class='Hintinst'>Click <span class='hintlink'>here</span> for a hint.</div></div><div id='hint_popup' class='hint_popup' style='display: none;'><span id='closeHint' class='clickIntClose2'></span><div id='hintContent' class='inner'></div></div><div id='HelpIcon' class='step_icon'><div class='Helpinst'>Click <span class='iconlink'>here</span> for more information on IAS 37.</div></div><div id='help_popup' class='help_popup'><span id='helpClose' class='clickIntClose1'></span><div id='helpHeader'></div><div id='helpContent'></div><div class='clearboth'></div></div>");
		}else{
				Popup_01.showPopup(ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].label,"<div id='feedback'><span id='innerFbHeading' class='innerFbHeading'>Feedback</span><span id='popupClose1' class='clickIntClose1'></span><div id='fb_content'></div><div class='clearboth'></div></div><div class='innerTxt'>"+ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].content+"</div><div class='question_main'><div id='question'>"+ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].question+"<div><div id='optYes' class='yes_click clk_option'></div><div id='optNo' class='no_click clk_option'></div><div class='statusinst'>Select the correct answer.</div><div class='clearboth'></div></div></div></div><div id='HintBtn' class='left'><div class='Hintinst'>Click <span class='hintlink'>here</span> for a hint.</div></div><div id='hint_popup' class='hint_popup' style='display: none;'><span id='closeHint' class='clickIntClose2'></span><div id='hintContent' class='inner'></div></div><div id='HelpIcon' class='step_icon'><div class='Helpinst'>Click <span class='iconlink'>here</span> for more information on IAS 37.</div></div><div id='help_popup' class='help_popup'><span id='helpClose' class='clickIntClose1'></span><div id='helpHeader'></div><div id='helpContent'></div><div class='clearboth'></div></div>");
				$('#shellPopupContainer .clickIntPopup').removeClass("click3Popup");
		
		}
		
		$(".clk_option").bind('click',ClickNLearn_interactivity.checkAnswer);
		$("#feedback").css('display','none');
		$('.left .hintlink').bind('click',ClickNLearn_interactivity.chkfeedbackClosed);
		$('.step_icon .iconlink').bind('click',ClickNLearn_interactivity.chkfeedbackClosed1);
		$("#popupClose1").bind("click",ClickNLearn_interactivity.closefeedback);
		
		if(ClickNLearn_interactivity.currentClickId!=tabId){
				$(".innerTxt").hide();
				
				$(".clk_option").removeClass("disabled");
				
				$("#optNo").removeClass("no_selected");	
				$("#optYes").removeClass("yes_selected");	
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
		
		if(ClickData.clickItems[tabId-1].audio != undefined && ClickData.clickItems[tabId-1].audio.length > 1){
			AudioController.playInternalAudio(ClickData.clickItems[tabId-1].audio);
		}
		if(ClickData.clickItems[tabId-1].markVisit=="init"){
			ClickNLearn_interactivity.markTabComplete();
			ClickNLearn_interactivity.clickVisitedArr[tabId-1] = 1;
		}		 
	}
}

ClickNLearn_interactivity.markTabComplete=function(){
	$("#click_"+ClickNLearn_interactivity.currentClickId).find("#stateMc").addClass("visited");
	ClickNLearn_interactivity.clickVisitedArr[ClickNLearn_interactivity.currentClickId-1] = 1;
	if(ClickData.isSequencial && ClickNLearn_interactivity.currentClickId < ClickNLearn_interactivity.clickArray.length){
		ClickNLearn_interactivity.clickArray[ClickNLearn_interactivity.currentClickId].addListeners();
	}
	ClickNLearn_interactivity.chkActivityCompletion();
}

ClickNLearn_interactivity.closePopup = function(){
	Popup_01.hidePopup();	
	$(".clickItem").removeClass('current');
	ClickNLearn_interactivity.currentClickId = null;
	AudioController.removeCurrentPageAudio();
}

ClickNLearn_interactivity.chkActivityCompletion = function(){
	trace(ClickNLearn_interactivity.clickVisitedArr)
	//if(ClickNLearn_interactivity.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickNLearn_interactivity.clickVisitedArr) <= -1){
		if(!ClickNLearn_interactivity.activityCompleted){
			ClickNLearn_interactivity.activityCompleted = true;
			//MainController.markCurrentPageComplete();
			//MainController.showNextInstruction();			
			eventMgr.dispatchCustomEvent(ClickNLearn_interactivity,"templateActivityCompleted","","");						
		}		
	}
}
ClickNLearn_interactivity.addListeners = function(){
	if(!ClickNLearn_interactivity.activityInitialized){
		ClickNLearn_interactivity.activityInitialized = true;
		if(ClickData.isSequencial){
			ClickNLearn_interactivity.clickArray[0].addListeners();
			//$(".clk_option").on('click',ClickNLearn_interactivity.checkAnswer);
		}else{
			for(var o=0;o<ClickNLearn_interactivity.clickArray.length;o++){
				ClickNLearn_interactivity.clickArray[o].addListeners();	
				//alert("2");				
			}
			
		}
		eventMgr.addControlEventListener(Popup_01, "popupClosed", ClickNLearn_interactivity.closePopup);
	}
	
}

ClickNLearn_interactivity.checkAnswer	=	function(){	
	if(!$(this).hasClass("disabled")){
		$(".clickItem").addClass("disabled");	
		$(".clk_option").addClass("disabled");
		$(".clk_option").css('cursor','default');		
		var feedbackStr	='';
		var intCurrentId=parseInt(ClickNLearn_interactivity.currentClickId-1);
		if(ClickData.clickItems[intCurrentId].correct_ans=="yes"){
			if($(this).hasClass("yes_click")){
				feedbackStr=ClickData.correct[intCurrentId].content;
				audioFileName	=	ClickData.correct[intCurrentId].audio;
				$(this).addClass("yes_selected");
				$(this).addClass("yes_correct");
				
			}else{
				feedbackStr=ClickData.incorrect[intCurrentId].content;
				audioFileName	=	ClickData.incorrect[intCurrentId].audio;
				$(this).addClass("no_selected");
				$(this).addClass("no_incorrect");
			}
		}else{
			if($(this).hasClass("yes_click")){
				feedbackStr=ClickData.incorrect[intCurrentId].content;
				audioFileName	=	ClickData.incorrect[intCurrentId].audio;	
				$(this).addClass("yes_selected");
				$(this).addClass("yes_incorrect");
			}else{
				feedbackStr=ClickData.correct[intCurrentId].content;
				audioFileName	=	ClickData.correct[intCurrentId].audio;
				$(this).addClass("no_selected");
				$(this).addClass("no_correct");
			}	
		}
		ClickNLearn_interactivity.YesNoAudioPlaying = true;
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		ClickNLearn_interactivity.displayFeedback(feedbackStr);
	}
}
ClickNLearn_interactivity.displayFeedback	=	function(feedbackStr){
	$("#fb_content").html(feedbackStr);
	$("#fb_content").animate({ scrollTop: 0 }, 10);
	$("#feedback").css('display','block');
	ClickNLearn_interactivity.clickVisitedArr[ClickNLearn_interactivity.currentClickId-1]=1;
	trace(ClickNLearn_interactivity.clickVisitedArr);
	if(ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].markVisit=="init"){			
		ClickNLearn_interactivity.markTabComplete();
	}
	MainController.initializeTemplateInShell();
}

ClickNLearn_interactivity.displayHint = function(hintStr){
	$('.step_icon .iconlink').unbind();
	var intCurrentIds=parseInt(ClickNLearn_interactivity.currentClickId-1);
	hintStr=ClickData.hint[intCurrentIds].content;
	$("#hintContent").html(hintStr);
	$("#hintContent").animate({ scrollTop: 0 }, 10);
	$("#hint_popup").css('display','block');
	$(".left .hintlink").css('cursor','default');
	$("#closeHint").bind("click",ClickNLearn_interactivity.closeHintPopup);
	MainController.initializeTemplateInShell();
}
ClickNLearn_interactivity.displayHelp = function(helpStr,helpStr1){		
	$('.step_icon .iconlink').unbind();
	var intCurrentIds=parseInt(ClickNLearn_interactivity.currentClickId-1);
	helpStr=ClickData.help[intCurrentIds].helpheader;
	helpStr1=ClickData.help[intCurrentIds].content;
	$('.step_icon').css('z-index','5');
	$("#helpHeader").html(helpStr);
	$("#helpContent").html(helpStr1);
	$("#helpContent").animate({ scrollTop: 0 }, 10);
	$("#help_popup").css('display','block');
	$("#HelpIcon img").css('cursor','default');
	$("#helpClose").bind("click",ClickNLearn_interactivity.closeHelpPopup);
	MainController.initializeTemplateInShell();
}
ClickNLearn_interactivity.closeHintPopup = function(){
	$('.step_icon .iconlink').bind('click',ClickNLearn_interactivity.chkfeedbackClosed1);
	$("#hint_popup").hide();
	$(".left .hintlink").css('cursor','pointer');
}
ClickNLearn_interactivity.closeHelpPopup = function(){
	$('.step_icon .iconlink').bind('click',ClickNLearn_interactivity.chkfeedbackClosed1);
	$("#help_popup").hide();
	$('.step_icon').css('z-index','3');
	$("#HelpIcon img").css('cursor','pointer');
}

ClickNLearn_interactivity.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickData.clickItems[ClickNLearn_interactivity.currentClickId-1].markVisit=="custom"){
			ClickNLearn_interactivity.markTabComplete();
		}		
	}
}
