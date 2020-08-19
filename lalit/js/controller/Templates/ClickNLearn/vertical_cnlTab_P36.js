var vertical_cnlTab = {};
vertical_cnlTab.currentTabId;
vertical_cnlTab.tabVisitedArr = [];
vertical_cnlTab.activityInitialized;
var vertical_cnlTab_Data;


vertical_cnlTab.initTabs=function(data){	
	vertical_cnlTab_Data = data;
	
	trace("hoziontal alignment:: "+vertical_cnlTab_Data.data.align_vertical);
	vertical_cnlTab.activityInitialized = false;	
	$( "#cnl_v2_Holder" ).tabs({'active': 0});
	$("#cnl_v2_Holder" ).tabs("disable");	
	
	if(vertical_cnlTab_Data.data.align_vertical==true){
		$( "#cnl_v2_Holder" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
		$( "#cnl_v2_Holder li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	}
	/* $( "#cnl_v2_Holder ul li" ).on( "click",vertical_cnlTab.cnl_v2_Clicked) */
	vertical_cnlTab.currentTabId = 1;
	for(var t=0; t<vertical_cnlTab_Data.data.cnl_v2_Items.length; t++){
		vertical_cnlTab.tabVisitedArr.push(0);
		$($( "#cnl_v2_Holder ul li")[t]).find("a").html(vertical_cnlTab_Data.data.cnl_v2_Items[t].label);
		$($( "#cnl_v2_Holder ul li")[t]).attr("id","tab-"+(t+1));
	}
	$( "#cnl_v2_Container").html(vertical_cnlTab_Data.data.cnl_v2_Items[0].content);
	
	//set first tab visited
	if(vertical_cnlTab_Data.data.cnl_v2_Items[0].markVisit=="init"){
		vertical_cnlTab.tabVisitedArr[0] = 1;
	}
	$(".ui-tabs-anchor").css("cursor","default");
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
			
	},60);
	
	/* //if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){		
		vertical_cnlTab.addListeners();	
	} */
}

vertical_cnlTab.cnl_v2_Clicked=function(evt,ui){
	
	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-")+1));
	
	/* var currentWidgetref = DataManager.TOCData[currentPageLocationIndex].widgetId[tabId - 1];
	widgetController.updatawidget(currentWidgetref); */	
	
	if(vertical_cnlTab.currentTabId != tabId){
		vertical_cnlTab.currentTabId = tabId;
		if(vertical_cnlTab_Data.data.cnl_v2_Items[tabId-1].markVisit=="init"){
			vertical_cnlTab.tabVisitedArr[tabId-1] = 1;
			$($( "#cnl_v2_Holder ul li")[tabId-1]).addClass("visitedTab");
			var numLength = $(".visitedTab").length; 
			if(numLength==1){
			
				vertical_cnlTab.chkActivityCompletion();
			}
			
			//trace(vertical_cnlTab_Data.data.cnl_v2_Items[tabId-1].content);
			$( "#cnl_v2_Container").html(vertical_cnlTab_Data.data.cnl_v2_Items[tabId-1].content);
			$($( "#cnl_v2_Holder ul li")[tabId-1]).find("div").addClass("cnl_v2_tickShow");
		}else{
			//logic for marking tab complete on custom (audio/activity)
		}		 
	}	
}

vertical_cnlTab.chkActivityCompletion = function(){
	
	//if(vertical_cnlTab.tabVisitedArr.indexOf(0) <= -1){
	//if(jQuery.inArray(0,vertical_cnlTab.tabVisitedArr) <= -1){
		
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();		
		eventMgr.dispatchCustomEvent(vertical_cnlTab,"templateActivityCompleted","","");
//}
}

vertical_cnlTab.addListeners	=	function(){
	if(!vertical_cnlTab.activityInitialized){
		vertical_cnlTab.activityInitialized = true;
		$("#cnl_v2_Holder" ).tabs("enable");	
		$(".ui-tabs-anchor").css("cursor","pointer");
		$( "#cnl_v2_Holder ul li" ).on( "click",vertical_cnlTab.cnl_v2_Clicked);
		InputFocusController.initialize();
	}	
}


vertical_cnlTab.pageAudioHandler = function(currTime,totTime){
	if(currTime >= totTime){				
		vertical_cnlTab.addListeners();	
	}
}