var DNDClassification = {};
DNDClassification.questionData = {};
DNDClassification.currentAttempt = 0;
DNDClassification.activityIntialized = false;
DNDClassification.activityCompleted = false;

DNDClassification.initialize = function(data){
	DataManager.isSliderLocked	= true;
	DNDClassification.questionData = data;
	DNDClassification.mainContainer = $("#dndContainer");
	DNDClassification.mainContainer.find("#instructionTxt").html("<span>"+DNDClassification.questionData.instruction+"</span>")
	
	DNDClassification.activityIntialized = false;
	DNDClassification.activityCompleted = false;
	
	//DNDClassification.enableSubmit(false);
	SubmitButton.init($("#dndContainer").find("#submitBtn"));
	//SubmitButton.init($(".innerContent").find("#submitBtn"));
	eventMgr.addControlEventListener(SubmitButton, "submitClicked", DNDClassification.submitClicked);
	
	DNDClassification.createDraggables();
	DNDClassification.createTragets();
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
}

DNDClassification.createDraggables = function(){
	for(var d=0; d<DNDClassification.questionData.draggableItems.items.length; d++){
		//trace(DNDClassification.questionData.draggableItems.items[d]);
		var dragItem = DNDClassification.mainContainer.find(".tempDragOption").clone();
		dragItem.removeClass("tempDragOption");
		dragItem.find("img").attr("src",DNDClassification.questionData.draggableItems.items[d].image);
		dragItem.find("#dragContent").html("<span>"+DNDClassification.questionData.draggableItems.items[d].content+"</span>");
		dragItem.attr("id","drag_"+(d+1));
		dragItem.attr("correctTarget",DNDClassification.questionData.draggableItems.items[d].target);
		dragItem.attr("dropTarget","none");
		/*$(dragItem).draggable({	
				containment: $("#dndContainer"),					
				start: DNDClassification.dragStart,
				stop: DNDClassification.dragStop,				
				revert:DNDClassification.dragRevert 
		});*/				
		DNDClassification.mainContainer.find("#dragHolder").append(dragItem);
	}
	$(".tempDragOption").hide();
	/*$(".dropWrap").droppable({
		drop:DNDClassification.onDrop
	});*/
	
	//added after audio completion
	//DNDClassification.addListeners();
}

DNDClassification.createTragets=function(){
	var count=-1;
	DNDClassification.mainContainer.find(".dropWrap").each(function(){
		count++;
		$(this).attr("totalPlaced",0);
		$(this).attr("maxDrop",DNDClassification.questionData.droppableItems.items[count].maxDrop);		
	});
}

DNDClassification.addListeners= function(){
	if(!DNDClassification.activityIntialized){
		DNDClassification.activityIntialized = true;
		for(var d=0; d<DNDClassification.questionData.draggableItems.items.length; d++){		
			var dragItem = DNDClassification.mainContainer.find("#dragHolder").find("#drag_"+(d+1));
			$(dragItem).draggable({	
				containment: $(".innerContent"),					
				start: DNDClassification.dragStart,
				stop: DNDClassification.dragStop,				
				revert:DNDClassification.dragRevert 
			});						
		}
		$(".dropWrap").droppable({
			drop:DNDClassification.onDrop
		});
	}
}

DNDClassification.dragStart = function (dropped, ui)
{										
	if($(this).hasClass("disabled"))
		return false;					
		$(this).css("z-index", "20");
	
		//already placed on droppable
	/*if($(this).attr("dropTarget")!="none"){
		var myDropTarget = DNDClassification.mainContainer.find("#dropHolder"+$(this).attr("dropTarget"));
		var placed = myDropTarget.attr("totalPlaced");
		myDropTarget.attr("totalPlaced",--placed);		
	}*/
				
}
DNDClassification.dragStop = function (dropped, ui)
{	
	$(this).css("z-index", "0");					
}

