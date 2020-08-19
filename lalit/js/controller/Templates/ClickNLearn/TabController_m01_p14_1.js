var TabData;
var TabObj_v1 = {};
TabObj_v1.currentTabId;
TabObj_v1.tabVisitedArr = [];
TabObj_v1.innertabVisitedArr = [];
TabObj_v1.activityInitialized;
TabObj_v1.isSequential;
TabObj_v1.tabToEnable;
TabObj_v1.spliceIndex;
TabObj_v1.disableArr = [];
TabObj_v1.activityCompleted = false;

TabObj_v1.initTabs=function(data){
	TabObj_v1.activityInitialized = false;	
	TabData = data;
	TabObj_v1.tabToEnable = -1;
	TabObj_v1.spliceIndex = 0;
	TabObj_v1.currentTabId = -1;
	
	if(MainController.getCurrentPageCompletionStatus() == 1){		
		TabData.isSequential="false";
	}
	
	for(var t=0; t<TabData.tabs.length; t++){
		if(TabData.tabs[t].isDisable == "true"){
			TabObj_v1.tabVisitedArr.push(1);
		}
		else{
			TabObj_v1.tabVisitedArr.push(0);
		}
					
	if(TabData.isSequential=="true" || TabData.tabs[t].isDisable=="true")
		TabObj_v1.disableArr.push(t);
			
		var tabMc = $("#tabContainer").find(".tempTab").clone();
		tabMc.removeClass("tempTab");
		tabMc.find("a").attr("href","#tab_"+(t+1));
		tabMc.attr("id","tab-"+(t+1));
		tabMc.find("a").html(TabData.tabs[t].label);	
		tabMc.find("a").append('<div id="tab_tick'+(t+1)+'" class="tab_tick"></div>');
		tabMc.find("div").hide();
		$("#tabContainer #tabHolder").find("ul").append(tabMc);	
	}
	
	for(var t=0; t<TabData.tabs.length; t++){
		var panelMc = $("#tabContainer").find(".tempTabPanel").clone();
		panelMc.removeClass("tempTabPanel");
		panelMc.attr("id","tab_"+(t+1));
		panelMc.html(TabData.tabs[t].content);		
		//$("#tabContainer #tabHolder").append(panelMc);
		$("#tabContainer #panelContainer").append(panelMc);		
	}
	
	$( ".tabsHolder" ).tabs({'active': 0});	
	$( ".tabsHolder" ).tabs("option","disabled",TabObj_v1.disableArr);
	$( ".tabsHolder" ).tabs("disable");
	
	if(TabData.align_vertical=="true"){		
		$( ".tabsHolder" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
		$( ".tabsHolder li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	}
	
	//disable default tab
	$('#tab-1').removeClass('ui-tabs-active ui-state-active');	
	$("#tab_1").hide();
	
	var tabWidth = 100/TabData.tabs.length;
	for(var t=1; t<=TabData.tabs.length; t++){			
		$( "#tabHolder ul").find("#tab-"+t).css("width",tabWidth+"%");
	}
	//$("#tabHolder ul li").css("width",tabWidth+"%");
	setTimeout(function(){
		MainController.initializeTemplateInShell();			
	},60);	
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		TabObj_v1.addListeners();		
	} 
	$( "#tabHolder ul").find("a").attr("href", "javascript:;");
	
	//initialise FOF content popup
	if(TabData.fof){
		Fof.initFOF (TabData.fof);
		$('#fof_button_holder').show();
		$('#fof_note').show();
	}else{
		$('#fof_button_holder').hide();
		$('#fof_note').hide();
	}
	
	//initialise Detail content popup
	if(TabData.detail){
		Detail.initDetail (TabData.detail);
		$('#details_button_area').show();
	}else{
		$('#details_button_area').hide();
	}
	$(".tabsWrap").prepend("<div class='page_title'></div>");
	$('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);
	MainController.initializeTemplateInShell();
}

TabObj_v1.tabClicked=function(evt,ui){	
	$(".txtSection").animate({ scrollTop: 0 }, 10);

	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-")+1));
	
	if(TabData.tabs[tabId-1].isDisable=='true')
		return;
	
	if(TabData.isSequential == "true"){		
		if(tabId-1 > TabObj_v1.tabToEnable)
			return;
	}
	
	//handle first time tab clicked
	if($("#tabHolder").has("#blockPanel").attr("id") != undefined){
		if(tabId==1)
			$("#tab_1").show();
		$( "#blockPanel" ).remove();
		$(this).addClass('ui-tabs-active ui-state-active');	
	}
	
	if(TabObj_v1.currentTabId != tabId){
		TabObj_v1.currentTabId = tabId;
		if(TabData.tabs[tabId-1].audio != undefined && TabData.tabs[tabId-1].audio.length > 1){
			
			AudioController.playInternalAudio(TabData.tabs[tabId-1].audio);
		}
		
		if(TabData.tabs[tabId-1].markVisit=="init"){
			TabObj_v1.markTabComplete();
		}	
		
		/*event is dispacted on click of tab*/	
		eventMgr.dispatchCustomEvent(TabObj_v1,"templateTabClicked");			
		/*end*/		
	}	
	//evt.preventDefaults();
}
TabObj_v1.checkTabVisitStatus=function(){
	trace("TabObj_v1.checkTabVisitStatus>>>> TabObj_v1.tabVisitedArr::: "+TabObj_v1.tabVisitedArr);
	for (var i=0;i<TabObj_v1.tabVisitedArr.length;i++){
		if(TabObj_v1.tabVisitedArr[i] == 1){
			$("#tab_tick"+(i+1)).show();
		}
	}
}

TabObj_v1.markTabComplete=function(){
	trace("tab marked complete- "+TabObj_v1.currentTabId);
	$("#tab-"+TabObj_v1.currentTabId).find("a").addClass('tab-visited');
	if(TabObj_v1.currentTabId-1 == 0 && jQuery.inArray(0,TabObj_v1.innertabVisitedArr) != -1) return;		
	
	if(TabObj_v1.tabVisitedArr[TabObj_v1.currentTabId-1] == 0){
		TabObj_v1.tabVisitedArr[TabObj_v1.currentTabId-1] = 1;
		if(TabData.isSequential == "true")
			TabObj_v1.enableNextTab();
	}
	TabObj_v1.chkActivityCompletion();
		TabObj_v1.checkTabVisitStatus();
}

TabObj_v1.chkActivityCompletion = function(){
	
	if(jQuery.inArray(0,TabObj_v1.tabVisitedArr) <= -1){		
		eventMgr.dispatchCustomEvent(TabObj_v1,"templateActivityCompleted");		
		TabObj_v1.activityCompleted = true;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();
	}
}

TabObj_v1.enableNextTab = function(){
	TabObj_v1.tabToEnable++;
	if(TabObj_v1.tabToEnable >= TabData.tabs.length)
		return;
		
	if(TabData.tabs[TabObj_v1.tabToEnable].isDisable=="true"){
		TabObj_v1.tabToEnable++;
		TabObj_v1.spliceIndex++;
	}
		
	TabObj_v1.disableArr.splice(TabObj_v1.spliceIndex,1);
	trace(TabObj_v1.disableArr);
	$( ".tabsHolder" ).tabs("option","disabled",TabObj_v1.disableArr);
}

TabObj_v1.addListeners	=	function(){
	if(!TabObj_v1.activityInitialized){
		$( ".tabsHolder" ).tabs("enable");
		if(TabData.isSequential == "true")
			TabObj_v1.enableNextTab();
		else
			$( ".tabsHolder" ).tabs("option","disabled",TabObj_v1.disableArr);			
		TabObj_v1.activityInitialized = true;				
		for(var t=1; t<=TabData.tabs.length; t++){			
			$( "#tabHolder ul").find("#tab-"+t).on( "click",TabObj_v1.tabClicked);
		}
		$(".innertab").addClass('disabled');
		$("#innertab_1").removeClass('disabled');
		TabObj_v1.innertabVisitedArr=[];
		for(var t=0; t<$(".innertab").length; t++){			
			TabObj_v1.innertabVisitedArr.push(0);			
			if(TabData.isSequential == "false"){
				$(".innertab").removeClass('disabled');
			}
		}
		$(".innertab").click(function(){
			if(!$(this).hasClass('disabled')){
				var targetId = parseInt($(this).attr('id').split('_')[1]);
				TabObj_v1.innertabVisitedArr[targetId-1] = 1;
				$(".innertabcontent").html($(".innertabcontent_" + targetId).html());
				$("#innertab_"+(targetId+1)).removeClass('disabled');
				TabObj_v1.markTabComplete();
			}
		});
		InputFocusController.initialize();
	}
}


TabObj_v1.pageAudioHandler = function(currTime,totTime){
	//trace(currTime +"  -  "+ totTime);
	if(currTime >= totTime){						
		TabObj_v1.markTabComplete();
	}
}