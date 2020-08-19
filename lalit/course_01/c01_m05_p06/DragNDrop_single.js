var DNDClassification = {};
DNDClassification.questionData = {};
DNDClassification.currentAttempt = 0;
DNDClassification.isSubmited = false;
DNDClassification.activityIntialized = false;
DNDClassification.activityCompleted = false;

DNDClassification.initialize = function(data) {
    DataManager.isSliderLocked = true;
    DNDClassification.questionData = data;
    DNDClassification.mainContainer = $("#dndContainer");
    DNDClassification.mainContainer.find("#instructionTxt").html("<span>" + DNDClassification.questionData.instruction + "</span>")

    DNDClassification.activityIntialized = false;
    DNDClassification.activityCompleted = false;
    SubmitButton.init($("#dndContainer").find("#submitBtn"));
    eventMgr.addControlEventListener(SubmitButton, "submitClicked", DNDClassification.submitClicked);

    DNDClassification.createDraggables();
    DNDClassification.createTragets();

    setTimeout(function() {
        MainController.initializeTemplateInShell();
    }, 60);
}

DNDClassification.createDraggables = function() {
    for (var d = 0; d < DNDClassification.questionData.draggableItems.items.length; d++) {
        var dragItem = DNDClassification.mainContainer.find(".tempDragOption").clone();
        dragItem.removeClass("tempDragOption");
        dragItem.find("#dragContent").html("<span>" + DNDClassification.questionData.draggableItems.items[d].content + "</span>");
        dragItem.attr("id", "drag_" + (d + 1));
        dragItem.attr("correctTarget", DNDClassification.questionData.draggableItems.items[d].target);
        dragItem.attr("dropTarget", "none");
        DNDClassification.mainContainer.find("#dragHolder").append(dragItem);

        DNDClassification.totalDroped = 0
        //if (d == 0) {
            dragItem.show()
        //}
    }
    $(".tempDragOption").hide();
}

DNDClassification.createTragets = function() {
    var count = -1;
    DNDClassification.mainContainer.find(".dropWrap").each(function() {
        count++;
        $(this).attr("totalPlaced", 0);
        $(this).attr("maxDrop", DNDClassification.questionData.draggableItems.items.length);
    });
}

DNDClassification.addListeners = function() {
    if (!DNDClassification.activityIntialized) {
        DNDClassification.activityIntialized = true;
        for (var d = 0; d < DNDClassification.questionData.draggableItems.items.length; d++) {
            var dragItem = DNDClassification.mainContainer.find("#dragHolder").find("#drag_" + (d + 1));
            $(dragItem).draggable({
                containment: $(".innerContent"),
                start: DNDClassification.dragStart,
                stop: DNDClassification.dragStop,
                revert: DNDClassification.dragRevert
            });
            dragItem.addClass('active')

        }
        $(".dropWrap").droppable({
            drop: DNDClassification.onDrop
        });
    }
}

DNDClassification.dragStart = function(dropped, ui) {
    if ($(this).hasClass("disabled"))
        return false;
    $(this).css("z-index", "20");

}
DNDClassification.dragStop = function(dropped, ui) {
    $(this).css("z-index", "0");
}

DNDClassification.dragRevert = function(dropped, ui) {

    if (dropped) {

        if (dropped.attr("totalPlaced") > dropped.attr("maxDrop")) {
            var num = dropped.attr("totalPlaced");
            dropped.attr("totalPlaced", num - 1);
            $(this).data("uiDraggable").originalPosition = {
                top: 0,
                left: 0
            };
            return true;
        }

        var dropId = dropped.attr("id").substr(String(dropped.attr("id")).length - 1, 1);

        if ($(this).attr("dropTarget") == dropId) {
            $(this).data("uiDraggable").originalPosition = {
                top: 0,
                left: 0
            };
            return true;
        } else {
            if ($(this).attr("dropTarget") == "none")
                $(this).addClass("disabled");
            $(this).attr("dropTarget", dropId);
        }
    } else {
        $(this).data("uiDraggable").originalPosition = {
            top: 0,
            left: 0
        };
        return true;
    }

}

