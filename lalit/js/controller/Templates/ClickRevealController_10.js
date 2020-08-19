var ClickRevealData;
var ClickRevealObj = {};
ClickRevealObj.currentTabId
ClickRevealObj.tabVisitedArr = [];
ClickRevealObj.innertabVisitedArr = [];
ClickRevealObj.activityInitialized = false;
ClickRevealObj.isSequential
ClickRevealObj.tabToEnable
ClickRevealObj.spliceIndex
ClickRevealObj.disableArr = [];
ClickRevealObj.activityCompleted = false;
var FoFClicked = true;

ClickRevealObj.initClickReveal = function(data) {
$(".innercontent").hide();
	ClickRevealData = data;
ClickRevealObj.currentTabId = -1;
	if (MainController.getCurrentPageCompletionStatus() == 1) {
		ClickRevealData.isSequential = "false";
	}

	$('.accordion-content').hide();

	for (var t = 0; t < ClickRevealData.contents.length; t++) {
		$('#contentHolder' + (t + 1)).html(ClickRevealData.contents[t]);
	}
		
	for (var t = 1; t <= ClickRevealData.tabs.length; t++) {
		var tab = ClickRevealData.tabs[t-1];
		$('#term_'+t).html(tab.term);
		$('#content_'+t).html(tab.content);	
		
		ClickRevealObj.tabVisitedArr.push(0);	
	}
	
	ClickRevealObj.addListeners();

	//initialise FOF content popup
	if (ClickRevealData.fof) {
		Fof.initFOF(ClickRevealData.fof);
		$('#fof_button_holder').show();
		$('#fof_note').show();
	} else {
		$('#fof_button_holder').hide();
		$('#fof_note').hide();
	}

	//initialise Detail content popup
	if (ClickRevealData.detail) {
		Detail.initDetail(ClickRevealData.detail);
		$('#details_button_area').show();
	} else {
		$('#details_button_area').hide();
	}
	$("#sectionHolder").prepend("<div class='page_title'></div>");
	$('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);
	NavigatorController.addEventsForDetailLink();
	MainController.initializeTemplateInShell();
	$("#descriptionContainer").hide();
	$('#fof_button').on('click', function(evt) {
		FoFClicked = true;
		//m01_p38_01.markPageComplete();
		if(ClickRevealObj.activityCompleted){
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
		}
	});
}

ClickRevealObj.tabClicked = function(evt, ui) {
	$(".txtSection").animate({
		scrollTop : 0
	}, 10);

	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-") + 1));

	if (ClickRevealData.tabs[tabId - 1].isDisable == 'true')
		return;

	if (ClickRevealData.isSequential == "true") {
		if (tabId - 1 > ClickRevealObj.tabToEnable)
			return;
	}

	//handle first time tab clicked
	if ($("#tabHolder").has("#blockPanel").attr("id") != undefined) {
		if (tabId == 1)
			$("#tab_1").show();
		$("#blockPanel").remove();
		$(this).addClass('ui-tabs-active ui-state-active');
	}

	if (ClickRevealObj.currentTabId != tabId) {
		ClickRevealObj.currentTabId = tabId;
		if (ClickRevealData.tabs[tabId - 1].audio != undefined && ClickRevealData.tabs[tabId - 1].audio.length > 1) {

			AudioController.playInternalAudio(ClickRevealData.tabs[tabId - 1].audio);
		}

		if (ClickRevealData.tabs[tabId - 1].markVisit == "init") {
			ClickRevealObj.markTabComplete();
		}

		/*event is dispacted on click of tab*/
		eventMgr.dispatchCustomEvent(ClickRevealObj, "templateTabClicked");
		/*end*/
	}
	//evt.preventDefaults();
}
ClickRevealObj.checkTabVisitStatus = function() {
	
	for (var i = 0; i < ClickRevealObj.tabVisitedArr.length; i++) {
		if (ClickRevealObj.tabVisitedArr[i] == 1) {
			$("#tab_tick" + (i + 1)).show();
		}
	}
}

ClickRevealObj.markTabComplete = function() {
	trace("tab marked complete- " + ClickRevealObj.currentTabId);
	$("#tab-" + ClickRevealObj.currentTabId).find("a").addClass('tab-visited');
	if(ClickRevealObj.currentTabId-1 == 0 && jQuery.inArray(0,ClickRevealObj.innertabVisitedArr) != -1) return;	
	if (ClickRevealObj.tabVisitedArr[ClickRevealObj.currentTabId - 1] == 0) {
		ClickRevealObj.tabVisitedArr[ClickRevealObj.currentTabId - 1] = 1;
		if (ClickRevealData.isSequential == "true")
			ClickRevealObj.enableNextTab();
	}
	ClickRevealObj.chkActivityCompletion();
	ClickRevealObj.checkTabVisitStatus();
}

ClickRevealObj.chkActivityCompletion = function() {

	if (jQuery.inArray(0, ClickRevealObj.tabVisitedArr) <= -1) {
		eventMgr.dispatchCustomEvent(ClickRevealObj, "templateActivityCompleted");
		ClickRevealObj.activityCompleted = true;
		if(FoFClicked){
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
		}
		$("#fof_button_holder").addClass("highlight");
	}
}

ClickRevealObj.enableNextTab = function() {
	ClickRevealObj.tabToEnable++;
	if (ClickRevealObj.tabToEnable >= ClickRevealData.tabs.length)
		return;

	if (ClickRevealData.tabs[ClickRevealObj.tabToEnable].isDisable == "true") {
		ClickRevealObj.tabToEnable++;
		ClickRevealObj.spliceIndex++;
	}

	ClickRevealObj.disableArr.splice(ClickRevealObj.spliceIndex, 1);
	trace(ClickRevealObj.disableArr);
	$(".tabsHolder").tabs("option", "disabled", ClickRevealObj.disableArr);
}

ClickRevealObj.itemClicked = function(evt) {
	if(!$(this).hasClass('item-selected')){
	var item = $(evt.target);
	var idNum = item.attr('id').split('_')[1];
	$('.accordion-content,.innertabcontent').hide();
	$('#content_' + idNum).fadeIn();
	$("#descriptionContainer").fadeIn();
	$("#descriptionContainer .close").off('click').on('click', function(){
		$('.accordion-term').removeClass('item-selected');
		$("#descriptionContainer, .tab4Popup").hide();
		$(".innertab").removeClass('selected');
	});
	$('.accordion-term').removeClass('item-selected');
	$('#term_' + idNum).addClass('item-selected');
	
	ClickRevealObj.currentTabId = idNum;
	
ClickRevealObj.markTabComplete();	
}
}

ClickRevealObj.markTabComplete=function(){
if(ClickRevealObj.currentTabId == 4 && jQuery.inArray(0,ClickRevealObj.innertabVisitedArr) != -1) return;	
$('#term_' + ClickRevealObj.currentTabId).addClass('item-visited');
	ClickRevealObj.tabVisitedArr[ClickRevealObj.currentTabId-1] = 1;
	ClickRevealObj.chkActivityCompletion () ;	
	
}

ClickRevealObj.addListeners = function() {
	if (!ClickRevealObj.activityInitialized) {
		$('.accordion-term').on('click', ClickRevealObj.itemClicked);
		ClickRevealObj.activityInitialized = true;
	}
	
	/* $(".innertab").addClass('disabled');
	$("#innertab_1").removeClass('disabled'); */
	ClickRevealObj.innertabVisitedArr=[];
	for(var t=0; t<$(".innertab").length; t++){			
		ClickRevealObj.innertabVisitedArr.push(0);			
		if(ClickRevealObj.isSequential == "false"){
			$(".innertab").removeClass('disabled');
		}
	}
	$(".tab4Popup .closeIcon ").click(function(){
		$(".innertab").removeClass('selected');
		$(".tab4Popup").fadeOut();
	});
	$(".innertab").click(function(){
		if(!$(this).hasClass('disabled')){
			$(".innertab").removeClass('selected');
			$(this).addClass('selected');
			var targetId = parseInt($(this).attr('id').split('_')[1]);
			ClickRevealObj.innertabVisitedArr[targetId-1] = 1;
			$(".tab4Popup .pText p").html($(".innertabcontent_" + targetId).html());
			$(".tab4Popup").fadeIn();
			$("#innertab_"+(targetId+1)).removeClass('disabled');
			$("#innertab_"+targetId).addClass('visited');
			ClickRevealObj.markTabComplete();
			
		}
	});
	
	
}

ClickRevealObj.pageAudioHandler = function(currTime, totTime) {
	//trace(currTime +"  -  "+ totTime);
	if (currTime >= totTime) {
		//ClickRevealObj.markTabComplete();
	}
}