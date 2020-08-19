
var TabObj = {};
TabObj.currentTabId=-1;
TabObj.tabVisitedArr = [];
TabObj.currentAttempt = [];
TabObj.maxCharLength = 250;
TabObj.activityInitialized;
var TabData;


TabObj.initTabs=function(data){	
	TabData = data;
	TabObj.activityInitialized = false;

	for(var t=0; t<TabData.tabs.length; t++){
		TabObj.currentAttempt.push(0);
		TabObj.tabVisitedArr.push(0);
		var tabMc = $("#tabContainer").find(".tempTab").clone();
		tabMc.removeClass("tempTab");
		tabMc.find("a").attr("href","#tab_"+(t+1));
		tabMc.find("div").attr("id","tab_act_tick"+(t+1));
		tabMc.attr("id","tab-"+(t+1));
		tabMc.find("a").html(TabData.tabs[t].label);	
		$("#tabContainer #tabHolder").find("ul").append(tabMc);	
	}	
	for(var t=0; t<TabData.tabs.length; t++){
		var panelMc = $("#tabContainer").find(".tempTabPanel").clone();
		panelMc.removeClass("tempTabPanel");
		panelMc.attr("id","tab_"+(t+1));
		panelMc.html(TabData.tabs[t].content);		
		$("#tabContainer #tabHolder").append(panelMc);
	}
	
	$(".tabsHolder").tabs({'active': 0});	
	$( ".tabsHolder" ).tabs("disable");	
	$(".ui-tabs-anchor").css("cursor","default");
	
	//disable default tab
	$('#tab-1').removeClass('ui-tabs-active ui-state-active');	
	$("#tab_1").hide();
	
	var tabWidth = 100/TabData.tabs.length;
	for(var t=1; t<=TabData.tabs.length; t++){			
		$( "#tabHolder ul").find("#tab-"+t).css("width",tabWidth+"%");
	}
	//$("#tabHolder ul li").css("width",tabWidth+"%");	
	
	//initialize Feedback
	Feedback_Overlay.init($("#tabFeedbackBox"), $(".tabsWrap"));	
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	//DataManager.isSliderLocked	= true;
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		TabObj.addListeners();
	}
}

TabObj.clickHandler=function(evt,ui){
	//trace(evt.target.id)
	var eName = String($(this).attr("id"));
	var tabId = parseInt(eName.substr(eName.lastIndexOf("-")+1));
	TabObj.tabClicked(tabId);	
	
	//handle first time tab clicked
	if($("#tabHolder").has("#blockPanel").attr("id") != undefined){			
		if(tabId==1)
			$("#tab_1").show();
		$( "#blockPanel" ).remove();
		$(this).addClass('ui-tabs-active ui-state-active');	
	}
}

TabObj.tabClicked = function(id){
	if(TabObj.currentTabId != id){		
		TabObj.currentTabId = id;
		
		TabObj.enableOptions(false);		
		
		Feedback_Overlay.hideFeedback();
		if(TabData.tabs[id-1].markVisit=="init"){			
			TabObj.markCurrentTabComplete();			
		}		
		TabObj.loadInternalActivity();		 	 
		if(TabData.tabs[id-1].audio != undefined && TabData.tabs[id-1].audio.length > 1){
			AudioController.playInternalAudio(TabData.tabs[id-1].audio);
		}
	}
}

TabObj.loadInternalActivity=function(){
	if(TabData.tabs[TabObj.currentTabId-1].inputData){			
		if(TabObj.currentAttempt[TabObj.currentTabId-1] < TabData.tabs[TabObj.currentTabId-1].maxAttempts){
			TabObj.activityCompleted = false;				
			TabObj.initInternalActivity(TabData.tabs[TabObj.currentTabId-1].inputData)
			TabObj.addListenersToInput(TabData.tabs[TabObj.currentTabId-1].inputData);
		}
	}else{
		TabObj.markCurrentTabComplete();
	}
}

TabObj.addListenersToInput=function(data){
	for(var d=0; d<data.length; d++){
		var obj = $("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1));
		switch(data[d].type){
			case "input":
				obj.keyup(function() {
					SubmitButton.chkSubmitEnable(TabObj.checkAcitivtyPerformed(data));
				});
			break;
			case "dropDown":
				obj.change(function() {
					SubmitButton.chkSubmitEnable(TabObj.checkAcitivtyPerformed(data));
				});
			break;
		}
	}
}

TabObj.initInternalActivity=function(data){	
	Feedback_Overlay.hideFeedback();
	SubmitButton.unbindEvents();
	for(var d=0; d<data.length; d++){
		switch(data[d].type){
			case "input":
				$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).val("");
				if(data[d].correctAnswer.length > TabObj.maxCharLength)
					TabObj.maxCharLength = data[d].correctAnswer.length.length+3;
			break;
			case "dropDown":				
				var str = "";
				for(var i=0; i<data[d].options.length;i++){
					var opt = "<option value='"+data[d].options[i]+"'>"+data[d].options[i]+"</option>";
					str+= opt;
				}
				$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).html(str);
			break;
		}
		$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).hide();
		$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).removeClass("inputCross","inputTick");	
	}	
	SubmitButton.init($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#submitBtn"));
	//TabObj.enableOptions(true);	
}

TabObj.enableOptions=function(flag){

	if(TabData.tabs[TabObj.currentTabId-1].inputData){
		for(var d=0; d<TabData.tabs[TabObj.currentTabId-1].inputData.length; d++){		
			$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop('disabled',!flag);
			//trace(TabData.tabs[TabObj.currentTabId-1].inputData[d].type);
			if(TabData.tabs[TabObj.currentTabId-1].inputData[d].type == 'input')
				$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop('maxlength',TabObj.maxCharLength);			
		}
		//SubmitButton.chkSubmitEnable(flag);
	}
}

