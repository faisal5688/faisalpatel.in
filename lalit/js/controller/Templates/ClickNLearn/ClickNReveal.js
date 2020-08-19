
var ClickNReveal = {};
ClickNReveal.currentClickId;
ClickNReveal.clickVisitedArr = [];
ClickNReveal.mainContainer;
ClickNReveal.activityInitialized;
ClickNReveal.activityCompleted=false;
ClickNReveal.clickArray	=	[];
ClickNReveal.listenerAdded	=	false;
ClickNReveal.showOverlay = false;
var ClickData;
var mc;

ClickNReveal.initTabs=function(data){	
	ClickNReveal.activityInitialized = false;
	ClickData = data;	
	ClickNReveal.mainContainer = $("#clickContainer #clickHolder");
	ClickNReveal.firstContainer = $("#clickContainer #popupContainer_main #firstContainer");
	Popup_01.init($("#popupContainer"));
	
	ClickNReveal.mainContainer.find("#instructionTxt").html(ClickData.instruction);
	ClickNReveal.firstContainer.find("#firstContentHolder").html(ClickData.firstContent);
	
	for(var t=0; t<ClickData.clickItems.length; t++){
		var clickMC = ClickNReveal.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");			
		mc = new Clickable_Image(clickMC,t,ClickData.clickItems[t]);	
		ClickNReveal.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNReveal.tabClicked);
		ClickNReveal.mainContainer.append(mc.holder);		
		ClickNReveal.clickVisitedArr.push(0);
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickNReveal.addListeners();
	}
}

ClickNReveal.tabClicked=function(evt){	
	var eName = $(evt.currentTarget).attr("id");
	//trace(eName);
	
	var clickId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
	if(ClickNReveal.currentClickId != clickId){
		ClickNReveal.currentClickId = clickId;
		
		$(".clickItem").removeClass('current');
		
		$("#click_"+ClickNReveal.currentClickId).addClass('current');
		Popup_01.showPopup(ClickData.clickItems[ClickNReveal.currentClickId-1].label,"<div class='innerTxt'>"+ClickData.clickItems[ClickNReveal.currentClickId-1].content+"</div>");
		if(ClickNReveal.showOverlay){
			$("#internalPopupOverlay").show();
		}
		if(ClickData.clickItems[clickId-1].audio != undefined && ClickData.clickItems[clickId-1].audio.length > 1){
			AudioController.playInternalAudio(ClickData.clickItems[clickId-1].audio);
		}
		if(ClickData.clickItems[clickId-1].markVisit=="init"){
			ClickNReveal.markTabComplete();
			
		}		
	}
		
}

ClickNReveal.markTabComplete=function(){
	$("#click_"+ClickNReveal.currentClickId).find("#stateMc").addClass("visited");
	ClickNReveal.clickVisitedArr[ClickNReveal.currentClickId-1] = 1;
	if(ClickData.isSequencial && ClickNReveal.currentClickId < ClickNReveal.clickArray.length){
		ClickNReveal.clickArray[ClickNReveal.currentClickId].addListeners();
	}
	ClickNReveal.chkActivityCompletion();
	
}

ClickNReveal.closePopup = function(){
	//Popup_01.hidePopup();	
	ClickNReveal.currentClickId = null;
	AudioController.removeCurrentPageAudio();
	$(".clickItem").removeClass('current');
	if(ClickNReveal.showOverlay){
		$("#internalPopupOverlay").hide();
	}
	if(ClickNReveal.activityCompleted){
		eventMgr.dispatchCustomEvent(ClickNReveal,"popupClosed","","");
	}
}

ClickNReveal.chkActivityCompletion = function(){
	trace(ClickNReveal.clickVisitedArr)
	//if(ClickNReveal.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickNReveal.clickVisitedArr) <= -1){
		if(!ClickNReveal.activityCompleted){
			ClickNReveal.activityCompleted = true;
				eventMgr.dispatchCustomEvent(ClickNReveal,"templateActivityCompleted","","");
		}		
	}
}
ClickNReveal.addListeners = function(){
	if(!ClickNReveal.activityInitialized){
		ClickNReveal.activityInitialized = true;
		if(ClickData.isSequencial){
			ClickNReveal.clickArray[0].addListeners();
		}else{
			for(var o=0;o<ClickNReveal.clickArray.length;o++){
				ClickNReveal.clickArray[o].addListeners();		
			}
		}
		eventMgr.addControlEventListener(Popup_01, "popupClosed", ClickNReveal.closePopup);
	}
	
}

ClickNReveal.removeListeners = function(){
	for(var o=0;o<ClickNReveal.clickArray.length;o++){
		ClickNReveal.clickArray[o].removeListeners();		
	}
}

ClickNReveal.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickData.clickItems[ClickNReveal.currentClickId-1].markVisit=="custom"){
			ClickNReveal.markTabComplete();
		}		
	}
}