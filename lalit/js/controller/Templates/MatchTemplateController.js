
var MatchTemplateController = {};
var matchTemplateData;
var detectTouch = 'createTouch' in document
var cpx = 0;
var cpy=0;
MatchTemplateController.answerList = new Array();
MatchTemplateController.correctAns = new Array();
MatchTemplateController.currentDrag;
MatchTemplateController.gDropFlg;
MatchTemplateController.currentDragObj; 
MatchTemplateController.drawflg=false;
MatchTemplateController.dropflg=false;
MatchTemplateController.ClickFlg=false;
MatchTemplateController.canvObjArry=[];
MatchTemplateController.maxCount=1;
MatchTemplateController.feedback="";
MatchTemplateController.firstLoad	=	true;
MatchTemplateController.initSection=function(data){	
	matchTemplateData = data;
	//trace(matchTemplateData.data.DND.draggableItems.items[0].target);
	MatchTemplateController.maxCount	=	parseInt(matchTemplateData.data.DND.maxAttempts);
	for(var i=0;i<matchTemplateData.data.DND.draggableItems.items.length;i++){
		MatchTemplateController.answerList[i]=0;
		MatchTemplateController.correctAns[i]=parseInt(matchTemplateData.data.DND.draggableItems.items[i].target);
	}
	
	MatchTemplateController.init();
	MatchTemplateController.createElements();
	$("#matchSubmitbtn").attr("disabled","disabled");
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
}

MatchTemplateController.createElements = function(){
	var strLeft='';
	var strRight='';
	for(var i=1;i<=MatchTemplateController.correctAns.length;i++){

	strLeft+='<li><div class="textHolder"><p>'+matchTemplateData.data.DND.draggableItems.items[i-1].content+'</p></div><span id="dragbg_'+i+'"><span id="drag_'+i+'" class="drag defaultIco"></span></span></li>';
	
	
	strRight+='<li>	<div class="textHolder"><p>'+matchTemplateData.data.DND.droppables.items[i-1].content+'</p></div><span><span id="drop_'+i+'" class="defaultIco drop"></span></span></li>';
	
	
	$(".lftContainer ul").html(strLeft);
	$(".rhtContainer ul").html(strRight);
		$('.wrapper').append('<canvas id=' + "myCanvas"+i + ' width="800" height="500" >your browser does not support the canvas tag </canvas>');
		$("#myCanvas"+i).addClass("canvasCls");
		MatchTemplateController.canvObjArry[i-1]=document.getElementById("myCanvas"+i).getContext("2d");
	}	

		$(".defaultIco").css("left",0);
		$(".defaultIco").css("top",0);
		$(".defaultIco").css("z-index",3);
		
		MatchTemplateController.dragHandler();		
		$("#matchSubmitbtn").bind("mousedown", matchTemplateSubmitClickHandler);
		$(".popupClose").bind("mousedown",feedBackHandler);	
}

MatchTemplateController.touchHandler = function(e){
	var touches = event.changedTouches,
    first = touches[0],
    type = "";
     switch(event.type)
	{
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type="mousemove"; break;        
		case "touchend":   type="mouseup"; break;
		default: return;
	}
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1,
							  first.screenX, first.screenY,
							  first.clientX, first.clientY, false,
							  false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
	
}

MatchTemplateController.init = function(){
	if (detectTouch) {
		document.addEventListener("touchstart", MatchTemplateController.touchHandler, true);
		document.addEventListener("touchmove", MatchTemplateController.touchHandler, true);
		document.addEventListener("touchend", MatchTemplateController.touchHandler, true);
		document.addEventListener("touchcancel", MatchTemplateController.touchHandler, true);    
	}
	
	
}

