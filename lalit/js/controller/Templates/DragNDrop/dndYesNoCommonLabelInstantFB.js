var dndYesNoCommonLabelInstantFB = function(){};
var dndYesNoCommonLabelInstantFBData='';
dndYesNoCommonLabelInstantFB.mainContainer;
dndYesNoCommonLabelInstantFB.clickVisitedArr=[];
dndYesNoCommonLabelInstantFB.currentId=0;
dndYesNoCommonLabelInstantFB.activityInitialized=false;
dndYesNoCommonLabelInstantFB.pageCompleted	=false;
dndYesNoCommonLabelInstantFB.count=0;
dndYesNoCommonLabelInstantFB.optCounter=0;dndYesNoCommonLabelInstantFB.completed=false;
var currentOptId;
var optionNumbers=0;
dndYesNoCommonLabelInstantFB.init=function(data){	
	dndYesNoCommonLabelInstantFBData=data;
	
	
	dndYesNoCommonLabelInstantFB.mainContainer=$("#DNDContainer");
	dndYesNoCommonLabelInstantFB.mainContainer.find("#instructionTxt").html(dndYesNoCommonLabelInstantFBData.data.instruction);
	
	var optCount=parseInt(dndYesNoCommonLabelInstantFBData.data.clickable_items[0].opt_cout);
	for(var t=0; t<optCount; t++){		
		dndYesNoCommonLabelInstantFB.clickVisitedArr.push(0);
	}
	
	optionNumbers=optCount;
	var str="";
	
	for(var i=0;i<optCount;i++){
	
		if(i==0){			
			str+="<tr><td>"+dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].label+"</td>";
		
			for(var j=0;j<dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].option_count;j++){
				str+="<td><div><div class='label'>"+dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].option_content[j].label+"</div></div></td>";
			}	
			
			
		}else{
	
			str+="<tr id='tr_"+(i+1)+"'><td>"+dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].label+"</td>";
		
			for(var j=0;j<dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].option_count;j++){
				str+="<td><div id='opt_"+(i+1)+"_"+(j+1)+"' class='opt_"+(i+1)+"_"+(j+1)+" clk_option icon'><div class='tickbg'></div><div class='label'>"+dndYesNoCommonLabelInstantFBData.data.clickable_items[0].option_detail[i].option_content[j].label+"</div></div></td>";
			}	
		}
		str+="</tr>";
	}
	$("#YesNoContainer").html(str);
	
	var questionStr	=	dndYesNoCommonLabelInstantFBData.data.clickable_items[0].question;
	if(dndYesNoCommonLabelInstantFBData.data.clickable_items[0].startDivText==""){
		$("#textContainer").hide();
	}else{
		$("#textContainer").html(dndYesNoCommonLabelInstantFBData.data.clickable_items[0].startDivText);
	}
	$("#question").html(questionStr);	
	//eventMgr.addControlEventListener(dndYesNoCommonLabelInstantFB.mainContainer, "optionClicked", dndYesNoCommonLabelInstantFB.checkAnswer);
		dndYesNoCommonLabelInstantFB.mainContainer.find("#feedBack").css('visibility','hidden');
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		
	},60);	
	
	//if page already visited earlier
	 if(MainController.getCurrentPageCompletionStatus() == 1){		
		dndYesNoCommonLabelInstantFB.addListeners();
	} else{
		$(".clk_option").css("cursor","default");
	}
}

dndYesNoCommonLabelInstantFB.addListeners = function(){
	if(!dndYesNoCommonLabelInstantFB.activityInitialized){
		dndYesNoCommonLabelInstantFB.activityInitialized = true;		
		$(".clk_option").bind('click',dndYesNoCommonLabelInstantFB.checkAnswer);
	}
	$(".clk_option").css("cursor","pointer");
}

