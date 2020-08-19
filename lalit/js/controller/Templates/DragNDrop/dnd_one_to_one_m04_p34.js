var DND_OneToOne = {};

var dragElement;
var droppingElement;
var droppedElement;
var dropOnlyOnCorrectTraget = false;
var dndCorrectFeedback;
var dndIncorrectFeedback;
var dndSolutionFeedback;
var maxAttempts;

DND_OneToOne.currentAttempt = 0;



/**initilize DND**/
DND_OneToOne.initialize = function(data) {
        DataManager.isSliderLocked = true;
        setTimeout(function() { DataManager.isSliderLocked = true; }, 500);
        DND_OneToOneData = data;
        DataManager.numberOfSubmitEvent = 0;
        $("#feedbackClose").css("z-index", "1001");
        Feedback.init($("#mcssFeedbackBox"), $("#containment"));
        $("#feedbackClose").off().on(function() { $("#mcssFeedbackBox").hide(); })
            //eventMgr.addControlEventListener(Feedback, "feedbackClosed", DND_OneToOne.closeFeedbackdndv2);

        dndCorrectFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.correct.content;
        dndIncorrectFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.incorrect.content;
        dndSolutionFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.solution.content;
        dropOnlyOnCorrectTraget = DND_OneToOneData.data.dropOnlyOnCorrectTraget;
        maxAttempts = DND_OneToOneData.data.DND.maxAttempts;

        DND_OneToOne.mainContainer = $("#dnd_2Container");
        DND_OneToOne.enableSubmit(false);
        DND_OneToOne.createDndItem();

        $("#resetBtn").addClass("disabled");
        $("#solutionBtn").addClass("disabled");
        $(".solutionInst, #solutionBtn").hide();
        $("#submitBtn").bind("click", DND_OneToOne.submitHandler);
        $("#resetBtn").bind("click", DND_OneToOne.resetHandler);
        $("#close_dnd_v2feedback").bind("click", DND_OneToOne.closeFeedbackdndv2);
        $("#solutionBtn").bind("click", DND_OneToOne.solutionHandler);

        setTimeout(function() {
            MainController.initializeTemplateInShell();
            $(".dragItem").css('cursor', 'default');
        }, MainController.pageInterval);
    }
    /**create drag and drop elements**/
DND_OneToOne.createDndItem = function() {

    if (DataManager.numberOfSubmitEvent >= 2) {
        DataManager.numberOfSubmitEvent = 0;
    }


    //$('#drop_Col').html(DND_OneToOneData.data.DND.columnText);

    var _items = DND_OneToOneData.data.DND.draggableItems.items;

    for (var d = 0; d < _items.length; d++) {
        //trace(DND_OneToOneData.data.DND.draggableItems.items[d].content);
        $("#drag_Col").append("<div id='clone_" + d + "' class='dragCloneItem'>" + _items[d].content + "</div> <div id='drag_" + d + "' class='dragItem'>" + _items[d].content + "</div>");
        $('#drag_' + d).attr("correctTarget", _items[d].target);
        $('#drop_' + d).attr("correctSource", DND_OneToOneData.data.DND.droppables.items[d].id);

    }

}

/**listeners to call drag and drop events on play complete**/
DND_OneToOne.addListeners = function() {
    $(".dragItem").css('cursor', 'move');
    $(".dragItem").draggable({
        containment: $("#containment"),
        start: DND_OneToOne.dragStart,
        stop: DND_OneToOne.dragStop,
        revert: DND_OneToOne.dragRevert
    });
    $(".dropItem").droppable({
        tolerance: 'intersect',
        drop: DND_OneToOne.onDrop
    });
}


/**events on drag start**/
DND_OneToOne.dragStart = function(dropped, ui) {

        // $(this).css({ "z-index": "99", 'background': 'none', 'border-bottom': 'none' });

        $(this).css({ "z-index": "99" });

        droppedElement = droppingElement;
        dragElement = $(this).attr("id");
        DataManager.dragElementsLength = $(".dragItem").length;
        $(this).clone();
        if ($(this).hasClass("disabled"))
            return false;

    }
    /**events on drag stop**/