MatchTemplateController.dragHandler	=	function(){

    $(".drag").draggable({
			containment: ".lftrhtContainer", scroll: false,
			start: function (event, ui){
				MatchTemplateController.drawflg=true;
				var dragNo= $(this).attr( 'id' ).split('_')[1];
				MatchTemplateController.currentDrag=dragNo;
				$("#myCanvas"+dragNo).zIndex(9);
				$(this).zIndex(10);
				MatchTemplateController.currentDragObj=$(this);
				MatchTemplateController.gDropFlg=false;
		    for(var i=0;i<MatchTemplateController.correctAns.length;i++){
				  if(MatchTemplateController.answerList[i]==(dragNo)){
					MatchTemplateController.answerList[i]=0;
				  }
				}
			   
			},
			stop: function (event, ui){
				MatchTemplateController.drawflg=false;
				MatchTemplateController.canvObjArry[(MatchTemplateController.currentDrag-1)].clearRect(0, 0, 1000, 500);
				if(MatchTemplateController.dropflg==true){
				MatchTemplateController.fndrawLine(MatchTemplateController.currentDrag);
				}
				$("#myCanvas"+MatchTemplateController.currentDrag).zIndex(1);
				$(this).zIndex(4);
				
			},
			revert: function (event, ui){
				MatchTemplateController.drawflg=false;
				MatchTemplateController.canvObjArry[(MatchTemplateController.currentDrag-1)].clearRect(0, 0, 1000, 500);
				if(!MatchTemplateController.gDropFlg){
					
					$(this).css("top", "0px").css("left", "0px")
				}
				
				$(this).data("ui-draggable").originalPosition = { top: 0,left: 0};
				
			
				return !event
			}
	});
	
	
	$(".drop").droppable( {
		drop: MatchTemplateController.handleDropEvent, tolerance: 'pointer'
	});
	
	
	$(document).mousemove(function(e){
		if(MatchTemplateController.drawflg==true){
			MatchTemplateController.canvObjArry[(MatchTemplateController.currentDrag-1)].clearRect(0, 0, 1000, 500);
			MatchTemplateController.fndrawLine(MatchTemplateController.currentDrag);
				
		}
	});


}
function matchTemplateSubmitClickHandler(event)
{
	MatchTemplateController.maxCount	=	MatchTemplateController.maxCount-1;
	var cnt=0;
	trace(MatchTemplateController.answerList);
	trace(MatchTemplateController.correctAns);
	
	 for(var i=0;i<MatchTemplateController.correctAns.length;i++){
		  if(MatchTemplateController.answerList[i]==MatchTemplateController.correctAns[i]){
			$("#drop_"+MatchTemplateController.answerList[i]).addClass("correctIco");
			cnt++;
		  }	 
		  else{
		  
		  $("#drop_"+MatchTemplateController.answerList[i]).addClass("incorrectIco");
		  }
	  }
	  
	  if(cnt== MatchTemplateController.correctAns.length){
		
		
		MatchTemplateController.feedback=matchTemplateData.data.DND.feedback.correct.content;
		MatchTemplateController.reset();
		MatchTemplateController.maxCount=0;
	  }
	  else if(MatchTemplateController.maxCount>0){
		
			MatchTemplateController.feedback=matchTemplateData.data.DND.feedback.incorrect.content;
			
	  }else if(MatchTemplateController.maxCount==0){
	  
			MatchTemplateController.feedback=matchTemplateData.data.DND.feedback.solution.content;
			MatchTemplateController.reset();
	  }
	 
	  $(".feebackText").html(MatchTemplateController.feedback);
	  $(".feedBackPopup").show();

	$("#matchSubmitbtn").attr("disabled","disabled");	
}
	