dndYesNoCommonLabelInstantFB.checkAnswer	=	function(evt){	

	if(!$(this).hasClass("disabled")){
	
		var feedbackStr	='';

		var oName = $(evt.currentTarget).attr("id");
		
		
		currentOptId = parseInt(oName.substr(oName.indexOf("_")+1,1));
	
		if(oName=="opt_10_1" || oName=="opt_10_2"){
			currentOptId = parseInt(oName.substr(oName.indexOf("_")+1,2));
		}
		
		var optId = parseInt(oName.substr(oName.lastIndexOf("_")+1));
	
		var correctOption=parseInt(dndYesNoCommonLabelInstantFBData.data.clickable_items[dndYesNoCommonLabelInstantFB.currentId].option_detail[(currentOptId-1)].correct_option);
		
		if(dndYesNoCommonLabelInstantFBData.data.response=="specific"){
			trace(optId +" == "+ correctOption)
		if(optId == correctOption){
				feedbackStr    = dndYesNoCommonLabelInstantFBData.data.quetionOptFeedback[dndYesNoCommonLabelInstantFB.currentId].correct[(currentOptId-1)].content;
				audioFileName	=dndYesNoCommonLabelInstantFBData.data.quetionOptFeedback[dndYesNoCommonLabelInstantFB.currentId].correct[(currentOptId-1)].audio;
				$(this).addClass("correct");
			}else{
				feedbackStr    = dndYesNoCommonLabelInstantFBData.data.quetionOptFeedback[dndYesNoCommonLabelInstantFB.currentId].incorrect[(currentOptId-1)].content;
				audioFileName	=dndYesNoCommonLabelInstantFBData.data.quetionOptFeedback[dndYesNoCommonLabelInstantFB.currentId].incorrect[(currentOptId-1)].audio;
				$(this).addClass("incorrect");
			}
		}else{
			feedbackStr=dndYesNoCommonLabelInstantFBData.data.generic[dndYesNoCommonLabelInstantFB.currentId].content;
			audioFileName	=	dndYesNoCommonLabelInstantFBData.data.generic[dndYesNoCommonLabelInstantFB.currentId].audio;
			
			if(optId == correctOption){				
				$(this).addClass("correct");
			}else{			
				$(this).addClass("incorrect");
			}
			
		}
		
		trace(feedbackStr)
		//setting audio file name
		AudioController.playInternalAudio(audioFileName);		
		dndYesNoCommonLabelInstantFB.displayFeedback(feedbackStr);


		$(".clk_option").addClass("disabled");
		//$("#instructionMain").addClass("feedbackHighlight");
		
		if(dndYesNoCommonLabelInstantFBData.data.clickable_items[0].markVisit=="init"){
			dndYesNoCommonLabelInstantFB.enableTab();
		} 
	}
}

dndYesNoCommonLabelInstantFB.displayFeedback	=	function(feedbackStr){
	
	$("#fb_content").html(feedbackStr);
	dndYesNoCommonLabelInstantFB.count++;
	dndYesNoCommonLabelInstantFB.mainContainer.find("#feedBack").css('visibility','visible');
	dndYesNoCommonLabelInstantFB.optCounter++;
	
	if(dndYesNoCommonLabelInstantFB.optCounter==dndYesNoCommonLabelInstantFBData.data.clickable_items[0].opt_cout){
		
		dndYesNoCommonLabelInstantFB.completed=true;
	}
	$("#fb_content").scrollTop(0);
	MainController.initializeTemplateInShell();	
}

dndYesNoCommonLabelInstantFB.enableTab	=	function(){
	dndYesNoCommonLabelInstantFB.clickVisitedArr[currentOptId-1]=1;
	
	
	$(".clk_option").removeClass("disabled");

	
	$(".visitedopt").addClass("disabled").css('cursor','default');
	for(var i=0;i<optionNumbers;i++){
	
		$("#opt_"+currentOptId+"_"+i).addClass("disabled visitedopt").css('cursor','default');
	}
	dndYesNoCommonLabelInstantFB.checkCompletion();
	//$("#opt_"+currentOptId+"_1").addClass("disabled visitedopt").css('cursor','default');
	//$("#opt_"+currentOptId+"_2").addClass("disabled visitedopt").css('cursor','default');
	//$("#opt_"+currentOptId+"_2").addClass("disabled visitedopt").css('cursor','default');
}

dndYesNoCommonLabelInstantFB.checkCompletion	=	function(){
	var vistedTab=0;
	for(var i=0;i<dndYesNoCommonLabelInstantFB.clickVisitedArr.length;i++){
		if(dndYesNoCommonLabelInstantFB.clickVisitedArr[i]==1){		
			vistedTab++;
		}
	}

	if(vistedTab==parseInt(dndYesNoCommonLabelInstantFBData.data.total_clickable)){
		dndYesNoCommonLabelInstantFB.markPageComplete();				
	}

}

dndYesNoCommonLabelInstantFB.markPageComplete	=	function(){
	
	if(dndYesNoCommonLabelInstantFB.pageCompleted	==	false){
		dndYesNoCommonLabelInstantFB.pageCompleted	=	true;
		
		eventMgr.dispatchCustomEvent(dndYesNoCommonLabelInstantFB,"templateActivityCompleted","","");		
		
	}

}