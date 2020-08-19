
var ClickRowDifferentText = {};
ClickRowDifferentText.currentClickId;
ClickRowDifferentText.clickVisitedArr = [];
ClickRowDifferentText.mainContainer;
ClickRowDifferentText.activityInitialized;
ClickRowDifferentText.activityCompleted;
ClickRowDifferentText.clickArray	=	[];
ClickRowDifferentText.listenerAdded	=	false;
var ClickRowDifferentTextData;

ClickRowDifferentText.initTabs=function(data){	
	ClickRowDifferentText.activityInitialized = false;
	ClickRowDifferentTextData = data.data;

	
	ClickRowDifferentText.mainContainer = $("#rowActivityContainer");
	
	
	ClickRowDifferentText.mainContainer.find("#instructionTxt").html(ClickRowDifferentTextData.instruction);
	
	if(ClickRowDifferentTextData.scenarioText==''){
		ClickRowDifferentText.mainContainer.find("#senarioText").hide();
	}else{	
		ClickRowDifferentText.mainContainer.find("#senarioText").html(ClickRowDifferentTextData.scenarioText);
	}
	
	for(var t=0; t<ClickRowDifferentTextData.row_count; t++){
		var ClickRowDifferentTextMC = ClickRowDifferentText.mainContainer.find(".tempRow").clone();
		ClickRowDifferentTextMC.removeClass("tempRow").addClass("rowDisabled");			
		ClickRowDifferentTextMC.attr("id","row_"+t);
		ClickRowDifferentTextMC.find(".optMark").attr("id",'optMark_'+t);
		ClickRowDifferentTextMC.find(".optText").attr("id",'optText_'+t);
		ClickRowDifferentTextMC.find(".optText").html(ClickRowDifferentTextData.row[t].text[0].txt);
		ClickRowDifferentTextMC.find(".optText_part2").attr("id",'optText_part2_'+t);
		ClickRowDifferentTextMC.find(".optText_part2").html(ClickRowDifferentTextData.row[t].text[1].txt);
		ClickRowDifferentText.clickArray.push(ClickRowDifferentTextMC);
		ClickRowDifferentText.mainContainer.find("#sectionHolder").append(ClickRowDifferentTextMC);		
		ClickRowDifferentText.clickVisitedArr.push(0);		
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},50);	
	ClickRowDifferentText.mainContainer.find(".rowFB").hide();
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickRowDifferentText.addListeners();
	}
}

ClickRowDifferentText.rowClicked=function(evt){	

	if(!$(this).hasClass("rowDisabled")){
		var eName = $(evt.currentTarget).attr("id");	
		$("#"+eName).addClass("rowvisitedCount");
		var tabId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
		if(ClickRowDifferentText.currentClickId != tabId){
			$(".row").removeClass('current');
			$(this).addClass("current");
			ClickRowDifferentText.currentClickId = tabId;
			var feedbackstr =ClickRowDifferentTextData.feedback[ClickRowDifferentText.currentClickId].fb;
			ClickRowDifferentText.mainContainer.find("#rowFeedback").html(feedbackstr);
			ClickRowDifferentText.mainContainer.find("#fbHeading").html(ClickRowDifferentTextData.feedback[ClickRowDifferentText.currentClickId].fb_head);
			
			if(ClickRowDifferentTextData.feedback[tabId].audio != undefined && ClickRowDifferentTextData.feedback[tabId].audio.length > 1){
				AudioController.playInternalAudio(ClickRowDifferentTextData.feedback[tabId].audio);
			}
			if(ClickRowDifferentTextData.row[tabId].markVisit=="init"){
				ClickRowDifferentText.markTabComplete();
				//ClickRowDifferentText.clickVisitedArr[tabId-1] = 1;
			}		 
		}
		
		
		ClickRowDifferentText.mainContainer.find(".rowFB").show();
		eventMgr.dispatchCustomEvent(ClickRowDifferentText,"templateRowClicked","","");			
	}
	

		
}

ClickRowDifferentText.markTabComplete=function(){
	$("#row_"+ClickRowDifferentText.currentClickId).addClass("rowvisited");
	ClickRowDifferentText.clickVisitedArr[ClickRowDifferentText.currentClickId] = 1;
	
	if((ClickRowDifferentTextData.isSequencial=="true"|| ClickRowDifferentTextData.isSequencial==true) && ((parseInt(ClickRowDifferentText.currentClickId)+1) < ClickRowDifferentText.clickArray.length)){
		trace(ClickRowDifferentText.currentClickId +"  "+ClickRowDifferentText.clickArray.length)
		
		trace(ClickRowDifferentText.clickArray[parseInt(ClickRowDifferentText.currentClickId)+1])
		ClickRowDifferentText.clickArray[parseInt(ClickRowDifferentText.currentClickId)+1].removeClass("rowDisabled").addClass("rowEnabled");
		ClickRowDifferentText.clickArray[parseInt(ClickRowDifferentText.currentClickId)+1].removeClass("rowDisabled");
	}
	ClickRowDifferentText.chkActivityCompletion();
}

ClickRowDifferentText.closePopup = function(){
	Popup_01.hidePopup();	
	$(".clickItem").removeClass('current');
	ClickRowDifferentText.currentClickId = null;
	AudioController.removeCurrentPageAudio();
}

ClickRowDifferentText.chkActivityCompletion = function(){
	trace(ClickRowDifferentText.clickVisitedArr)

	//if(ClickRowDifferentText.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickRowDifferentText.clickVisitedArr) <= -1){
		if(!ClickRowDifferentText.activityCompleted){
			ClickRowDifferentText.activityCompleted = true;
		
			eventMgr.dispatchCustomEvent(ClickRowDifferentText,"templateActivityCompleted","","");						
		}		
	}
}

ClickRowDifferentText.addListeners = function(){
	if(!ClickRowDifferentText.activityInitialized){
		ClickRowDifferentText.activityInitialized = true;
		if(ClickRowDifferentTextData.isSequencial=="true" ||ClickRowDifferentTextData.isSequencial==true){
			ClickRowDifferentText.clickArray[0].removeClass("rowDisabled").addClass("rowEnabled");
		}else{
			
			for(var o=0;o<ClickRowDifferentText.clickArray.length;o++){
				ClickRowDifferentText.clickArray[o].removeClass("rowDisabled").addClass("rowEnabled");	
			}
		}
		$(".row").bind('click',ClickRowDifferentText.rowClicked)
	}
	
}

ClickRowDifferentText.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickRowDifferentTextData.clickItems[ClickRowDifferentText.currentClickId-1].markVisit=="custom"){
			ClickRowDifferentText.markTabComplete();
		}		
	}
}