DNDClassification.onDrop = function(event, ui) {

    if (DNDClassification.isSubmited) {
        return
    }

    var dropId = $(this).attr("id").substr(String($(this).attr("id")).length - 1, 1);



    if ($(ui.draggable).attr("dropTarget") == dropId)
        return;

    var pl = $(this).attr("totalPlaced");
    if (pl < $(this).attr("maxDrop")) {
        if ($(ui.draggable).attr("dropTarget") != "none") {
            var myDropTarget = DNDClassification.mainContainer.find("#dropHolder" + $(ui.draggable).attr("dropTarget"));
            var placed = myDropTarget.attr("totalPlaced") - 1;
            myDropTarget.attr("totalPlaced", placed);
        }

        $(ui.draggable).css("top", "0px");
        $(ui.draggable).css("left", "0px");
        $(ui.draggable).css("z-index", 2);
        $(ui.draggable).addClass("opacity");

        setTimeout(function() {
            $(".dropWrap").children("#" + $(ui.draggable).attr("id")).removeClass("opacity");
        }, 10)

        if ($(ui.draggable).attr("dropTarget") != "none") {
            $(this).append($(ui.draggable));
        } else {
            var temp = $(ui.draggable).clone();
            temp.attr("dropTarget", dropId);

            $(temp).draggable({
                containment: $("#dndContainer"),
                start: DNDClassification.dragStart,
                stop: DNDClassification.dragStop,
                revert: DNDClassification.dragRevert
            });
            $(this).append(temp);
        }
        pl++;
        $(this).attr("totalPlaced", pl);
        DNDClassification.checkAllPlaced();
    } else {
        pl++;
        $(this).attr("totalPlaced", pl);
    }
}


DNDClassification.checkAllPlaced = function() {
    // if (DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").length == DNDClassification.questionData.draggableItems.items.length) {
    //     SubmitButton.chkSubmitEnable(true);
    // }
    if (DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").length == 1) {
           SubmitButton.chkSubmitEnable(true);
     }
}

DNDClassification.submitClicked = function() {
    DNDClassification.disableOptions();

    var correctCounter = 0;
    DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
        if ($(this).attr("correctTarget") == $(this).attr("dropTarget"))
            correctCounter++;
    });
    if (correctCounter == DNDClassification.questionData.draggableItems.items.length) {
        DNDClassification.showFeedback(true);
        DataManager.isSliderLocked = false;
    } else {
        DNDClassification.showFeedback(false);
    }
}