DND_OneToOne.dragStop = function(dropped, ui) {

        if ($(this).attr("revert") != undefined) {
            $(this).animate({ left: 0, top: 0 }, 100);

            //	$(this).css({ 'background': '#f0f0f0', 'border-bottom': '1px solid #fff' });

            //	$(this).css({ 'background': '#f0f0f0', 'border-bottom': '1px solid #fff' });

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
        trace("dragRevert")
        if ($(this).attr("revert") != undefined) {
            var DropId = $(this).attr("placedat");
            $(this).attr("revert", "true");
            $("#" + DropId).attr("contains", $(this).attr("id")).attr("revert", "true");
        }

        if (dropped) {
            trace("dropped" + droppingElement)

        } else {
            $(this).attr("revert", "true");
        }
    }
    /**events on drop**/
DND_OneToOne.onDrop = function(event, ui) {

    $("#resetBtn ").removeClass("disabled");


    if (dropOnlyOnCorrectTraget == false) {
        if ($(this).hasClass("doppedComplete")) {
            $("#" + dragElement).attr("revert", "true");
        } else {
            $(".ui-droppable").each(function() {
                if ($(this).attr("filledElement") == dragElement) {
                    $(this).removeClass("doppedComplete");
                    $(this).removeAttr("filledElement");
                    $(this).removeAttr("isDrop");
                }
            });
            if ($("#" + dragElement).attr("contains")) {
                $("#" + dragElement).removeClass("v2_correct");
                $("#" + dragElement).removeClass("v2_incorrect");
                $("#" + dragElement).removeAttr("contains");
            }

            droppingElement = $(this).attr("id");
            $(ui.draggable).css("left", "0px");
            $(ui.draggable).css("top", "0px");
            $(this).append($(ui.draggable));
            $(ui.draggable).css("width", "100%");
            $(ui.draggable).css("max-width", "100%");

            var cloneDnd = $("#" + dragElement).clone();
            $(this).addClass("doppedComplete");

            //	$(this).find('.dragItem').eq(0).css({ 'background': 'none', 'padding': '0', 'border-right': 'none' });

            $(this).attr("filledElement", dragElement);
            $(this).attr("isDrop", "true");
            $(ui.draggable).css("z-index", "1");

            $("#".dragElement).addClass("dropped");
            DND_OneToOne.checkAllPlaced();

            var dropId = $(this).attr("correctsource");

            if ($("#" + dragElement).attr("correcttarget") == dropId) {
                $("#" + dragElement).addClass("v2_correct");
            } else {
                $("#" + dragElement).addClass("v2_incorrect");
            }

            var elementNumber = parseInt(String($("#" + dragElement).attr("id")).split("_")[1]);
            $("#clone_" + elementNumber).show();
        }

    } else {

        droppingElement = $(this).attr("id");
        var dropId = $(this).attr("correctsource");

        if ($("#" + dragElement).attr("correcttarget") == dropId) {

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

            var elementNumber = parseInt(String($("#" + dragElement).attr("id")).split("_")[1]);

            $("#clone_" + elementNumber).show();

            DND_OneToOne.checkAllPlaced();

        } else {
            $("#" + dragElement).attr("revert", "true");

        }

    }
}

/**check if all draggables are dropped**/
DND_OneToOne.checkAllPlaced = function() {
        if ($("[isDrop = true]").length == DND_OneToOneData.data.DND.draggableItems.items.length) {
            trace("isDrop complete");
            DND_OneToOne.enableSubmit(true);
        }
    }
    /**enable sunmit button**/
DND_OneToOne.enableSubmit = function(flag) {
        if (flag) {
            DND_OneToOne.mainContainer.find("#submitBtn ").removeClass("disabled");
            //DND_OneToOne.mainContainer.find("#submitBtn ").removeAttr("disabled");
        } else {
            DND_OneToOne.mainContainer.find("#submitBtn ").addClass("disabled");
            //DND_OneToOne.mainContainer.find("#submitBtn ").attr("disabled", "disabled");
        }

    }
    /**events on submit**/
DND_OneToOne.submitHandler = function() {

        if (!$("#submitBtn").hasClass('disabled')) {
            $(".dragItem").css('cursor', 'default');

            DataManager.numberOfSubmitEvent = (DataManager.numberOfSubmitEvent) + 1;

            if (dropOnlyOnCorrectTraget == false) {
                if (DataManager.numberOfSubmitEvent >= maxAttempts) {
                    DND_OneToOne.checkDndaAllCorrectAns();
                    DND_OneToOne.showDndFeedBack();
                    //  $("#dndFeedbackBox").show();
                    DataManager.isSliderLocked = false;

                } else {

                    // $("#dndFeedbackBox").show();
                    DND_OneToOne.showDndFeedBack();
                    DND_OneToOne.showDndOneToOneAns();
                }
            } else {
                DND_OneToOne.showDndOneToOneAns();
            }
            if (DataManager.dragElementsLength == $(".v2_correct").length) {
                DND_OneToOne.checkDndaAllCorrectAns();
                DND_OneToOne.showDndFeedBack();
                DataManager.isSliderLocked = false;
                MainController.markCurrentPageComplete();
                MainController.showNextInstruction();
            }
            DND_OneToOne.enableSubmit(false);
        }

        //$("#dndFeedbackBox").show();

    }
    /**events on submit**/
DND_OneToOne.solutionHandler = function() {

    DND_OneToOne.closeFeedbackdndv2();
    $(".solutionInst").hide();

    if (!$("#solutionBtn").hasClass('disabled')) {

        if (DataManager.dragElementsLength == $(".v2_correct").length) {

            DND_OneToOne.checkDndaAllCorrectAns();
            DataManager.numberOfSubmitEvent = 0;
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();

            if (DND_OneToOneData.data.DND.audio) {
                AudioController.playInternalAudio(DND_OneToOneData.data.DND.audio);
            } else {
                eventMgr.dispatchCustomEvent(DND_OneToOne, "templateActivityCompleted", "", "");
            }
        } else {
            if (DataManager.numberOfSubmitEvent >= maxAttempts) {
                DND_OneToOne.checkDndaAllCorrectAns();
                DND_OneToOne.showCorrectAnswer();
                MainController.markCurrentPageComplete();
                MainController.showNextInstruction();

            } else {
                $("#resetBtn ").removeAttr("disabled");
                $("#resetBtn ").removeClass("disabled");
                $("#submitBtn ").addClass("disabled");
                $("#solutionBtn").addClass("disabled");
            }
        }

    }
}

/**reset all drag elements**/
DND_OneToOne.resetHandler = function() {
        if (!$("#resetBtn ").hasClass('disabled')) {
            DataManager.isSliderLocked = true;
            $("#drop_Col").empty();
            $("#drag_Col").empty();
            DND_OneToOne.createDndItem();
            $("#resetBtn ").addClass("disabled");
            $("#submitBtn ").addClass("disabled");
            $("#solutionBtn").addClass("disabled");
            DND_OneToOne.addListeners();
        }
    }
    /**on show feed back**/
DND_OneToOne.showDndFeedBack = function() {

        $("#resetBtn ").addClass("disabled");
        $("#submitBtn ").addClass("disabled");
        $(".dragItem").draggable("disable");
        if (DataManager.dragElementsLength == $(".v2_correct").length) {

            Feedback.showFeedback(dndCorrectFeedback);
            $("#dndFeedbackBox").show();
            //$("#feedbackContent").empty().html(dndCorrectFeedback);
        } else {
            if (DataManager.numberOfSubmitEvent >= maxAttempts) {
                Feedback.showFeedback(dndSolutionFeedback);
                $("#dndFeedbackBox").show();

            } else {
                Feedback.showFeedback(dndIncorrectFeedback);
                $("#solutionBtn").removeClass("disabled");

                $("#dndFeedbackBox").show();

                //$("#feedbackContent").empty().html(dndIncorrectFeedback);
            }
            $("#solutionBtn").removeClass("disabled");
            $("#submitBtn").hide();
            $(".solutionInst, #solutionBtn").show();
        }

    }
    /**close feed back**/
DND_OneToOne.closeFeedbackdndv2 = function() {
        $("#dndFeedbackBox").hide();
    }
    /**check if all drops are correct**/
DND_OneToOne.checkDndaAllCorrectAns = function() {
        $("#resetBtn").addClass("disabled");
        $("#submitBtn").addClass("disabled");
        $("#solutionBtn").addClass("disabled");
        DND_OneToOne.showDndOneToOneAns();
    }
    /**show Answer on max no of attempts or if all correct**/
DND_OneToOne.showDndOneToOneAns = function() {

        $(".v2_correct").addClass("DND_OneToOne_correct");

        $(".v2_incorrect").addClass("DND_OneToOne_incorrect").parent('wbgColor').addClass("wbgColor");

        $(".DND_OneToOne_correct").show();
        $(".DND_OneToOne_incorrect").show();

        $(".dragItem").draggable("disable");
        DND_OneToOne.DndCompletion();

    }
    /**check max number of attempts called on feed back close of max attempts**/
DND_OneToOne.onDndMaxAttempt = function() {
        $("#resetBtn ").addClass("disabled");
        DataManager.numberOfSubmitEvent = 0;
    }
    /**on cmpletetation of drag and drop**/
DND_OneToOne.DndCompletion = function() {
    $(".dragItem").draggable("disable"); //chage to proper class only
    $("#submitBtn ").addClass("disabled");
    $("#solutionBtn").addClass("disabled");
    $("#resetBtn ").addClass("disabled");
}

DND_OneToOne.showCorrectAnswer = function() {

        $("#mcssFeedbackBox").hide()

        if (DataManager.numberOfSubmitEvent >= maxAttempts) {
            $(".dragItem").draggable("disable");
            $(".dropItem .dragItem").remove();
            var _items = DND_OneToOneData.data.DND.draggableItems.items
            for (var d = 0; d < _items.length; d++) {
                var _targetId = parseInt(_items[d].target) - 1
                $("#drop_" + _targetId).append("<div id='drag_" + d + "' class='dragItem'>" + _items[d].content + "</div>");
            }

        }
    }
    /**audio call**/
DND_OneToOne.pageAudioHandler = function(currTime, totTime) {
    if (currTime >= totTime) {
        eventMgr.dispatchCustomEvent(DND_OneToOne, "templateActivityCompleted", "", "");
    }
}