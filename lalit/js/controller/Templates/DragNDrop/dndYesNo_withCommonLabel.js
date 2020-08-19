var DND_YesNo_label = function(){};
var DND_YesNo_labelData='';
DND_YesNo_label.mainContainer;
DND_YesNo_label.clickVisitedArr=[];
DND_YesNo_label.currentId=0;
DND_YesNo_label.activityInitialized=false;
DND_YesNo_label.pageCompleted	=false;
DND_YesNo_label.optCounter=0;DND_YesNo_label.completed=false;
var currentOptId;
DND_YesNo_label.isIncorrectoptClicked=false;
DND_YesNo_label.init=function(data){	
	DND_YesNo_labelData=data;
	
	
	DND_YesNo_label.mainContainer=$("#DNDContainer");
	DND_YesNo_label.mainContainer.find("#instructionTxt").html(DND_YesNo_labelData.data.instruction);
	
	var optCount=parseInt(DND_YesNo_labelData.data.clickable_items[0].opt_cout);
	for(var t=0; t<optCount; t++){		
		DND_YesNo_label.clickVisitedArr.push(0);
	}
	
	
	var str="";
	
	for(var i=0;i<optCount;i++){
	
		if(i==0){			
			str+="<tr class='tableHead'><td>"+DND_YesNo_labelData.data.clickable_items[0].option_detail[i].label+"</td>";
			for(var j=0;j<DND_YesNo_labelData.data.clickable_items[0].option_detail[i].option_count;j++){
					str+="<td><div class='label'>"+DND_YesNo_labelData.data.clickable_items[0].option_detail[i].option_content[j].label+"</div></td>";
			}	
			
			
		}else{
			str+="<tr id='tr_"+(i+1)+"'><td>"+DND_YesNo_labelData.data.clickable_items[0].option_detail[i].label+"</td>";
			
				for(var j=0;j<DND_YesNo_labelData.data.clickable_items[0].option_detail[i].option_count;j++){
					str+="<td><div id='opt_"+(i+1)+"_"+(j+1)+"' class='opt_"+(i+1)+"_"+(j+1)+" clk_option icon'><div class='tickbg'></div><div class='label'>"+DND_YesNo_labelData.data.clickable_items[0].option_detail[i].option_content[j].label+"</div></div></td>";
			}	
		}
		
		str+="</tr>";
	}
	$("#YesNoContainer").html(str);
	
	var questionStr	=	DND_YesNo_labelData.data.clickable_items[0].question;
	if(DND_YesNo_labelData.data.clickable_items[0].startDivText==""){
		$("#textContainer").hide();
	}else{
		$("#textContainer").html(DND_YesNo_labelData.data.clickable_items[0].startDivText);
	}
	$("#question").html(questionStr);	
	//eventMgr.addControlEventListener(DND_YesNo_label.mainContainer, "optionClicked", DND_YesNo_label.checkAnswer);
		DND_YesNo_label.mainContainer.find("#feedBack").hide();
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		DND_YesNo_label.addListeners();
	} else{
		$(".clk_option").css("cursor","default");
	}
}

DND_YesNo_label.addListeners = function(){
	if(!DND_YesNo_label.activityInitialized){
		DND_YesNo_label.activityInitialized = true;		
		$(".clk_option").bind('click',DND_YesNo_label.checkAnswer);
	}
	$(".clk_option").css("cursor","pointer");
}

DND_YesNo_label.checkAnswer	=	function(evt){	

	if(!$(this).hasClass("disabled")){
		$(this).find(".tickbg").addClass("optSlected");
		var feedbackStr	='';

		var oName = $(evt.currentTarget).attr("id");
		
		
		currentOptId = parseInt(oName.substr(oName.indexOf("_")+1,1));
		var optId = parseInt(oName.substr(oName.lastIndexOf("_")+1));
		trace(DND_YesNo_labelData.data.clickable_items[DND_YesNo_label.currentId])
		var correctOption=parseInt(DND_YesNo_labelData.data.clickable_items[DND_YesNo_label.currentId].option_detail[(currentOptId-1)].correct_option);
		
		if(DND_YesNo_labelData.data.response=="specific"){
			trace(optId +" == "+ correctOption)
		if(optId == correctOption){
				feedbackStr    = DND_YesNo_labelData.data.quetionOptFeedback[DND_YesNo_label.currentId].correct[(currentOptId-1)].content;
				audioFileName	=DND_YesNo_labelData.data.quetionOptFeedback[DND_YesNo_label.currentId].correct[(currentOptId-1)].audio;
				$(this).addClass("correctOpt");
			}else{
				DND_YesNo_label.isIncorrectoptClicked=true;
				feedbackStr    = DND_YesNo_labelData.data.quetionOptFeedback[DND_YesNo_label.currentId].incorrect[(currentOptId-1)].content;
				audioFileName	=DND_YesNo_labelData.data.quetionOptFeedback[DND_YesNo_label.currentId].incorrect[(currentOptId-1)].audio;
				$(this).addClass("incorrectOpt");
			}
		}else{
			feedbackStr=DND_YesNo_labelData.data.generic[DND_YesNo_label.currentId].content;
			audioFileName	=	DND_YesNo_labelData.data.generic[DND_YesNo_label.currentId].audio;
			
			if(optId == correctOption){				
				$(this).addClass("correct");
			}else{			
				$(this).addClass("incorrect");
			}
			
		}
		
		trace(feedbackStr)
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		//DND_YesNo_label.displayFeedback(feedbackStr);


		$(".clk_option").addClass("disabled");
		//$("#instructionMain").addClass("feedbackHighlight");
		
		if(DND_YesNo_labelData.data.clickable_items[0].markVisit=="init"){
			DND_YesNo_label.enableTab();
		} 
	}
}

DND_YesNo_label.displayFeedback	=	function(feedbackStr){
	
	$("#fb_content").html(feedbackStr);

	DND_YesNo_label.mainContainer.find("#feedBack").show();
	DND_YesNo_label.optCounter++;
	
	if(DND_YesNo_label.optCounter==DND_YesNo_labelData.data.clickable_items[0].opt_cout){
		
		DND_YesNo_label.completed=true;
	}
	$("#fb_content").scrollTop(0);
	MainController.initializeTemplateInShell();	
}

DND_YesNo_label.enableTab	=	function(){
	DND_YesNo_label.clickVisitedArr[currentOptId]=1;
	DND_YesNo_label.checkCompletion();
	
	$(".clk_option").removeClass("disabled");
	$(".visitedopt").addClass("disabled").css('cursor','default');
	$("#opt_"+currentOptId+"_1").addClass("disabled visitedopt").css('cursor','default');
	$("#opt_"+currentOptId+"_2").addClass("disabled visitedopt").css('cursor','default');
}

DND_YesNo_label.checkCompletion	=	function(){
	var vistedTab=0;
	for(var i=0;i<DND_YesNo_label.clickVisitedArr.length;i++){
		if(DND_YesNo_label.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}

	if(vistedTab==parseInt(DND_YesNo_labelData.data.total_clickable-1)){
		DND_YesNo_label.markPageComplete();				
	}

}

DND_YesNo_label.markPageComplete	=	function(){
	
	if(DND_YesNo_label.pageCompleted	==	false){
		DND_YesNo_label.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(DND_YesNo_label,"templateActivityCompleted","","");		
		
	}

}