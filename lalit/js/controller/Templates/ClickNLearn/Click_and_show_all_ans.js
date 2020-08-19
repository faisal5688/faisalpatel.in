
var clickNShowAns = function(){};
clickNShowAns.optionsHolder;
clickNShowAns.activityInitialized;
clickNShowAns.currentId=0;
clickNShowAns.clickVisitedArr	=	[];
clickNShowAns.clickcorrectcounter	=	0;
clickNShowAns.correctAns	=	0;
clickNShowAns.pageCompleted	=	false;
var clickNShowAnsData;

var evtMrg = new EventManager();
var totalClickable;
var clickCounter=0;
clickNShowAns.submitListenerAdded=false;




clickNShowAns.init=function(data){
	clickNShowAnsData=data;
	$('.m03_p06_title').html(data.title);
	$('.m03_p06_subtitle').html(data.instruction);
	$('.m03_p06_tablecontainer').html(data.tableData);
	clickNShowAns.optionsHolder = $('.tablecontainer').find('.table .option');
	clickNShowAns.correctAns=parseInt(data.total_correct_ans);
	totalClickable=data.total_clickable;
	eventMgr.addControlEventListener(clickNShowAns.optionsHolder, "click", clickNShowAns.checkAnswer);
	
	
/* 	SubmitButton.init($("#tablecontainer").find($("#submitBtn button")));	
	eventMgr.addControlEventListener(SubmitButton, "submitClicked", clickNShowAns.submitClick); */
	
	//Feedback.init($(".feedBackContent"), $("#yesNoContainer"));	
	Feedback.init($("#dndFeedbackBox"), $("#yesNoContainer"));	
	eventMgr.addControlEventListener(Feedback, "feedbackClosed", clickNShowAns.closeFeedback);
	
	setTimeout(function(){
		MainController.initializeTemplateInShell();			
	},60);
$('.table_icon').css("visibility","hidden");	
$('#note').css("visibility","hidden");
}

clickNShowAns.submitClick=function(){
	
	var i = 1;
	
	$('.option').each(function(){
		//alert(i);
		var answer = $('#option_'+i).attr('ans');
		
		if(answer == 'true'){
			$('#tableIcon_'+i).addClass('correct');
			clickNShowAns.clickcorrectcounter++;
		}else{
			$('#tableIcon_'+i).addClass('incorrect');
		}
		i++;
	});

	$('.table_icon').css("visibility","visible");
	$('#submitBtn').css("display","none");		
	$('.tablecontainer').find('.table .option').addClass("disabledOpt disabledCursor");
	$('#note').css("visibility","visible");
	$("#submitBtn button").unbind('click');
	$("#submitBtn button").addClass("disabled");
	eventMgr.dispatchCustomEvent(clickNShowAns,"templateActivityCompleted");
	eventMgr.removeControlEventListener(clickNShowAns.optionsHolder,"","");
}

clickNShowAns.closeFeedback=function(){	
	$("#dndFeedbackBox").hide();
	//eventMgr.dispatchCustomEvent(clickNShowAns,"templateActivityCompleted");
}

clickNShowAns.onOrientationChange= function(){	
		
}

clickNShowAns.addQustion=function(inrItemId){
		
	
}

clickNShowAns.addListeners = function(){
	
}
clickNShowAns.checkAnswer	=	function(event){
	
	if($(this).hasClass("disabledOpt")){
		if($(this).parent().find('.table_icon').hasClass("correct")){
			$(this).parent().find('.table_icon').removeClass("correct");
			clickNShowAns.clickcorrectcounter--;
		}else{
			$(this).parent().find('.table_icon').removeClass("incorrect");
		}
		$(this).removeClass("disabledOpt");
		
		if($(".disabledOpt").length<=0){
		
			if(clickNShowAns.submitListenerAdded==true){
				clickNShowAns.submitListenerAdded=false;
				$("#submitBtn button").off("click");
				$("#submitBtn button").addClass("disabled");
			}
	
		}
		clickCounter--;
		return;
	}else{
	
		if(clickNShowAns.submitListenerAdded==false){
			clickNShowAns.submitListenerAdded=true;
			$("#submitBtn button").on("click",clickNShowAns.submitClick);
			$("#submitBtn button").removeClass("disabled");
		}
	
	clickCounter++;
	$(this).addClass("disabledOpt");
	
	//$(this).css("cursor","default");;
	var answer = $(this).attr('ans');
	var block =	$(this).attr('block');
		$(this).parent().find('.table_icon').each(function(){
			if(answer == 'true'){
				if(block == $(this).attr('block')){
					$(this).addClass('correct');
					clickNShowAns.clickcorrectcounter++;
				}	
			}else{
				if(block == $(this).attr('block')){
					$(this).addClass('incorrect');
				}	
					
			}
	});
	}


		if(clickNShowAns.clickcorrectcounter==clickNShowAns.correctAns){			
			clickNShowAns.markPageComplete();
		}else if(clickCounter==totalClickable){
			clickNShowAns.markPageComplete();		
		}

	
}
clickNShowAns.displayFeedback	=	function(feedbackStr){
	
}

clickNShowAns.markPageComplete	=	function(){
	
	if(clickNShowAns.pageCompleted	==	false){
		clickNShowAns.pageCompleted	=	true;
		if(clickCounter==totalClickable){
			//$(".option").css("cursor","default");
		}		
		
		
		
	}

}