var Feedback = {};
Feedback.holder;
var count = 0;
var showfeed = 0;
Feedback.init = function(obj, containment) {
    Feedback.holder = obj;
    Feedback.holder.hide();
    DataManager.isFeedBackOpen = true;
    //    Feedback.holder.find("#feedbackHeader span").css("pointer-events", "none");
    Feedback.holder.draggable({
        containment: containment,
        handle: "#feedbackHeader",
        start: Feedback.feedbackDragStart,
        stop: Feedback.feedbackDragStop
    });
    Feedback.holder.css("position", "absolute");
    Feedback.holder.css("top", "70%");
    Feedback.holder.css("left", "0%");
    Feedback.holder.find("#feedbackClose").unbind();
    Feedback.holder.find("#feedbackClose").on("click", Feedback.closeFeedback);
}

Feedback.showFeedback = function(str) {
    Feedback.holder.css("top", "70%");
    Feedback.holder.css("left", "0%");
    Feedback.holder.find("#feedbackContent").html(str);
    Feedback.holder.show();
    Feedback.holder.find("#feedbackContent").scrollTop(0);
}
Feedback.orientationChange = function() {
    Feedback.holder.css("top", "40%");
    Feedback.holder.css("left", "0%");

}
Feedback.hideFeedback = function() {
    Feedback.holder.hide();
    //DataManager.isFeedBackOpen=false;
}


Feedback.closeFeedback = function() {
    //AudioController.playInternalAudio("blank");
    Feedback.holder.hide();
    Feedback.holder.css("top", "70%");
    Feedback.holder.css("left", "0%");
};

function _resetClick() {
    count++;
    $("#submitBtn").show();
    $("#buttonSub").show();
    $("#buttonReset").hide();
    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"

    });

}

function _solutionClick() {

    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"

    });
    $("#solutionText").show();
    $(this).addClass("buttonSolutionDisabled");
    $("#buttonSolution").attr("disabled", "disabled");
}

Feedback.feedbackDragStart = function(evt, ui) {
    DataManager.isSliderLocked = true;
}
Feedback.feedbackDragStop = function() {
    DataManager.isSliderLocked = false;
}