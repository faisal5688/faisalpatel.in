var Feedback_Overlay = {};
Feedback_Overlay.holder;

Feedback_Overlay.init=function(obj,containment){
	Feedback_Overlay.holder = obj;
	Feedback_Overlay.holder.hide();	
	DataManager.isFeedBackOpen=true;
	Feedback_Overlay.holder.find("#feedbackHeader span").css("pointer-events","none");	
	Feedback_Overlay.holder.draggable({
		containment:containment,
		start: Feedback_Overlay.feedbackDragStart,
		stop: Feedback_Overlay.feedbackDragStop	
	});
	Feedback_Overlay.holder.css("position","absolute");
 	Feedback_Overlay.holder.css("top","45%");
	Feedback_Overlay.holder.css("left","35%"); 
	Feedback_Overlay.holder.find("#feedbackClose").unbind();
	Feedback_Overlay.holder.find("#feedbackClose").on("click",Feedback_Overlay.closeFeedback);	
	Feedback_Overlay.holder.parent().find("#feedbackOverlay").hide();
}

Feedback_Overlay.showFeedback=function(str){
	Feedback_Overlay.holder.css("top","30%");
	Feedback_Overlay.holder.css("left","35%"); 
	Feedback_Overlay.holder.find("#feedbackContent").html(str);
	Feedback_Overlay.holder.show();
	Feedback_Overlay.holder.parent().find("#feedbackOverlay").show();
}
Feedback_Overlay.orientationChange	=	function(){
	Feedback_Overlay.holder.css("top","45%");
	Feedback_Overlay.holder.css("left","35%"); 
	
}
Feedback_Overlay.hideFeedback=function(){	
	Feedback_Overlay.holder.hide();
	Feedback_Overlay.holder.parent().find("#feedbackOverlay").hide();
	//DataManager.isFeedBackOpen=false;
}


Feedback_Overlay.closeFeedback=function(){
	Feedback_Overlay.holder.hide();
	Feedback_Overlay.holder.parent().find("#feedbackOverlay").hide();
	$(Feedback_Overlay).trigger({
			type:"feedbackClosed",
			value:"none"
	});
	Feedback_Overlay.holder.css("top","30%");
	Feedback_Overlay.holder.css("left","35%"); 
};
 Feedback_Overlay.feedbackDragStart=function(){
	if($(evt.originalEvent.target).attr("id")!="feedbackHeader"){		
		evt.preventDefault();
		return;
	}
	DataManager.isSliderLocked=true;
 }
Feedback_Overlay.feedbackDragStop=function(){
	DataManager.isSliderLocked=false;
 }