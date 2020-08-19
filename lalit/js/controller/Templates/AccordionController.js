var AccordionData;
var AccordionObj = {};
AccordionObj.currentTabId
AccordionObj.tabVisitedArr = [];
AccordionObj.activityInitialized = false;
AccordionObj.isSequential
AccordionObj.tabToEnable
AccordionObj.spliceIndex
AccordionObj.disableArr = [];
AccordionObj.activityCompleted = false;

AccordionObj.initAccordion = function(data) {
	AccordionData = data;

	if (MainController.getCurrentPageCompletionStatus() == 1) {
		AccordionData.isSequential = "false";
	}

	for (var t = 0; t < AccordionData.contents.length; t++) {
		$('#contentHolder' + (t + 1)).html(AccordionData.contents[t]);
	}

	var $tempItem = $('#tempItem');
	for (var t = 0; t < AccordionData.accordionItems.length; t++) {
		var item = AccordionData.accordionItems[t];
		var itemObj = $tempItem.clone();

		itemObj.attr('id', 'accordion_item_' + (t + 1));
		itemObj.find('#tempTerm').attr('id', 'term_' + (t + 1)).find('span').html(item.term);
		itemObj.find('#tempContent').attr('id', 'content_' + (t + 1)).html(item.content);

		$('#accordionContainer').append(itemObj);
		
		AccordionObj.tabVisitedArr[t] = 0;
	}

	$tempItem.remove();

	AccordionObj.addListeners();

	//initialise FOF content popup
	if (AccordionData.fof) {
		Fof.initFOF(AccordionData.fof);
		$('#fof_button_holder').show();
		$('#fof_note').show();
	} else {
		$('#fof_button_holder').hide();
		$('#fof_note').hide();
	}

	//initialise Detail content popup
	if (AccordionData.detail) {
		Detail.initDetail(AccordionData.detail);
		$('#details_button_area').show();
	} else {
		$('#details_button_area').hide();
	}

	MainController.initializeTemplateInShell();
}

AccordionObj.tabClicked = function(evt, ui) {
	$(".txtSection").animate({
		scrollTop : 0
	}, 10);

	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-") + 1));

	if (AccordionData.tabs[tabId - 1].isDisable == 'true')
		return;

	if (AccordionData.isSequential == "true") {
		if (tabId - 1 > AccordionObj.tabToEnable)
			return;
	}

	//handle first time tab clicked
	if ($("#tabHolder").has("#blockPanel").attr("id") != undefined) {
		if (tabId == 1)
			$("#tab_1").show();
		$("#blockPanel").remove();
		$(this).addClass('ui-tabs-active ui-state-active');
	}

	if (AccordionObj.currentTabId != tabId) {
		AccordionObj.currentTabId = tabId;
		if (AccordionData.tabs[tabId - 1].audio != undefined && AccordionData.tabs[tabId - 1].audio.length > 1) {

			AudioController.playInternalAudio(AccordionData.tabs[tabId - 1].audio);
		}

		if (AccordionData.tabs[tabId - 1].markVisit == "init") {
			AccordionObj.markTabComplete();
		}

		/*event is dispacted on click of tab*/
		eventMgr.dispatchCustomEvent(AccordionObj, "templateTabClicked");
		/*end*/
	}
	//evt.preventDefaults();
}
AccordionObj.checkTabVisitStatus = function() {
	trace("AccordionObj.checkTabVisitStatus>>>> AccordionObj.tabVisitedArr::: " + AccordionObj.tabVisitedArr);
	for (var i = 0; i < AccordionObj.tabVisitedArr.length; i++) {
		if (AccordionObj.tabVisitedArr[i] == 1) {
			$("#tab_tick" + (i + 1)).show();
		}
	}
}

AccordionObj.markTabComplete = function() {
	trace("tab marked complete- " + AccordionObj.currentTabId);
	$("#tab-" + AccordionObj.currentTabId).find("a").addClass('tab-visited');
	if (AccordionObj.tabVisitedArr[AccordionObj.currentTabId - 1] == 0) {
		AccordionObj.tabVisitedArr[AccordionObj.currentTabId - 1] = 1;
		if (AccordionData.isSequential == "true")
			AccordionObj.enableNextTab();
	}
	AccordionObj.chkActivityCompletion();
	AccordionObj.checkTabVisitStatus();
}

AccordionObj.chkActivityCompletion = function() {

	if (jQuery.inArray(0, AccordionObj.tabVisitedArr) <= -1) {
		eventMgr.dispatchCustomEvent(AccordionObj, "templateActivityCompleted");
		AccordionObj.activityCompleted = true;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();
	}
}

AccordionObj.enableNextTab = function() {
	AccordionObj.tabToEnable++;
	if (AccordionObj.tabToEnable >= AccordionData.tabs.length)
		return;

	if (AccordionData.tabs[AccordionObj.tabToEnable].isDisable == "true") {
		AccordionObj.tabToEnable++;
		AccordionObj.spliceIndex++;
	}

	AccordionObj.disableArr.splice(AccordionObj.spliceIndex, 1);
	trace(AccordionObj.disableArr);
	$(".tabsHolder").tabs("option", "disabled", AccordionObj.disableArr);
}

AccordionObj.itemClicked = function(evt) {
	var item = $(evt.target);

	var idNum = item.parent().attr('id').split('_')[1];
	var content = $('#content_' + idNum);
	
	content.slideToggle(200, function() {
		if (content.is(':visible')) {
			item.attr('src', 'course_01/images/collapse.png');
		} else {
			item.attr('src', 'course_01/images/expand.png');
		}
	});
	
	AccordionObj.tabVisitedArr[idNum-1] = 1;
	AccordionObj.chkActivityCompletion(); 
}

AccordionObj.addListeners = function() {
	if (!AccordionObj.activityInitialized) {
		$('.accordion-term img').on('click', AccordionObj.itemClicked);

		AccordionObj.activityInitialized = true;

	}
}

AccordionObj.pageAudioHandler = function(currTime, totTime) {
	//trace(currTime +"  -  "+ totTime);
	if (currTime >= totTime) {
		AccordionObj.markTabComplete();
	}
}