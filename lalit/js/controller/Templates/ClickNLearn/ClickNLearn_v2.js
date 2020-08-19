
var clickInteractivity_2 = {};
clickInteractivity_2.currentTabId;
clickInteractivity_2.tabVisitedArr = [];
clickInteractivity_2.activityInitialized;
var cnl_v2_Data;


clickInteractivity_2.initTabs=function(data){	
	cnl_v2_Data = data;
	clickInteractivity_2.activityInitialized = false;	
	$( "#cnl_v2_Holder" ).tabs({'active': 0});
	$("#cnl_v2_Holder" ).tabs("disable");	
	/* $( "#cnl_v2_Holder ul li" ).on( "click",clickInteractivity_2.cnl_v2_Clicked) */
	clickInteractivity_2.currentTabId = 1;
	for(var t=0; t<cnl_v2_Data.data.cnl_v2_Items.length; t++){
		clickInteractivity_2.tabVisitedArr.push(0);
		$($( "#cnl_v2_Holder ul li")[t]).find("a").html(cnl_v2_Data.data.cnl_v2_Items[t].label);
		$($( "#cnl_v2_Holder ul li")[t]).attr("id","tab-"+(t+1));
	}
	$( "#cnl_v2_Container").html(cnl_v2_Data.data.cnl_v2_Items[0].content);
	
	//set first tab visited
	if(cnl_v2_Data.data.cnl_v2_Items[0].markVisit=="init"){
		clickInteractivity_2.tabVisitedArr[0] = 1;
	}
	$(".ui-tabs-anchor").css("cursor","default");
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
			
	},60);
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){		
		clickInteractivity_2.addListeners();	
	}
}

clickInteractivity_2.cnl_v2_Clicked=function(evt,ui){
	
	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-")+1));
	
	var currentGAApref = DataManager.TOCData[currentPageLocationIndex].gaapId[tabId - 1];
	GaapController.updataGaap(currentGAApref);	
	
	if(clickInteractivity_2.currentTabId != tabId){
		clickInteractivity_2.currentTabId = tabId;
		if(cnl_v2_Data.data.cnl_v2_Items[tabId-1].markVisit=="init"){
			clickInteractivity_2.tabVisitedArr[tabId-1] = 1;
			clickInteractivity_2.chkActivityCompletion();
			//trace(cnl_v2_Data.data.cnl_v2_Items[tabId-1].content);
			$( "#cnl_v2_Container").html(cnl_v2_Data.data.cnl_v2_Items[tabId-1].content);
			$($( "#cnl_v2_Holder ul li")[tabId-1]).find("div").addClass("cnl_v2_tickShow");
		}else{
			//logic for marking tab complete on custom (audio/activity)
		}		 
	}	
}

clickInteractivity_2.chkActivityCompletion = function(){
	trace(clickInteractivity_2.tabVisitedArr)
	//if(clickInteractivity_2.tabVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,clickInteractivity_2.tabVisitedArr) <= -1){
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();		
		eventMgr.dispatchCustomEvent(ClickNLearn,"templateActivityCompleted","","");
	}
}

clickInteractivity_2.addListeners	=	function(){
	if(!clickInteractivity_2.activityInitialized){
		clickInteractivity_2.activityInitialized = true;
		$("#cnl_v2_Holder" ).tabs("enable");	
		$(".ui-tabs-anchor").css("cursor","pointer");
		$( "#cnl_v2_Holder ul li" ).on( "click",clickInteractivity_2.cnl_v2_Clicked);
		InputFocusController.initialize();
	}	
}

clickInteractivity_2.pageAudioHandler=function(currTime,totTime){
	if(currTime >= totTime){				
		clickInteractivity_2.addListeners();	
	}
}