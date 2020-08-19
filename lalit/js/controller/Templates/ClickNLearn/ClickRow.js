
var ClickRow = {};
ClickRow.currentClickId;
ClickRow.clickVisitedArr = [];
ClickRow.mainContainer;
ClickRow.activityInitialized;
ClickRow.activityCompleted;
ClickRow.clickArray	=	[];
ClickRow.listenerAdded	=	false;
var ClickRowData;

ClickRow.initTabs=function(data){	
	ClickRow.activityInitialized = false;
	ClickRowData = data.data;

	
	ClickRow.mainContainer = $("#rowActivityContainer");
	
	
	ClickRow.mainContainer.find("#instructionTxt").html(ClickRowData.instruction);
	
	if(ClickRowData.scenarioText==''){
		ClickRow.mainContainer.find("#senarioText").hide();
	}else{	
		ClickRow.mainContainer.find("#senarioText").html(ClickRowData.scenarioText);
	}
	
	for(var t=0; t<ClickRowData.row_count; t++){
		var clickRowMC = ClickRow.mainContainer.find(".tempRow").clone();
		clickRowMC.removeClass("tempRow").addClass("rowDisabled");			
		clickRowMC.attr("id","row_"+t);
		clickRowMC.find(".optMark").attr("id",'optMark_'+t);
		clickRowMC.find(".optText").attr("id",'optText_'+t);
		clickRowMC.find(".optText").html(ClickRowData.row[t].text);
		ClickRow.clickArray.push(clickRowMC);
		ClickRow.mainContainer.find("#sectionHolder").append(clickRowMC);		
		ClickRow.clickVisitedArr.push(0);		
	}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},50);	
	ClickRow.mainContainer.find(".rowFB").hide();
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		ClickRow.addListeners();
	}
}

ClickRow.rowClicked=function(evt){	

	if(!$(this).hasClass("rowDisabled")){
		var eName = $(evt.currentTarget).attr("id");	
		var tabId = parseInt(eName.substr(eName.lastIndexOf("_")+1));		
		if(ClickRow.currentClickId != tabId){
			$(".row").removeClass('current');
			$(this).addClass("current");
			ClickRow.currentClickId = tabId;
			var feedbackstr =ClickRowData.feedback[ClickRow.currentClickId].fb;
			ClickRow.mainContainer.find("#rowFeedback").html(feedbackstr);
			
			if(ClickRowData.feedback[tabId].audio != undefined && ClickRowData.feedback[tabId].audio.length > 1){
				AudioController.playInternalAudio(ClickRowData.feedback[tabId].audio);
			}
			if(ClickRowData.row[tabId].markVisit=="init"){
				ClickRow.markTabComplete();
				//ClickRow.clickVisitedArr[tabId-1] = 1;
			}		 
		}
		
		
		ClickRow.mainContainer.find(".rowFB").show();
		eventMgr.dispatchCustomEvent(ClickRow,"templateRowClicked","","");			
	}
	

		
}

ClickRow.markTabComplete=function(){
	$("#row_"+ClickRow.currentClickId).addClass("rowvisited");
	ClickRow.clickVisitedArr[ClickRow.currentClickId] = 1;
	
	if((ClickRowData.isSequencial=="true"|| ClickRowData.isSequencial==true) && ((parseInt(ClickRow.currentClickId)+1) < ClickRow.clickArray.length)){
		trace(ClickRow.currentClickId +"  "+ClickRow.clickArray.length)
		
		trace(ClickRow.clickArray[parseInt(ClickRow.currentClickId)+1])
		ClickRow.clickArray[parseInt(ClickRow.currentClickId)+1].removeClass("rowDisabled").addClass("rowEnabled");
		ClickRow.clickArray[parseInt(ClickRow.currentClickId)+1].removeClass("rowDisabled");
	}
	ClickRow.chkActivityCompletion();
}

ClickRow.closePopup = function(){
	Popup_01.hidePopup();	
	$(".clickItem").removeClass('current');
	ClickRow.currentClickId = null;
	AudioController.removeCurrentPageAudio();
}

ClickRow.chkActivityCompletion = function(){
	trace(ClickRow.clickVisitedArr)

	//if(ClickRow.clickVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,ClickRow.clickVisitedArr) <= -1){
		if(!ClickRow.activityCompleted){
			ClickRow.activityCompleted = true;
		
			eventMgr.dispatchCustomEvent(ClickRow,"templateActivityCompleted","","");						
		}		
	}
}

ClickRow.addListeners = function(){
	if(!ClickRow.activityInitialized){
		ClickRow.activityInitialized = true;
		if(ClickRowData.isSequencial=="true" ||ClickRowData.isSequencial==true){
			ClickRow.clickArray[0].removeClass("rowDisabled").addClass("rowEnabled");
		}else{
			
			for(var o=0;o<ClickRow.clickArray.length;o++){
				ClickRow.clickArray[o].removeClass("rowDisabled").addClass("rowEnabled");	
			}
		}
		$(".row").bind('click',ClickRow.rowClicked)
	}
	
}

ClickRow.pageAudioHandler = function(currTime,totTime){	
	trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){						
		if(ClickRowData.clickItems[ClickRow.currentClickId-1].markVisit=="custom"){
			ClickRow.markTabComplete();
		}		
	}
}
