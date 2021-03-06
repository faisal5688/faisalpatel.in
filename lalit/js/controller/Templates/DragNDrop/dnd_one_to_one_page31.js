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
DND_OneToOne.initialize = function (data) {
	DataManager.isSliderLocked = true;
	DND_OneToOneData = data;
	DataManager.numberOfSubmitEvent = 0;
	$("#dndFeedbackBox").css("z-index", "1001");
	Feedback.init($("#dndFeedbackBox"), $("#dnd_2Container"));
	eventMgr.addControlEventListener(Feedback, "feedbackClosed", DND_OneToOne.closeFeedbackdndv2);
	$(".que_txt").html(DataManager.templateXMLData.data.questionText);
	$("#instructionTxt").html("<span>" + DataManager.templateXMLData.data.instructionText + "</span>");

	$(".dnd_v2_dropContent .title").html(DataManager.templateXMLData.data.dropTitle);
	$('#dndFeedbackBox').find('#feedbackHeader span').html(DataManager.templateXMLData.data.DND.feedback.feedbacTitle)
	dndCorrectFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.correct.content;
	dndIncorrectFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.incorrect.content;
	dndSolutionFeedback = DND_OneToOneData.data.DND.feedback.genericResponse.solution.content;
	dropOnlyOnCorrectTraget = DND_OneToOneData.data.dropOnlyOnCorrectTraget;
	maxAttempts = DND_OneToOneData.data.maxAttempts;
	DND_OneToOne.mainContainer = $("#dnd_2Container");
	DND_OneToOne.enableSubmit(false);
	DND_OneToOne.createDndItem();
	$("#resetBtn").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");
	$("#submitBtn").bind("click", DND_OneToOne.submitHandler);
	$("#resetBtn").bind("click", DND_OneToOne.resetHandler);
	$("#close_dnd_v2feedback").bind("click", DND_OneToOne.closeFeedbackdndv2);
	setTimeout(function () {
		MainController.initializeTemplateInShell();
		DataManager.isSliderLocked = true;
	}, 60);
}
/**create drag and drop elements**/
DND_OneToOne.createDndItem = function () {
	if (DataManager.numberOfSubmitEvent >= 2) {
		DataManager.numberOfSubmitEvent = 0;

	}

	/* <tr>
	  <td>In elementum ex erat, vel dignissim elit mollis at. Sed eu vulputate nunc.</td>
	  <td>Drag1</td>
	  <td>Drop1</td>
	</tr> */

	for (var d = 0; d < DND_OneToOneData.data.DND.draggableItems.items.length; d++) {
		var DnDString = "";
		DnDString += "<tr>"
		DnDString += "<td><div class='text_Col'>" + DND_OneToOneData.data.DND.draggableItems.items[d].text + "<div></td>"
		DnDString += "<td class='drop_Col'><div id='drop_" + d + "' class='dropItem'></div></td>"
		DnDString += "<td class='drag_Col'><div id='clone_" + d + "' class='dragCloneItem'>" + DND_OneToOneData.data.DND.draggableItems.items[d].content + "</div> <div tabindex='1' id='drag_" + d + "' class='dragItem'>" + DND_OneToOneData.data.DND.draggableItems.items[d].content + "</div></td>"
		$("#dnd_Content").append(DnDString);
		//trace(DND_OneToOneData.data.DND.draggableItems.items[d].content);
		/* $("#drag_Col").append("<div id='clone_" + d + "' class='dragCloneItem'>" + DND_OneToOneData.data.DND.draggableItems.items[d].content + "</div> <div tabindex='1' id='drag_" + d + "' class='dragItem'>" + DND_OneToOneData.data.DND.draggableItems.items[d].content + "</div>"); */
		//$("#drop_Col").append("<div id='drop_" + d + "' class='dropItem'></div>");



		$('#drag_' + d).attr("correctTarget", DND_OneToOneData.data.DND.draggableItems.items[d].target);
		$('#drop_' + d).attr("correctSource", DND_OneToOneData.data.DND.droppables.items[d].id);
	}
	//create table header
	// $("#dnd_Content").prepend("<tr><td>"+ DataManager.templateXMLData.data.textTitle +"</td><td>"+ DataManager.templateXMLData.data.dragTitle +"</td><td>"+ DataManager.templateXMLData.data.dropTitle +"</td></tr>");

}

