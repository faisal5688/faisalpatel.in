
var ClickNLearn = {};
ClickNLearn.currentClickId;
ClickNLearn.clickVisitedArr = [];
ClickNLearn.mainContainer;
ClickNLearn.activityInitialized;
ClickNLearn.activityCompleted;
ClickNLearn.clickArray	=	[];
ClickNLearn.listenerAdded	=	false;
var ClickData;

ClickNLearn.initTabs=function(data){	
	ClickNLearn.activityInitialized = false;
	ClickData = data;	
	ClickNLearn.mainContainer = $("#clickContainer #clickHolder");
	Popup_01.init($("#shellPopupContainer"));
	
	ClickNLearn.mainContainer.find("#instructionTxt").html(ClickData.instruction);
	for(var t=0; t<ClickData.clickItems.length; t++){
		var clickMC = ClickNLearn.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");			
		var mc = new Clickable_Image(clickMC,t,ClickData.clickItems[t]);	
		ClickNLearn.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNLearn.tabClicked);		
		ClickNLearn.mainContainer.append(mc.holder);		
		ClickNLearn.clickVisitedArr.push(0);		
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},50);	
	
	//if page already visited earlier
	/* if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickNLearn.addListeners();
	} */
}

ClickNLearn.tabClicked=function(evt){	
	var eName = $(evt.currentTarget).attr("id");
	//trace(eName);
	var tabId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
	if(ClickNLearn.currentClickId != tabId){
		$(".clickItem").removeClass('current');
		$(this).addClass("current");
		ClickNLearn.currentClickId = tabId;
		Popup_01.showPopup(ClickData.clickItems[ClickNLearn.currentClickId-1].label,"<div class='innerTxt'>"+ClickData.clickItems[ClickNLearn.currentClickId-1].content+"</div>");
		if(ClickData.clickItems[tabId-1].audio != undefined && ClickData.clickItems[tabId-1].audio.length > 1){
			AudioController.playInternalAudio(ClickData.clickItems[tabId-1].audio);
		}
		if(ClickData.clickItems[tabId-1].markVisit=="init"){
			ClickNLearn.markTabComplete();
			//ClickNLearn.clickVisitedArr[tabId-1] = 1;
		}		 
	}
		
}

ClickNLearn.markTabComplete=function(){
	$("#click_"+ClickNLearn.currentClickId).find("#stateMc").addClass("visited");
	ClickNLearn.clickVisitedArr[ClickNLearn.currentClickId-1] = 1;
	if(ClickData.isSequencial && ClickNLearn.currentClickId < ClickNLearn.clickArray.length){
		ClickNLearn.clickArray[ClickNLearn.currentClickId].addListeners();
	}
	ClickNLearn.chkActivityCompletion();
}

ClickNLearn.closePopup = function(){
	Popup_01.hidePopup();	
	$(".clickItem").removeClass('current');
	ClickNLearn.currentClickId = null;
	AudioController.removeCurrentPageAudio();
}

ClickNLearn.chkActivityCompletion = function(){
	trace(ClickNLearn.clickVisitedArr)
	//if(ClickNLearn.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickNLearn.clickVisitedArr) <= -1){
		if(!ClickNLearn.activityCompleted){
			ClickNLearn.activityCompleted = true;
			//MainController.markCurrentPageComplete();
			//MainController.showNextInstruction();			
			eventMgr.dispatchCustomEvent(ClickNLearn,"templateActivityCompleted","","");						
		}		
	}
}
ClickNLearn.addListeners = function(){
	if(!ClickNLearn.activityInitialized){
		ClickNLearn.activityInitialized = true;
		if(ClickData.isSequencial){
			ClickNLearn.clickArray[0].addListeners();
		}else{
			for(var o=0;o<ClickNLearn.clickArray.length;o++){
				ClickNLearn.clickArray[o].addListeners();		
			}
		}
		eventMgr.addControlEventListener(Popup_01, "popupClosed", ClickNLearn.closePopup);
	}
	
}

ClickNLearn.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickData.clickItems[ClickNLearn.currentClickId-1].markVisit=="custom"){
			ClickNLearn.markTabComplete();
		}		
	}
}
