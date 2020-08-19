
var ClickNLearnNoPopupCloseBtn = {};
ClickNLearnNoPopupCloseBtn.currentClickId;
ClickNLearnNoPopupCloseBtn.clickVisitedArr = [];
ClickNLearnNoPopupCloseBtn.mainContainer;
ClickNLearnNoPopupCloseBtn.activityInitialized;
ClickNLearnNoPopupCloseBtn.activityCompleted;
ClickNLearnNoPopupCloseBtn.clickArray	=	[];
ClickNLearnNoPopupCloseBtn.listenerAdded	=	false;
var ClickData;

ClickNLearnNoPopupCloseBtn.initTabs=function(data){	
	ClickNLearnNoPopupCloseBtn.activityInitialized = false;
	ClickData = data;	
	ClickNLearnNoPopupCloseBtn.mainContainer = $("#clickContainer #clickHolder");
	//Popup_01.init($("#shellPopupContainer"));
	Popup_01.init($("#PageLevelPopupContainerNoCloseBtn"));
	
	ClickNLearnNoPopupCloseBtn.mainContainer.find("#instructionTxt").html(ClickData.instruction);
	for(var t=0; t<ClickData.clickItems.length; t++){
		var clickMC = ClickNLearnNoPopupCloseBtn.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");			
		var mc = new Clickable_Image(clickMC,t,ClickData.clickItems[t]);	
		ClickNLearnNoPopupCloseBtn.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNLearnNoPopupCloseBtn.tabClicked);		
		ClickNLearnNoPopupCloseBtn.mainContainer.append(mc.holder);		
		ClickNLearnNoPopupCloseBtn.clickVisitedArr.push(0);		
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},50);	
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickNLearnNoPopupCloseBtn.addListeners();
	} 
}

ClickNLearnNoPopupCloseBtn.tabClicked=function(evt){	
	var eName = $(evt.currentTarget).attr("id");
	//trace(eName);
	var tabId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
	if(ClickNLearnNoPopupCloseBtn.currentClickId != tabId){
		$(".clickItem").removeClass('current');
		$(this).addClass("current");
		ClickNLearnNoPopupCloseBtn.currentClickId = tabId;
		Popup_01.showPopup(ClickData.clickItems[ClickNLearnNoPopupCloseBtn.currentClickId-1].label,"<div class='innerTxt'>"+ClickData.clickItems[ClickNLearnNoPopupCloseBtn.currentClickId-1].content+"</div>");
		if(ClickData.clickItems[tabId-1].audio != undefined && ClickData.clickItems[tabId-1].audio.length > 1){
			AudioController.playInternalAudio(ClickData.clickItems[tabId-1].audio);
		}
		if(ClickData.clickItems[tabId-1].markVisit=="init"){
			ClickNLearnNoPopupCloseBtn.markTabComplete();
			//ClickNLearnNoPopupCloseBtn.clickVisitedArr[tabId-1] = 1;
		}		 
	}
		
}

ClickNLearnNoPopupCloseBtn.markTabComplete=function(){
	$("#click_"+ClickNLearnNoPopupCloseBtn.currentClickId).find("#stateMc").addClass("visited");
	ClickNLearnNoPopupCloseBtn.clickVisitedArr[ClickNLearnNoPopupCloseBtn.currentClickId-1] = 1;
	if(ClickData.isSequencial && ClickNLearnNoPopupCloseBtn.currentClickId < ClickNLearnNoPopupCloseBtn.clickArray.length){
		ClickNLearnNoPopupCloseBtn.clickArray[ClickNLearnNoPopupCloseBtn.currentClickId].addListeners();
	}
	ClickNLearnNoPopupCloseBtn.chkActivityCompletion();
}

ClickNLearnNoPopupCloseBtn.closePopup = function(){
	Popup_01.hidePopup();	
	$(".clickItem").removeClass('current');
	ClickNLearnNoPopupCloseBtn.currentClickId = null;
	AudioController.removeCurrentPageAudio();
}

ClickNLearnNoPopupCloseBtn.chkActivityCompletion = function(){
	trace(ClickNLearnNoPopupCloseBtn.clickVisitedArr)
	//if(ClickNLearnNoPopupCloseBtn.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickNLearnNoPopupCloseBtn.clickVisitedArr) <= -1){
		if(!ClickNLearnNoPopupCloseBtn.activityCompleted){
			ClickNLearnNoPopupCloseBtn.activityCompleted = true;
			//MainController.markCurrentPageComplete();
			//MainController.showNextInstruction();			
			eventMgr.dispatchCustomEvent(ClickNLearnNoPopupCloseBtn,"templateActivityCompleted","","");						
		}		
	}
}
ClickNLearnNoPopupCloseBtn.addListeners = function(){
	if(!ClickNLearnNoPopupCloseBtn.activityInitialized){
		ClickNLearnNoPopupCloseBtn.activityInitialized = true;
		if(ClickData.isSequencial){
			ClickNLearnNoPopupCloseBtn.clickArray[0].addListeners();
		}else{
			for(var o=0;o<ClickNLearnNoPopupCloseBtn.clickArray.length;o++){
				ClickNLearnNoPopupCloseBtn.clickArray[o].addListeners();		
			}
		}
		eventMgr.addControlEventListener(Popup_01, "popupClosed", ClickNLearnNoPopupCloseBtn.closePopup);
	}
	
}

ClickNLearnNoPopupCloseBtn.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickData.clickItems[ClickNLearnNoPopupCloseBtn.currentClickId-1].markVisit=="custom"){
			ClickNLearnNoPopupCloseBtn.markTabComplete();
		}		
	}
}
