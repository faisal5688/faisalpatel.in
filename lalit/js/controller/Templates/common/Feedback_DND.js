var Feedback = {};
Feedback.holder;

Feedback.init = function(obj, containment) {
    Feedback.holder = obj;
    Feedback.holder.hide();
    DataManager.isFeedBackOpen = true;
    //	Feedback.holder.find("#feedbackHeader span").css("pointer-events","none");	
    Feedback.holder.draggable({
        containment: containment,
        start: Feedback.feedbackDragStart,
        stop: Feedback.feedbackDragStop
    });
    Feedback.holder.css("position", "absolute");
    Feedback.holder.css("top", "45%");
    Feedback.holder.css("left", "35%");
    Feedback.holder.find("#feedbackClose").unbind();
    Feedback.holder.find("#feedbackClose").on("click", Feedback.closeFeedback);
}

Feedback.showFeedback = function(str) {
    Feedback.holder.css("top", "30%");
    Feedback.holder.css("left", "35%");
    Feedback.holder.find("#feedbackContent").html(str);
    Feedback.holder.show();
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
    Feedback.holder.hide();
    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"
    });
    Feedback.holder.css("top", "30%");
    Feedback.holder.css("left", "35%");
};
Feedback.feedbackDragStart = function() {
    DataManager.isSliderLocked = true;
}
Feedback.feedbackDragStop = function() {
    DataManager.isSliderLocked = false;
}