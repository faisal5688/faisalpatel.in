var Feedback = {};
Feedback.holder;

Feedback.init = function(obj, containment) {
    Feedback.holder = obj;
    Feedback.holder.hide();
    DataManager.isFeedBackOpen = true;
   // Feedback.holder.find("#headerContent").css("pointer-events", "none");
    Feedback.holder.draggable({
        containment: containment,
        handle: "#feedbackHeader",
        start: Feedback.feedbackDragStart,
        stop: Feedback.feedbackDragStop
    }).css({
		"position": "absolute",
		"top":"45%",
		"left":"35%"
	});
		
    var _header_btn = Feedback.holder.find("#feedbackHeader")
	_header_btn.css({
		"cursor":"move"
	})
	
    var _close_btn = Feedback.holder.find("#feedbackClose")
    _close_btn.off();;
	_close_btn.unbind();
	_close_btn.on("click", Feedback.closeFeedback);
}

Feedback.showFeedback = function(str) {
    Feedback.holder.css("top", "30%");
    Feedback.holder.css("left", "35%");
    Feedback.holder.find("#feedbackContent").html(str);
    Feedback.holder.show();
    Feedback.holder.find("#feedbackContent").scrollTop(0);
}
Feedback.orientationChange = function() {
    Feedback.holder.css("top", "45%");
    Feedback.holder.css("left", "35%");

}
Feedback.hideFeedback = function() {
    Feedback.holder.hide();
    //DataManager.isFeedBackOpen=false;
}


Feedback.closeFeedback = function() {
    //AudioController.playInternalAudio("blank");
    Feedback.holder.hide();
    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"
    });
    Feedback.holder.css("top", "30%");
    Feedback.holder.css("left", "35%");
};
Feedback.feedbackDragStart = function(evt, ui) {
    /* if($(evt.originalEvent.target).attr("id")!="feedbackHeader"){		
    	evt.preventDefault();
    	return;
    }
    DataManager.isSliderLocked=true; */
    DataManager.isSliderLocked = true;
}
Feedback.feedbackDragStop = function() {
    DataManager.isSliderLocked = false;
}