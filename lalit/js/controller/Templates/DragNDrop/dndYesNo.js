var DND_YesNo = function(){};
var DND_YesNoData='';
DND_YesNo.mainContainer;
DND_YesNo.clickVisitedArr=[];
DND_YesNo.currentId=0;
DND_YesNo.activityInitialized=false;
DND_YesNo.pageCompleted	=false;
DND_YesNo.optCounter=0;DND_YesNo.completed=false;
var currentOptId;

DND_YesNo.init=function(data){	
	DND_YesNoData=data;
	
	
	DND_YesNo.mainContainer=$("#DNDContainer");
	DND_YesNo.mainContainer.find("#instructionTxt").html(DND_YesNoData.data.instruction);
	
	var optCount=parseInt(DND_YesNoData.data.clickable_items[0].opt_cout);
	for(var t=0; t<optCount; t++){		
		DND_YesNo.clickVisitedArr.push(0);
	}
	
	
	var str="";
	
	for(var i=0;i<optCount;i++){
		str+="<tr id='tr_"+(i+1)+"'><td>"+DND_YesNoData.data.clickable_items[0].option_detail[i].label+"</td>";
		
			for(var j=0;j<DND_YesNoData.data.clickable_items[0].option_detail[i].option_count;j++){
				str+="<td><div id='opt_"+(i+1)+"_"+(j+1)+"' class='opt_"+(i+1)+"_"+(j+1)+" clk_option icon'><div class='tickbg'></div><div class='label'>"+DND_YesNoData.data.clickable_items[0].option_detail[i].option_content[j].label+"</div></div></td>";
		}	
		
		str+="</tr>";
	}
	$("#YesNoContainer").html(str);
	
	var questionStr	=	DND_YesNoData.data.clickable_items[0].question;
	if(DND_YesNoData.data.clickable_items[0].startDivText==""){
		$("#textContainer").hide();
	}else{
		$("#textContainer").html(DND_YesNoData.data.clickable_items[0].startDivText);
	}
	$("#question").html(questionStr);	
	//eventMgr.addControlEventListener(DND_YesNo.mainContainer, "optionClicked", DND_YesNo.checkAnswer);
		DND_YesNo.mainContainer.find("#feedBack").hide();
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		DND_YesNo.addListeners();
	} else{
		$(".clk_option").css("cursor","default");
	}
}

DND_YesNo.addListeners = function(){
	if(!DND_YesNo.activityInitialized){
		DND_YesNo.activityInitialized = true;		
		$(".clk_option").bind('click',DND_YesNo.checkAnswer);
	}
	$(".clk_option").css("cursor","pointer");
}

DND_YesNo.checkAnswer	=	function(evt){	

	if(!$(this).hasClass("disabled")){
	
		var feedbackStr	='';

		var oName = $(evt.currentTarget).attr("id");
		
		
		currentOptId = parseInt(oName.substr(oName.indexOf("_")+1,1));
	
		if(oName=="opt_10_1" || oName=="opt_10_2"){
			currentOptId = parseInt(oName.substr(oName.indexOf("_")+1,2));
		}
		
		var optId = parseInt(oName.substr(oName.lastIndexOf("_")+1));
	
		var correctOption=parseInt(DND_YesNoData.data.clickable_items[DND_YesNo.currentId].option_detail[(currentOptId-1)].correct_option);
		
		if(DND_YesNoData.data.response=="specific"){
			trace(optId +" == "+ correctOption)
		if(optId == correctOption){
				feedbackStr    = DND_YesNoData.data.quetionOptFeedback[DND_YesNo.currentId].correct[(currentOptId-1)].content;
				audioFileName	=DND_YesNoData.data.quetionOptFeedback[DND_YesNo.currentId].correct[(currentOptId-1)].audio;
				$(this).addClass("correct");
			}else{
				feedbackStr    = DND_YesNoData.data.quetionOptFeedback[DND_YesNo.currentId].incorrect[(currentOptId-1)].content;
				audioFileName	=DND_YesNoData.data.quetionOptFeedback[DND_YesNo.currentId].incorrect[(currentOptId-1)].audio;
				$(this).addClass("incorrect");
			}
		}else{
			feedbackStr=DND_YesNoData.data.generic[DND_YesNo.currentId].content;
			audioFileName	=	DND_YesNoData.data.generic[DND_YesNo.currentId].audio;
			
			if(optId == correctOption){				
				$(this).addClass("correct");
			}else{			
				$(this).addClass("incorrect");
			}
			
		}
		
		trace(feedbackStr)
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		DND_YesNo.displayFeedback(feedbackStr);


		$(".clk_option").addClass("disabled");
		//$("#instructionMain").addClass("feedbackHighlight");
		
		if(DND_YesNoData.data.clickable_items[0].markVisit=="init"){
			DND_YesNo.enableTab();
		} 
	}
}

DND_YesNo.displayFeedback	=	function(feedbackStr){
	
	$("#fb_content").html(feedbackStr);

	DND_YesNo.mainContainer.find("#feedBack").show();
	DND_YesNo.optCounter++;
	
	if(DND_YesNo.optCounter==DND_YesNoData.data.clickable_items[0].opt_cout){
		
		DND_YesNo.completed=true;
	}
	$("#fb_content").scrollTop(0);
	MainController.initializeTemplateInShell();	
}

DND_YesNo.enableTab	=	function(){
	DND_YesNo.clickVisitedArr[currentOptId]=1;
	DND_YesNo.checkCompletion();
	
	$(".clk_option").removeClass("disabled");
	trace(currentOptId)
	
	$(".visitedopt").addClass("disabled").css('cursor','default');
	$("#opt_"+currentOptId+"_1").addClass("disabled visitedopt").css('cursor','default');
	$("#opt_"+currentOptId+"_2").addClass("disabled visitedopt").css('cursor','default');
}

DND_YesNo.checkCompletion	=	function(){
	var vistedTab=0;
	for(var i=0;i<DND_YesNo.clickVisitedArr.length;i++){
		if(DND_YesNo.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}

	if(vistedTab==parseInt(DND_YesNoData.data.total_clickable)){
		DND_YesNo.markPageComplete();				
	}

}

DND_YesNo.markPageComplete	=	function(){
	
	if(DND_YesNo.pageCompleted	==	false){
		DND_YesNo.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(DND_YesNo,"templateActivityCompleted","","");		
		
	}

}