DNDClassification.dragRevert = function (dropped, ui){	
	trace("dragRevert")
	if(dropped){		
		trace(dropped.attr("totalPlaced") +" - "+dropped.attr("maxDrop"))
		if(dropped.attr("totalPlaced") > dropped.attr("maxDrop")){
			var num = dropped.attr("totalPlaced");
			dropped.attr("totalPlaced",num-1);
			$(this).data("uiDraggable").originalPosition = {
	            top : 0,
	            left : 0
	        };
	        return true;
		}			
		
		//if dropped at proper draggable object
		var dropId = dropped.attr("id").substr(String(dropped.attr("id")).length-1,1);
							
			//if object already placed at same target - snapback
		if($(this).attr("dropTarget") == dropId){			
			$(this).data("uiDraggable").originalPosition = {
	            top : 0,
	            left : 0
	        };
	        return true;
		}else{
				//if draggable placed first time, add disable class to its main reference
			if($(this).attr("dropTarget") == "none")
				$(this).addClass("disabled");
				
			$(this).attr("dropTarget",dropId);
		}		
	}else{
		//if dropped outiside
		$(this).data("uiDraggable").originalPosition = {
            top : 0,
            left : 0
        };
		return true;
	}	
					
}

DNDClassification.onDrop = function (event, ui){
	trace("onDrop");
	if($(ui.draggable).attr("dropTarget")!=undefined){
	
	var dropId = $(this).attr("id").substr(String($(this).attr("id")).length-1,1);	

	if($(ui.draggable).attr("dropTarget") == dropId)
		return;
	
	var pl = $(this).attr("totalPlaced");
	if(pl < $(this).attr("maxDrop")){
		if($(ui.draggable).attr("dropTarget") != "none"){		
			var myDropTarget = DNDClassification.mainContainer.find("#dropHolder"+$(ui.draggable).attr("dropTarget"));
			var placed = myDropTarget.attr("totalPlaced")-1;
			myDropTarget.attr("totalPlaced",placed);
		}
		
		$(ui.draggable).css("top","0px");
		$(ui.draggable).css("left","0px");
		$(ui.draggable).css("z-index",2);
		//alert($(".dragWrap").children("#"+$(ui.draggable).attr("id")).attr("id"));	
		setTimeout(function(){
		
			$(".dragWrap").children("#"+$(ui.draggable).attr("id")).addClass("opacity");
			$(".dropWrap").children("#"+$(ui.draggable).attr("id")).removeClass("opacity");
		},100)

/* 		alert($(ui.draggable).attr("id"))
		$(ui.draggable).css("opacity",.3);	
		$(ui.draggable).css(" -ms-filter","progid:DXImageTransform.Microsoft.Alpha(Opacity=50)");			 */
		if($(ui.draggable).attr("dropTarget") != "none"){
			
			$(this).append($(ui.draggable));
		}else{
			var temp = $(ui.draggable).clone();		
			temp.attr("dropTarget",dropId);
			
			$(temp).draggable({	
					containment: $("#dndContainer"),					
					start: DNDClassification.dragStart,
					stop: DNDClassification.dragStop,				
					revert:DNDClassification.dragRevert 
			});	
			$(this).append(temp);
		}						
		pl++;
		$(this).attr("totalPlaced",pl);	
		DNDClassification.checkAllPlaced();			
	}else{
		pl++;
		$(this).attr("totalPlaced",pl);
	}
	}else{
		return;
	}
}

DNDClassification.checkAllPlaced = function(){
	if(DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").length == DNDClassification.questionData.draggableItems.items.length){
		$("#submitBtn").css('cursor',"pointer");
		SubmitButton.chkSubmitEnable(true);
	}
}

DNDClassification.submitClicked=function(){
	DNDClassification.disableOptions();
	$("#submitBtn").css('cursor',"default");
	var correctCounter=0; 
	DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function(){
		//trace($(this).attr("correctTarget") +"  =  "+ $(this).attr("dropTarget"))
		if($(this).attr("correctTarget") == $(this).attr("dropTarget")) 
			correctCounter++;
	});
	if(correctCounter == DNDClassification.questionData.draggableItems.items.length){
		DNDClassification.showFeedback(true);
		DataManager.isSliderLocked	= false;
	}else{
		DNDClassification.showFeedback(false);
	}
}