/**listeners to call drag and drop events on play complete**/
DND_OneToOne.addListeners = function () {

	$(".dragItem").draggable({
		containment: $("#dnd_2Container"),
		start: DND_OneToOne.dragStart,
		stop: DND_OneToOne.dragStop,
		revert: DND_OneToOne.dragRevert
	});
	$(".dropItem").droppable({
		accept: '.dragItem',
		tolerance: 'intersect',
		drop: DND_OneToOne.onDrop
	});
	$(".dragItem").on('keydown', function (e) {
		var keyNo = e.which - 97;
		console.log(keyNo)
		if (keyNo >= 0 && keyNo < DND_OneToOneData.data.DND.draggableItems.items.length) {
			if (!$('#drop_' + keyNo).hasClass("doppedComplete")) {
				$(this).css("margin", "0");
				console.log($(this).attr('id'))
				dragElement = $(this).attr("id");
				$(".dropItem").each(function () {
					if ($(this).attr("filledElement") == dragElement) {
						$(this).removeClass("doppedComplete");
						$(this).removeAttr("filledElement");
						$(this).removeAttr("isDrop");
					}
				});

				droppingElement = $('#drop_' + keyNo).attr("id");
				$(this).css("left", "0px");
				$(this).css("top", "0px");
				$('#drop_' + keyNo).append($(this));
				$(this).css("width", "100%");
				$(this).css("max-width", "100%");
				var cloneDnd = $("#" + dragElement).clone();
				$('#drop_' + keyNo).addClass("doppedComplete");
				$('#drop_' + keyNo).attr("filledElement", dragElement);
				$('#drop_' + keyNo).attr("isDrop", "true");
				$(this).css("z-index", "1");
				$("#".dragElement).addClass("dropped");
				DND_OneToOne.checkAllPlaced();
				var dropId = $('#drop_' + keyNo);
				if ($("#" + dragElement).attr("correcttarget") == dropId) {
					$("#" + dragElement).addClass("v2_correct");
				} else {
					$("#" + dragElement).addClass("v2_incorrect");
				}
				var elementNumber = ($("#" + dragElement).attr("correcttarget")) - 1;
				$("#clone_" + elementNumber).show();

			}

		}

	});
}


