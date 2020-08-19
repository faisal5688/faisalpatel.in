var DND_OneToOne = {};
var dragElement;
var droppingElement;
var droppedElement;
var dndCorrectFeedback;
var headerdebreif;
var eventMgr = new EventManager();

/**initilize DND**/
DND_OneToOne.initialize = function() {
    dndCorrectFeedback = "That’s correct.";
    //headerdebreif = "Debrief: Quantitative elements";
    Feedback.init($("#dndFeedbackBox"), $("#dndFeedbackBoxArea"));
    eventMgr.addControlEventListener(Feedback, "feedbackClosed", DND_OneToOne.closeFeedbackdndv2);
    $("#close_dnd_v2feedback").bind("click", DND_OneToOne.closeFeedbackdndv2);
    DND_OneToOne.addListeners();
}

/**listeners to call drag and drop events on play complete**/
DND_OneToOne.addListeners = function() {
    $(".dragItem").draggable({
        containment: $("#dragRestriction"),
        start: DND_OneToOne.dragStart,
        stop: DND_OneToOne.dragStop,
        revert: DND_OneToOne.dragRevert,
        revertDuration: 0
    });
    $(".dropItem").droppable({
        tolerance: 'intersect',
        drop: DND_OneToOne.onDrop
    });
}

/**events on drag start**/
DND_OneToOne.dragStart = function(dropped, ui) {
    $(this).css("z-index", "99");
    droppedElement = droppingElement;
    dragElement = $(this).attr("id");
    dragElementsLength = $(".dragItem").length;
    var elementNumber = $("#" + dragElement).attr("id").split('_')[1];
    if ($(this).hasClass("disabled"))
        return false;
}

/**events on drag stop**/
DND_OneToOne.dragStop = function(dropped, ui) {
    if ($(this).attr("revert") != undefined) {
        $(this).animate({
            left: 0,
            top: 0
        }, 100);

    } else {
        $(this).css("margin", "0");
    }

    $("#" + $(this).attr("placedat")).removeAttr("contains").removeAttr("revert");
    $(this).removeAttr("placedat").removeAttr("revert");

    $(this).attr("contains", $(this).attr("id"))
    $(this).css("z-index", "0");
}

/**events on drag revert**/
DND_OneToOne.dragRevert = function(dropped, ui) {
    //trace("dragRevert")
    if ($(this).attr("revert") != undefined) {
        var DropId = $(this).attr("placedat");
        $(this).attr("revert", "true");
        $("#" + DropId).attr("contains", $(this).attr("id")).attr("revert", "true");
    }

    if (dropped) {
        //trace("dropped"+droppingElement)

    } else {
        $(this).attr("revert", "true");
    }
}

/**events on drop**/
DND_OneToOne.onDrop = function(event, ui) {
    droppingElement = $(this).attr("id");
    var correctSourceIds = $(this).attr("correctsource");
    correctSourceIds = correctSourceIds.split(',');
    var elementNumber = ($("#" + dragElement).attr("correcttarget")) - 1;
    if (correctSourceIds.indexOf($("#" + dragElement).attr("correcttarget")) != -1) {
        $("#" + dragElement).addClass("v2_correct");
        $("#".dragElement).addClass("dropped");
        $(ui.draggable).css("left", "0px");
        $(ui.draggable).css("top", "0px");
        $(this).append($(ui.draggable));
        $(ui.draggable).css("width", "100%");
        var cloneDnd = $("#" + dragElement).clone();
        $(this).addClass("doppedComplete");
        $(this).attr("filledElement", dragElement);
        $(this).attr("isDrop", "true");
        $(ui.draggable).css("z-index", "1");
        $(ui.draggable).draggable("disable");
        /*  $("#" + droppingElement).droppable( "option", "disabled", true );
        $("#clone_" + elementNumber).css('display','table'); */
        DND_OneToOne.checkAllPlaced();
    } else {
        $("#clone_" + elementNumber).hide();
        $("#" + dragElement).attr("revert", "true");
    }


}

/**check if all draggables are dropped**/
DND_OneToOne.checkAllPlaced = function() {
    var _len = $(".v2_correct").length;
    if (dragElementsLength == _len) {
        try {
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();
        } catch (err) {
            console.log(err)
        }
        // DND_OneToOne.showDndFeedBack();
    }
}

/**on show feed back**/
DND_OneToOne.showDndFeedBack = function() {
    $(".dragItem").draggable("disable");
    var _len = $(".v2_correct").length;
    if (dragElementsLength == _len) {
        DND_OneToOne.showFeedback(dndCorrectFeedback);
    } else {
        //do nothing
    }
}

DND_OneToOne.showFeedback = function(str) {

    $(".dnd_v2_dragContent,.text3").css('visibility', 'hidden');
    $(".PageHeader").html(headerdebreif);
    $(".feedBackContent").show();
    Feedback.holder.css("top", "250px");
    Feedback.holder.css("left", "515px");
    $("#dndFeedbackBox").find("#feedbackContent").html("<p>" + str + "</p>");
    $("#dndFeedbackBox").show();


}


/**close feed back**/
DND_OneToOne.closeFeedbackdndv2 = function() {
    $("#dndFeedbackBox").hide();
}

// $(document).ready(function() {
//     debugger;
//     DND_OneToOne.initialize();
//     DND_OneToOne.addListeners();
// });