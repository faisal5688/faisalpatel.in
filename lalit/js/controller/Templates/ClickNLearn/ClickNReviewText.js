
var ClickNReviewText = function(){};
ClickNReviewText.mainContainer;
ClickNReviewText.activityInitialized;
ClickNReviewText.currentId;
ClickNReviewText.clickArray	=	[];
ClickNReviewText.clickVisitedArr	=	[];
ClickNReviewText.pageCompleted	=	false;
ClickNReviewText.type;
var ClickNShowData;
ClickNReviewText.init=function(data){	
	ClickNShowData=data;
	ClickNReviewText.pageCompleted	=	false;
	ClickNReviewText.activityInitialized=false;
	ClickNReviewText.mainContainer=$("#clickHolder");
	ClickNReviewText.mainContainer.find("#instructionTxt").html(ClickNReviewText.instruction);
	ClickNReviewText.type=ClickNShowData.data.type;
	for(var t=0; t<ClickNShowData.data.clickable_items.length; t++){
		var clickMC = ClickNReviewText.mainContainer.find(".tempClick").clone();
		clickMC.removeClass("tempClick");	
	
		var mc = new Clickable_Image(clickMC,t,ClickNShowData.data.clickable_items[t]);	
		
		ClickNReviewText.clickArray.push(mc);		
		eventMgr.addControlEventListener(mc.holder, "tabClicked", ClickNReviewText.tabClicked);	
		ClickNReviewText.mainContainer.find(".tempClick").before(mc.holder);		
		ClickNReviewText.clickVisitedArr.push(0);		
	}
		for(var o=0;o<ClickNReviewText.clickArray.length;o++){
			trace(ClickNReviewText.clickArray[o].id);
			$("#click_"+ClickNReviewText.clickArray[o].id).addClass("click_"+ClickNReviewText.clickArray[o].id);
			
		}
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		$(".tempClick").hide();
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		ClickNReviewText.addListeners();
	} 
}
ClickNReviewText.tabClicked=function(evt){

	if(!$(this).hasClass("disabled")){
		
		AudioController.playInternalAudio("blank");		
		var eName = $(evt.currentTarget).attr("id");
		var clickId = parseInt(eName.substr(eName.lastIndexOf("_")+1));			
		var questionStr	=	ClickNShowData.data.clickable_items[(clickId-1)].question;	
		var questionRefContent=ClickNShowData.data.clickable_items[(clickId-1)].question_ref_Content;

		$(".clickItem").removeClass("disabled");
		$(this).addClass("disabled");
		$("#question").html(questionStr);
		$("#quesRefContent").html(questionRefContent);
		$("#YNResponse").removeClass();
		$("#YNResponse").addClass("i_response response");
		$("#YNResponse").addClass("res_"+clickId);

		
		$("#YNResponse").show();
		if(ClickNReviewText.currentId!=clickId){			
			$(".clk_option").removeClass("disabled");

		}

		ClickNReviewText.currentId=clickId;
		eventMgr.dispatchCustomEvent(ClickNReviewText,"templateTabClicked","","");	
		if(ClickNShowData.data.clickable_items[ClickNReviewText.currentId-1].markVisit=="init"){			
			ClickNReviewText.enableTab();		
		}	
	}
}

ClickNReviewText.addListeners = function(){

	if(!ClickNReviewText.activityInitialized){
		ClickNReviewText.activityInitialized = true;
		for(var o=0;o<ClickNReviewText.clickArray.length;o++){
			ClickNReviewText.clickArray[o].addListeners();		
		}	
	
	
	}	

	$(".clickItem").removeClass("disabled");	
	
}


ClickNReviewText.enableTab	=	function(){

	$("#click_"+ClickNReviewText.currentId).find(".imageZoom").addClass("visitedArrow");

	$(".clickItem").removeClass("disabled");
	$("#click_"+ClickNReviewText.currentId).addClass("disabled");
	
	ClickNReviewText.clickVisitedArr[ClickNReviewText.currentId-1]=1;
	ClickNReviewText.checkCompletion();
}


ClickNReviewText.checkCompletion	=	function(){
	var vistedTab=0
	for(var i=0;i<ClickNReviewText.clickVisitedArr.length;i++){
		if(ClickNReviewText.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}	
	if(vistedTab==parseInt(ClickNShowData.data.total_clickable)){
				ClickNReviewText.markPageComplete();				
	}

}
ClickNReviewText.markPageComplete	=	function(){
	
	if(ClickNReviewText.pageCompleted	==	false){
		ClickNReviewText.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(ClickNReviewText,"templateActivityCompleted","","");	
	
	}

}


/* 
function pageAudioHandler(currTime,totTime){	
	trace(currTime +" - "+totTime)
	trace(DataManager.audioFileName)
	if(currTime >= totTime){		
		//ClickNReviewText.addListeners();
		if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){
			ClickNReviewText.addListeners();
		}else if(DataManager.audioFileName=="blank"){}else{
			
			ClickNReviewText.enableTab();
			ClickNReviewText.removeDisabled();
		}
	}
} */