/**events on drag start**/
DND_OneToOne.dragStart = function (dropped, ui) {
	$(this).css("z-index", "99");
	droppedElement = droppingElement;
	dragElement = $(this).attr("id");
	DataManager.dragElementsLength = $(".dragItem").length;
	$(this).clone();
	if ($(this).hasClass("disabled"))
		return false;

}
/**events on drag stop**/
DND_OneToOne.dragStop = function (dropped, ui) {

	if ($(this).attr("revert") != undefined) {
		$(this).animate({ left: 0, top: 0 }, 100);

	} else {
		$(this).css("margin", "0");
	}

	$("#" + $(this).attr("placedat")).removeAttr("contains").removeAttr("revert");
	$(this).removeAttr("placedat").removeAttr("revert");

	$(this).attr("contains", $(this).attr("id"))
	$(this).css("z-index", "0");
}
/**events on drag revert**/
DND_OneToOne.dragRevert = function (dropped, ui) {
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
DND_OneToOne.onDrop = function (event, ui) {
	trace("onDrop");

	if (dropOnlyOnCorrectTraget == false) {
		if ($(this).hasClass("doppedComplete")) {
			$("#" + dragElement).attr("revert", "true");

		}
		else {
			$(".ui-droppable").each(function () {
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
			$(this).attr("filledElement", dragElement);
			$(this).attr("isDrop", "true");
			$(ui.draggable).css("z-index", "1");
			$("#".dragElement).addClass("dropped");
			DND_OneToOne.checkAllPlaced();
			var dropId = parseInt((($(this).attr("id")).split("_"))[1]) + 1;

			if (parseInt($("#" + dragElement).attr("correcttarget")) == dropId) {
				$("#" + dragElement).addClass("v2_correct");
			} 
			else {
				$("#" + dragElement).addClass("v2_incorrect");
			}
			
			var elementNumber = (($("#" + dragElement).attr("id")).split("_"))[1];
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
			var elementNumber = ($("#" + dragElement).attr("correcttarget")) - 1;
			$("#clone_" + elementNumber).show();
			DND_OneToOne.checkAllPlaced();
		} else {
			$("#" + dragElement).attr("revert", "true");

		}

	}
}

/**check if all draggables are dropped**/
DND_OneToOne.checkAllPlaced = function () {
	if ($("[isDrop = true]").length == DND_OneToOneData.data.DND.draggableItems.items.length) {
		trace("isDrop complete");
		DND_OneToOne.enableSubmit(true);
	}
}
/**enable sunmit button**/
DND_OneToOne.enableSubmit = function (flag) {
	if (flag) {
		DND_OneToOne.mainContainer.find("#submitBtn ").removeClass("disabled");
		DND_OneToOne.mainContainer.find("#submitBtn ").removeAttr("disabled");
	} else {
		DND_OneToOne.mainContainer.find("#submitBtn ").addClass("disabled");
		DND_OneToOne.mainContainer.find("#submitBtn ").attr("disabled", "disabled");
	}

}
/**events on submit**/
DND_OneToOne.submitHandler = function () {

	DataManager.numberOfSubmitEvent = (DataManager.numberOfSubmitEvent) + 1;

	if (dropOnlyOnCorrectTraget == false) {
		if (DataManager.numberOfSubmitEvent >= maxAttempts) {
			DND_OneToOne.checkDndaAllCorrectAns();
			DND_OneToOne.showDndFeedBack();
			//  $("#dndFeedbackBox").show();
			//DataManager.isSliderLocked = false;

		} else {

			// $("#dndFeedbackBox").show();
			DND_OneToOne.showDndFeedBack();
			DND_OneToOne.showDndOneToOneAns();
		}


	} else { DND_OneToOne.showDndOneToOneAns(); }
	if (DataManager.dragElementsLength == $(".v2_correct").length) {
		DND_OneToOne.checkDndaAllCorrectAns();
		DND_OneToOne.showDndFeedBack();
		//DataManager.isSliderLocked = false;
	}
	//$("#dndFeedbackBox").show();

}
/**reset all drag elements**/
DND_OneToOne.resetHandler = function () {
	DataManager.isSliderLocked = true;

	$("#dnd_Content").empty();

	DND_OneToOne.createDndItem();
	$("#resetBtn ").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");
	DND_OneToOne.addListeners();

}
/**on show feed back**/
DND_OneToOne.showDndFeedBack = function () {

	$("#resetBtn ").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");
	$("#submitBtn ").attr("disabled", "disabled");
	$("#submitBtn ").addClass("disabled");
	$(".dragItem").draggable("disable");
	if (DataManager.dragElementsLength == $(".v2_correct").length) {

		Feedback.showFeedback(dndCorrectFeedback, "Correct");
		$("#dndFeedbackBox").show();
		//$("#feedbackContent").empty().html(dndCorrectFeedback);
	}
	else {
		if (DataManager.numberOfSubmitEvent >= maxAttempts) {
			Feedback.showFeedback(dndSolutionFeedback, "incorrect");
			$("#dndFeedbackBox").show();

		} else {
			Feedback.showFeedback(dndIncorrectFeedback, "incorrect");
			$("#dndFeedbackBox").show();
			//$("#feedbackContent").empty().html(dndIncorrectFeedback);
		}
	}
	$("#dndFeedbackBox").focus();
}
/**close feed back**/
DND_OneToOne.closeFeedbackdndv2 = function () {

	$("#dndFeedbackBox").hide();

	if (DataManager.dragElementsLength == $(".v2_correct").length) {
		DND_OneToOne.checkDndaAllCorrectAns();
		DataManager.numberOfSubmitEvent = 0;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();
		//alert('1')
	} else {
		if (DataManager.numberOfSubmitEvent >= maxAttempts) {

			DND_OneToOne.checkDndaAllCorrectAns();
			DND_OneToOne.showCorrectAnswer();
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
			eventMgr.dispatchCustomEvent(DND_OneToOne, "templateActivityCompleted", "", "");
			//alert('2')

		} else {
			$("#resetBtn ").removeAttr("disabled");
			$("#resetBtn ").removeClass("disabled");
			$("#submitBtn ").attr("disabled", "disabled");
			$("#submitBtn ").addClass("disabled");

		}
	}

}
/**check if all drops are correct**/
DND_OneToOne.checkDndaAllCorrectAns = function () {

	$("#resetBtn ").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");
	$("#submitBtn ").attr("disabled", "disabled");
	$("#submitBtn ").addClass("disabled");
	DND_OneToOne.showDndOneToOneAns();



}
/**show Answer on max no of attempts or if all correct**/
DND_OneToOne.showDndOneToOneAns = function () {
	$(".v2_correct").addClass("DND_OneToOne_correct");
	$(".v2_incorrect").addClass("DND_OneToOne_incorrect");
	$(".DND_OneToOne_correct").show();
	$(".DND_OneToOne_incorrect").show();
	$(".dragItem").draggable("disable");
	DND_OneToOne.DndCompletion();


}
/**check max number of attempts called on feed back close of max attempts**/
DND_OneToOne.onDndMaxAttempt = function () {
	$("#resetBtn ").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");
	DataManager.numberOfSubmitEvent = 0;
}
/**on cmpletetation of drag and drop**/
DND_OneToOne.DndCompletion = function () {


	$(".dragItem").draggable("disable");  //chage to proper class only
	$("#submitBtn ").attr("disabled", "disabled");
	$("#submitBtn ").addClass("disabled");
	$("#resetBtn ").attr("disabled", "disabled");
	$("#resetBtn ").addClass("disabled");



}
DND_OneToOne.showCorrectAnswer = function () {
	if (DataManager.numberOfSubmitEvent >= maxAttempts) {
//debugger
		$(".dropItem").empty();
		for (var d = 0; d < DND_OneToOneData.data.DND.draggableItems.items.length; d++) {
			var dragItem = DND_OneToOneData.data.DND.draggableItems.items[d];
			var target = dragItem.target - 1;
			$("#drop_" + target).append("<div id='drag_" + d + "' class='dragItem'>" + dragItem.content + "</div>");

		}
		$(".drag_wraper .dropItem .dragItem").css({
			top: '0px',
			left: '0px',
			height: '100%',
			'max-width': '100%',
			width: '100%',
			'margin': '0px'


		})
	}
}
/**audio call**/
function pageAudioHandler(currTime, totTime) {
	//trace(currTime +" "+totTime);
	if (currTime >= totTime) {
		DND_OneToOne.addListeners();
	}
}