DNDClassification.showFeedback = function(flag) {

    DNDClassification.isSubmited = true;

    DNDClassification.currentAttempt++;
    if (DNDClassification.questionData.responseType == "generic") {
        var feedObj = DNDClassification.mainContainer.find("#dndFeedbackBox").find(".tempFeedback").clone();
        feedObj.removeClass("tempFeedback");

        if (flag) {
            feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.correct.content);
            if (DNDClassification.questionData.genericResponse.correct.header)
                feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.correct.header);
            // DNDClassification.showTickOnly();
        } else if (DNDClassification.currentAttempt < DNDClassification.questionData.maxAttempts) {
            feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.incorrect.content);
            if (DNDClassification.questionData.genericResponse.incorrect.header)
                feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.incorrect.header);
        } else {
            feedObj.find("#contentHolder #content").html(DNDClassification.questionData.genericResponse.solution.content);
            if (DNDClassification.questionData.genericResponse.solution.header)
                feedObj.find("#contentHolder #label").html(DNDClassification.questionData.genericResponse.solution.header);
            // DNDClassification.showSolution();
        }

        var _holder = DNDClassification.mainContainer.find("#dndFeedbackContent")
        _holder.append(feedObj);

    } else {
        for (var f = 0; f < DNDClassification.questionData.draggableItems.items.length; f++) {

            var feedObj = DNDClassification.mainContainer.find("#dndFeedbackBox").find(".tempFeedback").clone();
            feedObj.removeClass("tempFeedback");

            feedObj.find("#contentHolder #content").html(DNDClassification.questionData.specificResponse.response[f].content);
            feedObj.find("#contentHolder #label").html(DNDClassification.questionData.specificResponse.response[f].header);

            var _holder = DNDClassification.mainContainer.find("#dndFeedbackContent")
            _holder.append(feedObj);

        }

        if (flag) {
            DNDClassification.showTickOnly();
        } else {
            if (DNDClassification.currentAttempt >= DNDClassification.questionData.maxAttempts)
                DNDClassification.showSolution();
        }
    }
    DNDClassification.markPageComplete();

    DNDClassification.showSolutionWidthRespectivePosition = function() {
        DataManager.isSliderLocked = false;
        DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
            $(this).removeClass("correct").removeClass("incorrect");
            var _cTarget = $(this).attr("correctTarget")

            if ($(this).attr("correctTarget") == $(this).attr("dropTarget")) {

            } else {
                $("#dropHolder" + _cTarget).append($(this))
            }

            $(this).removeAttr('correctTarget')
            $(this).removeAttr('dropTarget')

        });
        DNDClassification.markPageComplete();
    }


    var _feedbackBox = $("#dndFeedbackBox")
    _feedbackBox.show();

    _feedbackBox.draggable({
        containment: $(".innerContent"),
        handler: feedObj.find("#label")
    });


    //_feedbackBox.draggable();

    feedObj.find(".close.closeIcon").on("click", function() {
        _feedbackBox.hide();
    });


    try {
        $(".dragItem").removeClass("active ui-draggable");
        $(".dropWrap").removeClass("ui-droppable");

        $(".dragItem").draggable("disable");
        $(".dropWrap").droppable("disable");

        $(".dragItem").draggable("destroy");
        $(".dropWrap").droppable("destroy");
    } catch (err) {

    }


    if (!flag) {

        var _showAnswerBtn = $("#showAnswerBtn input ")
        _showAnswerBtn.removeClass("disabled")
        _showAnswerBtn.off().on("click", function() {
            _showAnswerBtn.addClass("disabled")
            if (DNDClassification.currentAttempt >= DNDClassification.questionData.maxAttempts) {
                DNDClassification.showSolutionWidthRespectivePosition();
                feedObj.find(".close.closeIcon").trigger("click")
            }

        })
    }

}

DNDClassification.resetOptions = function() {
    DNDClassification.mainContainer.find("#dragHolder").find(".dragItem").each(function() {
        if ($(this).hasClass("disabled")) {
            $(this).removeClass("disabled")
            $(this).attr("dropTarget", "none")
        }
    });
    for (var c = 1; c <= DNDClassification.questionData.droppableItems.items.length; c++) {
        var dropTarget = DNDClassification.mainContainer.find("#dropHolder" + c);
        dropTarget.attr("totalPlaced", 0);
    }
    DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
        $(this).remove();
    });
    DataManager.isSliderLocked = true;
}

DNDClassification.showTickOnly = function() {
    DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
        $(this).addClass("correct");
    });
    DNDClassification.markPageComplete();
}

DNDClassification.showSolution = function() {
    DataManager.isSliderLocked = false;
    DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
        if ($(this).attr("correctTarget") == $(this).attr("dropTarget"))
            $(this).addClass("correct");
        else
            $(this).addClass("incorrect");
    });
    //  DNDClassification.markPageComplete();

}

DNDClassification.markPageComplete = function() {
    if (!DNDClassification.activityCompleted) {
        DNDClassification.activityCompleted = true;
        eventMgr.dispatchCustomEvent(DNDClassification, "templateActivityCompleted", "", "");
    }
}

DNDClassification.disableOptions = function() {
    DNDClassification.mainContainer.find("#dragHolder").find(".dragItem").each(function() {
        if (!$(this).hasClass("disabled")) {
            $(this).addClass("disabled")
        }
    });
    DNDClassification.mainContainer.find(".dropWrap").find(".dragItem").each(function() {
        $(this).addClass("disabled")
    });
}

pageAudioHandler = function(currTime, totTime) {
    if (currTime >= totTime) {
        DNDClassification.addListeners();
    }
}