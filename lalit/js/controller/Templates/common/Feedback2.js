var Feedback = {};
Feedback.holder;

Feedback.init = function(obj, containment) {
    Feedback.holder = obj;
    Feedback.holder.hide();
    DataManager.isFeedBackOpen = true;
    // Feedback.holder.find("#feedbackHeader span").css("pointer-events", "none");
    Feedback.holder.draggable({
        containment: "#mcssContainer",
        handle: "#feedbackHeader",
        start: Feedback.feedbackDragStart,
        stop: Feedback.feedbackDragStop
    });
    Feedback.holder.css("position", "absolute");
    Feedback.holder.css("top", "41%");
    Feedback.holder.css("left", "30%");
    Feedback.holder.find("#feedbackClose").unbind();
    Feedback.holder.find("#feedbackClose").on("click", Feedback.closeFeedback);

}

Feedback.showFeedback = function(str) {
    /* Feedback.holder.css("top","20%");
    Feedback.holder.css("left","35%");  */
    Feedback.holder.find("#feedbackContent").html("<p>" + str + "</p>");
    Feedback.holder.show();
    Feedback.holder.find("#feedbackContent").scrollTop(0);
}
Feedback.orientationChange = function() {
    Feedback.holder.css("top", "41%");
    Feedback.holder.css("left", "30%");

}
Feedback.hideFeedback = function() {
    Feedback.holder.hide();
    //DataManager.isFeedBackOpen=false;
}


Feedback.closeFeedback = function() {
    Feedback.holder.hide();
    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"
    });

    /* Feedback.holder.css("top","30%");
    Feedback.holder.css("left","35%");  */
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

$(document).ready(function() {
    $(window).resize(function() {
        $("#mcssFeedbackBox").css("top", "41%");
        $("#mcssFeedbackBox").css("left", "30%");
    });
});