function feedBackHandler(){
		$(".feedBackPopup").hide();
		MatchTemplateController.feedBackCheck();

}
MatchTemplateController.feedBackCheck	=	function(){

		if(MatchTemplateController.maxCount>0){			
			MatchTemplateController.refresh();				
			$("#matchSubmitbtn").removeAttr("disabled");				
				
		  }
		  if(MatchTemplateController.maxCount==0){		  
				
				MatchTemplateController.reset();
				MatchTemplateController.showSolution();
		  }

}
MatchTemplateController.refresh	=	function(){

	$(".wrapper canvas").remove();
	MatchTemplateController.initSection(matchTemplateData);

}
MatchTemplateController.reset	=	function(){
	$(".drag").css("cursor", "default");
	$(".drag").draggable( 'disable' );	


}
MatchTemplateController.showSolution	=	function(){
	$(".wrapper canvas").remove();
	MatchTemplateController.initSection(matchTemplateData);
	
	for(var i=0;i<matchTemplateData.data.DND.draggableItems.items.length;i++){
	
		MatchTemplateController.fndrawfinalSolutionLine(i);	
		$("#drop_"+(i+1)).addClass("correctIco");
	}
	MatchTemplateController.reset();
}
MatchTemplateController.handleDropEvent	=	function(event, ui)
{
	MatchTemplateController.dropflg=true;
	MatchTemplateController.drawflg=false;
	MatchTemplateController.currentDragObj.zIndex(6);
	var dragNo= ui.draggable.attr( 'id' ).split('_')[1]
	var dropNo= $(this).attr( 'id' ).split("_")[1];
	MatchTemplateController.gDropNo=dropNo;
	if(MatchTemplateController.answerList[dropNo-1]==0){		
		ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
		MatchTemplateController.answerList[dropNo-1]=dragNo;
		MatchTemplateController.gDropFlg=true;
	}else{
		MatchTemplateController.gDropFlg=false;
		$(this).css("top", "0px").css("left", "0px");
	}
	
	if($.inArray(0,MatchTemplateController.answerList)== -1){
		$("#matchSubmitbtn").removeAttr("disabled");	
	}
	
}

MatchTemplateController.fndrawLine	=	function(tcurrentDrag){

	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineWidth=3;
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].beginPath();
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineCap = "round";
	
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].moveTo(($("#dragbg_"+tcurrentDrag).offset().left),($("#dragbg_"+tcurrentDrag).offset().top));
	
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineTo(($("#drag_"+tcurrentDrag).offset().left),$("#drag_"+tcurrentDrag).offset().top);
	
	
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].strokeStyle = "#663333";
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].stroke();
}

MatchTemplateController.fndrawfinalSolutionLine	=	function(tcurrentDrag){

	tcurrentDrag=parseInt(tcurrentDrag+1);
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineWidth=3;
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].beginPath();
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineCap = "round";
	
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].moveTo(($("#dragbg_"+tcurrentDrag).offset().left),($("#dragbg_"+tcurrentDrag).offset().top));
	var intTarget=parseInt(matchTemplateData.data.DND.droppables.items[tcurrentDrag].target);
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].lineTo(($("#drop_"+intTarget).offset().left),$("#drag_"+intTarget).offset().top);

	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].strokeStyle = "#663333";
	MatchTemplateController.canvObjArry[(tcurrentDrag-1)].stroke();
	$(".canvasCls").css("z-index","0");
}
MatchTemplateController.doOnOrientationChange	=	function()
{
	for(var i=0;i<MatchTemplateController.correctAns.length;i++){
		if(MatchTemplateController.answerList[i]!=0){
			var draggable = "#drag_"+answerList[i];	
			var droppable = "#drop_"+(i+1);	
			$(draggable).position( { of: $(droppable), my: 'left top', at: 'left top' } );
			MatchTemplateController.canvObjArry[(MatchTemplateController.answerList[i]-1)].clearRect(0, 0, 1000, 500);
			MatchTemplateController.fndrawLine(MatchTemplateController.answerList[i]);
		}
	}
}


MatchTemplateController.detectOrientation	=	function()
{		
	   window.setTimeout(function(){MatchTemplateController.doOnOrientationChange();}, 150);
}

window.onorientationchange = function()
{
	MatchTemplateController.doOnOrientationChange();
	MatchTemplateController.detectOrientation();
	
}; 