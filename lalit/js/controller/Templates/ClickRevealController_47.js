var ClickRevealData;
var ClickRevealObj = {};
ClickRevealObj.currentTabId
ClickRevealObj.tabVisitedArr = [];
ClickRevealObj.activityInitialized = false;
ClickRevealObj.isSequential
ClickRevealObj.tabToEnable
ClickRevealObj.spliceIndex
ClickRevealObj.disableArr = [];
ClickRevealObj.activityCompleted = false;
var FoFClicked = true;

ClickRevealObj.initClickReveal = function(data) {
	ClickRevealData = data;

	if (MainController.getCurrentPageCompletionStatus() == 1) {
		ClickRevealData.isSequential = "false";
	}

	$('.accordion-content').hide();

	for (var t = 0; t < ClickRevealData.contents.length; t++) {
		$('#contentHolder' + (t + 1)).html(ClickRevealData.contents[t]);
	}
		
	for (var t = 1; t <= ClickRevealData.tabs.length; t++) {
		var tab = ClickRevealData.tabs[t-1];
		//$('#term_'+t).html(tab.term);
		$('#content_'+t).html(tab.content);	
		$('#content_'+t).prepend("<p><b>"+tab.term+"</b></p>");
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
	MainController.initializeTemplateInShell();
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
		$('.accordion-content').hide();
		$('#content_' + idNum).fadeIn();
		
		$('.accordion-term').removeClass('item-selected');
		$(this).addClass('item-visted');
		$('#term_' + idNum).addClass('item-selected');
		
		ClickRevealObj.tabVisitedArr[idNum-1] = 1;
		
		ClickRevealObj.chkActivityCompletion () ;	
	}
}

ClickRevealObj.addListeners = function() {
	if (!ClickRevealObj.activityInitialized) {
		$('.accordion-term').on('click', ClickRevealObj.itemClicked);
		ClickRevealObj.activityInitialized = true;
	}
}

ClickRevealObj.pageAudioHandler = function(currTime, totTime) {
	//trace(currTime +"  -  "+ totTime);
	if (currTime >= totTime) {
		ClickRevealObj.markTabComplete();
	}
}