DNDClassification.showFeedback=function(flag){
	DNDClassification.currentAttempt++;	
	if(DNDClassification.questionData.responseType=="generic"){
		var feedObj = DNDClassification.mainContainer.find("#dndFeedbackBox").find(".tempFeedback").clone();
		feedObj.removeClass("tempFeedback");
		if(flag){			
			feedObj.find("#imgHolder img").attr("src",DNDClassification.questionData.genericResponse.correct.image);
			feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.correct.content);
			if(DNDClassification.questionData.genericResponse.correct.header)
				feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.correct.header);
			DNDClassification.showTickOnly();
		}
		else if(DNDClassification.currentAttempt < DNDClassification.questionData.maxAttempts){
			feedObj.find("#imgHolder img").attr("src",DNDClassification.questionData.genericResponse.incorrect.image);
			feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.incorrect.content);
			if(DNDClassification.questionData.genericResponse.incorrect.header)
				feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.incorrect.header);
		}else{
			feedObj.find("#imgHolder img").attr("src",DNDClassification.questionData.genericResponse.solution.image);
			feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.solution.content);
			if(DNDClassification.questionData.genericResponse.solution.header)
			feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.solution.header);
			DNDClassification.showSolution();
		}
		DNDClassification.mainContainer.find("#dndFeedbackContent").append(feedObj);
	}else{		
		for(var f=0; f<DNDClassification.questionData.draggableItems.items.length; f++){
			var feedObj = DNDClassification.mainContainer.find("#dndFeedbackBox").find(".tempFeedback").clone();
			feedObj.removeClass("tempFeedback");			
			feedObj.find("#imgHolder img").attr("src",DNDClassification.questionData.specificResponse.response[f].image);
			feedObj.find("#contentHolder #content").html(DNDClassification.questionData.specificResponse.response[f].content);			
			feedObj.find("#contentHolder #label").html(DNDClassification.questionData.specificResponse.response[f].header);
			DNDClassification.mainContainer.find("#dndFeedbackContent").append(feedObj);
		}		
		if(flag){
			DNDClassification.showTickOnly();
		}else{
			if(DNDClassification.currentAttempt >= DNDClassification.questionData.maxAttempts)
				DNDClassification.showSolution();
				eventMgr.dispatchCustomEvent(DNDClassification,"templateActivityCompleted");
		}
	}
	$("#dndFeedbackBox").show();
	
	//closing feedback and resetting options
	//$("#dndFeedbackBox").find("#feedbackClose").on("click",DNDClassification.closeFeedback);
	//DNDClassification.resetOptions();
}

DNDClassification.resetOptions=function(){
	DNDClassification.mainContainer.find("#dragHolder").find(".dragItem").each(function(){
		if($(this).hasClass("disabled")){
			$(this).removeClass("disabled")
			$(this).attr("dropTarget","none")
		}
	});
	for(var c=1; c<=DNDClassification.questionData.droppableItems.items.length; c++){
		var dropTarget = DNDClassification.mainContainer.find("#dropHolder"+c);		
		dropTarget.attr("totalPlaced",0);
	}
	DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function(){
		$(this).remove();
	});
	DataManager.isSliderLocked	= true;
}

DNDClassification.showTickOnly=function(){
	DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function(){
		$(this).addClass("correct");
	});
	DNDClassification.markPageComplete();
}

DNDClassification.showSolution=function(){
	DataManager.isSliderLocked	= false;
	DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function(){
		if($(this).attr("correctTarget") == $(this).attr("dropTarget"))
			$(this).addClass("correct");
		else
			$(this).addClass("incorrect");
	});
	DNDClassification.markPageComplete();

}

DNDClassification.markPageComplete = function(){
	if(!DNDClassification.activityCompleted){
		DNDClassification.activityCompleted = true;
		//MainController.markCurrentPageComplete();
		//MainController.showNextInstruction();
		eventMgr.dispatchCustomEvent(DNDClassification,"templateActivityCompleted","","");
	}
}

DNDClassification.disableOptions=function(){
	DNDClassification.mainContainer.find("#dragHolder").find(".dragItem").each(function(){
		if(!$(this).hasClass("disabled")){
			$(this).addClass("disabled")			
		}
	});
	DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function(){
		$(this).addClass("disabled")
	});
}

/* DNDClassification.pageAudioHandler=function(currTime,totTime){	
	//trace(currTime +" "+totTime);
	if(currTime >= totTime){				
		DNDClassification.addListeners();	
	}
} */