TabObj.checkAcitivtyPerformed =function(data){
	var allAttempted = true;
	for(var d=0; d<data.length; d++){
		if(data[d].type == "input"){			
			if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).val().length <= 0){
				allAttempted = false;
				break;
			}
		}
		if(data[d].type == "dropDown"){
			if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop("selectedIndex") == 0){
				allAttempted = false;
				break;
			}
		}
	}
	return allAttempted;
}

TabObj.submitClicked = function(){
	//eventMgr.removeControlEventListener(SubmitButton, "submitClicked", TabObj.submitClicked);
	TabObj.enableOptions(false);	
	TabObj.checkAnswer();
}

TabObj.checkAnswer = function(){
	var dataRef = TabData.tabs[TabObj.currentTabId-1].inputData;
	var correctCounter = 0;
	
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			case "input":
				if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).val().toLowerCase() == dataRef[d].correctAnswer.toLowerCase()){
					correctCounter++;
				}
			break;
			case "dropDown":				
				if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop("selectedIndex") == dataRef[d].correctAnswer){
					correctCounter++;
				}				
			break;
		}
	}	
	if(correctCounter >= dataRef.length){
		TabObj.showFeedback(true);
	}else{
		TabObj.showFeedback(false);
	}
}

TabObj.showFeedback=function(result){	
	TabObj.currentAttempt[TabObj.currentTabId-1]++;			
	//trace(result + " - "+TabObj.currentAttempt[TabObj.currentTabId-1]+ ' - '+TabData.tabs[TabObj.currentTabId-1].maxAttempts)
	if(result){		
		TabObj.currentAttempt[TabObj.currentTabId-1] = TabData.tabs[TabObj.currentTabId-1].maxAttempts;
		Feedback_Overlay.showFeedback(TabData.tabs[TabObj.currentTabId-1].feedback.correct.content);
		TabObj.markCurrentTabComplete();
	}
	else if(TabObj.currentAttempt[TabObj.currentTabId-1] < TabData.tabs[TabObj.currentTabId-1].maxAttempts){
		Feedback_Overlay.showFeedback(TabData.tabs[TabObj.currentTabId-1].feedback.incorrect.content);
	}else{
		//TabObj.showSoluton();
		//TabObj.markCurrentTabComplete();
		Feedback_Overlay.showFeedback(TabData.tabs[TabObj.currentTabId-1].feedback.solution.content);
	}
	TabObj.showTickCross();
};

TabObj.showSoluton = function(){
	var dataRef = TabData.tabs[TabObj.currentTabId-1].inputData;
	for(var d=0; d< dataRef.length; d++){
		switch(dataRef[d].type){
			case "input":
				$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).val(dataRef[d].correctAnswer);				
			break;
			case "dropDown":				
				$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop("selectedIndex",dataRef[d].correctAnswer) 			
			break;
		}
		$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).hide();
	}
}

TabObj.showTickCross=function(){
	var dataRef = TabData.tabs[TabObj.currentTabId-1].inputData;
	for(var d=0; d< dataRef.length; d++){
		//trace($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)))
		switch(dataRef[d].type){
			case "input":
				if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).val().toLowerCase() == dataRef[d].correctAnswer.toLowerCase()){
					$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).addClass("inputTick");
				}else{
					$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).addClass("inputCross");
				}
			break;
			case "dropDown":								
				if($("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#input_"+(d+1)).prop("selectedIndex").toString() == dataRef[d].correctAnswer){
					$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).addClass("inputTick");
				}else{
					$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).addClass("inputCross");
				}				
			break;
		}
		$("#tabHolder").find("#tab_"+TabObj.currentTabId).find("#tick_"+(d+1)).show();
	}	
}

TabObj.markCurrentTabComplete = function(){
	TabObj.activityCompleted = true;
	TabObj.tabVisitedArr[TabObj.currentTabId-1] = 1;	
	$("#tab_act_tick"+TabObj.currentTabId).addClass("cnl_v2_tickShow");
	TabObj.chkActivityCompletion();
}


TabObj.closeFeedback=function(){	
	if(TabObj.activityCompleted)
		return;	
	if(TabObj.currentAttempt[TabObj.currentTabId-1] < TabData.tabs[TabObj.currentTabId-1].maxAttempts){
		TabObj.initInternalActivity(TabData.tabs[TabObj.currentTabId-1].inputData);
		TabObj.enableOptions(true);
	}else{
		TabObj.showSoluton();
		TabObj.markCurrentTabComplete();
	}
};

TabObj.chkActivityCompletion = function(){
	trace(TabObj.tabVisitedArr)
	//if(TabObj.tabVisitedArr.indexOf(0) <= -1){
	if(jQuery.inArray(0,TabObj.tabVisitedArr) <= -1){
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();
		eventMgr.dispatchCustomEvent(TabObj,"templateActivityCompleted","","");		
	}
}

TabObj.addListeners	= function(){
	if(!TabObj.activityInitialized){
		TabObj.activityInitialized = true;
		$(".tabsHolder" ).tabs("enable");	
		$("#tabHolder ul li").on( "click",TabObj.clickHandler);
		$(".ui-tabs-anchor").css("cursor","pointer");
		eventMgr.addControlEventListener(Feedback_Overlay, "feedbackClosed", TabObj.closeFeedback);
		eventMgr.addControlEventListener(SubmitButton, "submitClicked", TabObj.submitClicked);
		//TabObj.enableOptions(true);
		InputFocusController.initialize();
	}	
}

TabObj.pageAudioHandler=function(currTime,totTime){	
	if(currTime >= totTime){				
		TabObj.enableOptions(true);
	}
}