/****************prototype for reverting back******************/
$.ui.draggable.prototype._mouseStop = function (event) {
	/**If wein are using droppables, inform the manager about the drop**/
	var dropped = false;
	if ($.ui.ddmanager && !this.options.dropBehaviour) {
		dropped = $.ui.ddmanager.drop(this, event);
	}
	/**if a drop comes from outside (a sortable)**/
	if (this.dropped) {
		dropped = this.dropped;
		this.dropped = false;
	}
	if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
		var self = this;
		self._trigger("reverting", event);
		$(this.helper).animate({ left: "0", top: "0" }, function () {
			event.reverted = true;
			self._trigger("stop", event);
			self._clear();
		});
	}
	else {
		this._trigger("stop", event);
		this._clear();
	}
	return false;
};

var m04_p01 = {};
m04_p01.audioEnded;
m04_p01.dragComplete;
m04_p01.audioEnded = false;

m04_p01.showDescPopup = function (num, dndContent) {
	$("#popupRightmain").fadeIn();
	$(".HeadTxt").html(dndContent.clickablecontent[num].title);
	$(".ContPop").html(dndContent.clickablecontent[num].content);
	$("#closePopup").on("click", function () {
		$("#popupRightmain").hide();
		$(".clickable").css("cursor", "pointer");
	});
}

//Audio handler
m04_p01.pageAudioHandler = function (currTime, totTime) {
	if ((parseInt(currTime) != 0) && (parseInt(totTime) != 0) && (parseInt(currTime) >= parseInt(totTime))) {
		if (!m04_p01.audioEnded) {
			m04_p01.audioEnded = true;
			t3withDND._setDragableDropableElements();
		};
	};
	var secs = parseInt(currTime);
	switch (secs) {	
		case 0:	
		DataManager.isSliderLocked	= true;		
		break;
		case 1:			
		DataManager.isSliderLocked	= true;
		break;
		case 2:			
		DataManager.isSliderLocked	= true;
		break;
	}
};

m04_p01.markPageComplete = function () {
	if (!m04_p01.activityCompleted) {
		DataManager.isSliderLocked = false;
		m04_p01.activityCompleted = true;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();
	}
}

var T3withDNDController = function (dndContent) {
	Feedback.init($("#mcssFeedbackBox"), $("#containment"));
	var mainContainerm04_p01 = $("#dndContainer");
	var gCount = 0;
	var currentDArray = new Array();
	var wrapperStr = '';
	var self = this;

	this.init = function () {
		setTimeout(function () { DataManager.isSliderLocked = true; }, 500);

		$(".SolutionText").hide();
		$("#buttonReset").removeClass("submitButton").addClass("disabled");
		$("#buttonReset").attr("disabled", "disabled");
		wrapperStr = $('.ContentDND').html();
		$(".solutionBtnContainer").hide();
		$("#solutionAreaContainer").hide();
		$("#buttonSolution").bind("click", _solutionClick).hide();
		if (!$("#buttonSolution").hasClass('disabled')) {
			$("#buttonSolution").addClass('disabled');
		}

		$("#buttonReset").bind("click", _resetClick);

		var dndItemslength = dndContent.dragcontent.length;
		gCount++;
		for (var i = 0; i < dndItemslength; i++) {
			var dText = dndContent.dragcontent[i].title;
			dragableDivHTML = "<div id='proLitDrag" + i + "' class='proLitDragBoxes proDnd-ui-draggable' fordrop='" + dndContent.dragcontent[i].target + "'><span class='proLiteracyBoxContent draglabel'>" + dText + "</span></div>";
			$("#DNDcontent tr#dragRow").eq(i).find("td").eq(0).html("").append(dragableDivHTML);

			dragableDivHTML = "<div id='clone" + i + "' class='cloneItem'><span class='proLiteracyBoxContent draglabel clone_opacity'>" + dText + "</span></div>";
			$("#DNDcontent tr#dragRow").eq(i).find("td").eq(0).append(dragableDivHTML);
			$("#clone" + i).hide();
			//$("#proLitDrag").append(dragableDivHTML);
			$("#dropcontent_" + i).html(dndContent.dropcontent[i].title);



		}
		$('#proLitDrag').children().addClass('deactive');
		//_setDragableDropableElements();
	};
	/* this.randomizeOptions = function() {
		var parent = $("#proLitDrag");
		var divs = parent.children();
		while (divs.length) {
			parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
		}
	};

	$(function () {
		self.randomizeOptions();
	}); */

	function _solutionClick() {
		if (!$("#buttonSolution").hasClass('disabled')) {
			$("#mcssFeedbackBox").hide();
			DataManager.isSliderLocked	= false;
			//$(".SolutionText").hide();
			m04_p01.markPageComplete();
			$("#buttonReset").removeClass("submitButton").addClass("disabled");
			$("#buttonReset").attr("disabled", "disabled");
			//$(".draglabel").hide();
			$(".dndAnswerContainer").removeClass('proWrongAnswer proIncorrect').addClass('proRightAnswer proCorrect');
			
			//
			for (var i = 0; i < dndContent.dragcontent.length; i++) {
				//$(".draglabel").eq(parseInt(dndContent.dragcontent[i].target) - 1).html(dndContent.dragcontent[i].title);

				$("#proLitDrag" + i).offset($("#proLitDrop_" + dndContent.dragcontent[i].target + " .dndDropBoxes").offset());
			}

			//$(".solText").show();
			$(this).addClass("buttonSolutionDisabled");
			$("#buttonSolution").attr("disabled", "disabled");
			$("#buttonSolution").addClass('disabled');
		}

	}

	function _resetClick() {
		gCount = 0;
		$("#buttonSub").removeClass("submitButton").addClass("disabled");
		$("#buttonSub").attr("disabled", "disabled");
		$(".ContentDND").html(wrapperStr);
		$("#popupRightmain").hide();
		self.init();
		m04_p01.dragComplete = false;
		self.randomizeOptions();
		self._setDragableDropableElements();
		DataManager.isSliderLocked	= true;
	}
	this._setDragableDropableElements = function () {
		$('#proLitDrag').children().removeClass('deactive');
		$(".proLitDragBoxes").css('cursor', 'move');
		$(".proLitDragBoxes").draggable({
			containment: '.ContentDND',
			revert: "invalid",
			zIndex: 0,
			start: function (event, ui) {
				DataManager.isSliderLocked = true;
				$(this).css("z-index", "999999");
				$(this).removeAttr("isDragging");
				draggedElement = $(this).attr("ans");
				$(".proLitDragBoxes").draggable({ revert: 'invalid' });
				/****************for reverting back******************/
				$("[contains = " + $(this).attr("id") + "]").parent().find('.proRightAnswer').removeClass('proRightAnswer');
				$("[contains = " + $(this).attr("id") + "]").parent().find('.proWrongAnswer').removeClass('proWrongAnswer');
				$("[contains = " + $(this).attr("id") + "]").parent().removeClass("dropped")

				$("[contains = " + $(this).attr("id") + "]").removeAttr("contains");



				/***********************************************/
			},
			/****************for reverting back******************/
			reverting: function (e, ui) {
				var DropId = $(this).attr("placedat");
				$(this).attr("revert", "true");
				$("#" + DropId).attr("contains", $(this).attr("id")).attr("revert", "true");
				$(this).removeAttr("isDropped");
				$(this).attr("isDropped", "false");
				$(this).find('span').css('background-color', '#cccccc');
				_dropComplete();

			},
			/***********************************************/
			drag: function () {
				$(this).attr("isDragging", "true");
				$(this).find('span').css('background-color', 'transparent');
			},
			stop: function (event, ui) {
				//DataManager.isSliderLocked = false;
				$(this).css("z-index", "");
				$(this).removeAttr("isDragging");
				draggingElement = $(this);
				/****************for reverting back the dragged element******************/
				if ($(this).attr("revert") != undefined) {
					$(this).animate({ left: "0", top: "0" }, 100);
				}
				$("#" + $(this).attr("placedat")).removeAttr("contains").removeAttr("revert");
				$(this).removeAttr("placedat").removeAttr("revert");
			}
		});

		$(".dndDropBoxes").droppable({
			tolerance: 'intersect',
			accept: function (elem) {
				if ($(this).attr("contains") == undefined) {
					return true;
				}
				return false;
			},
			//activeClass: "ui-state-hover",
			//hoverClass: "ui-state-active",
			drop: function (event, ui) {
				var _clone = null;

				$(ui.draggable).offset($(event.target).offset());
				var dID = $(ui.draggable).attr("id");
				currentDArray[0] = "#" + dID;
				if (!($(this).attr("ans") == draggedElement)) {
					$(ui.draggable).draggable({ revert: 'valid' });
				}
				else {
					$(this).parent().children(".dndAnswerContainer").removeClass("proRightAnswer");
					$(this).parent().children(".dndAnswerContainer").removeClass("proWrongAnswer");
					$(this).parent().removeClass("dropped")
					$(this).attr("contains", $(ui.draggable).attr("id"));
					$(ui.draggable).attr("placedat", $(this).attr("id"));

					if (!($(this).hasClass("answerDropped"))) {
						$(ui.draggable).addClass("answerDragged");
						//debugger;
						var id1 = $(this).parent().children(".dndAnswerContainer").attr("id");
						if ($(ui.draggable).attr("forDrop") == $(event.target).attr("target")) {
							$("#" + id1).addClass("proRightAnswer");
						}
						else {
							$("#" + id1).addClass("proWrongAnswer");
						}

						$(this).parent().addClass("dropped");
						id1 = $(ui.draggable).attr("id");
						_clone = $("#clone" + id1.charAt(id1.length - 1))
						_clone.show();
					}

					var $this = $(this);
					ui.draggable.position({
						my: "center",
						at: "center",
						of: $this,
						using: function (pos) {
							//$(this).animate(pos, 200, "linear");
						}
					});

					if (_clone) {
						_clone.position({
							my: "center",
							at: "center"
						});
					}

					$(ui.draggable).attr("isDropped", "true").css('cursor', 'default');
					$(ui.draggable).draggable({ 'disabled': true });

				}
				_dropComplete();
			}


		});
	}

	function _dropComplete() {
		if ($("[isDropped = true]").length == $(".dndDropBoxes").length) {
			_enableSubmit();
		}
		else {
			$("#buttonSub").removeClass("submitButton").addClass("disabled");
			$("#buttonSub").attr("disabled", "disabled");
		}
		if ($("[isDropped = true]").length >= $(".dndDropBoxes").length) {
			$("#buttonReset").removeClass("disabled").addClass("submitButton");
			$("#buttonReset").removeAttr("disabled");
		}
		else {
			$("#buttonReset").removeClass("submitButton").addClass("disabled");
			$("#buttonReset").attr("disabled", "disabled");
		};
	}

	function _enableSubmit() {
		$('.ContentDND').find(".ui-draggable").draggable("disable");
		$('.ContentDND').find(".ui-draggable").css("cursor", "default");
		$("#buttonSub").removeClass("disabled").addClass("submitButton");
		$("#buttonSub").removeAttr("disabled");
		$("#buttonSub").bind("click", function () {
			if (!$("#buttonSub").hasClass('disabled')) {
				$('.ContentDND').find(".ui-draggable").draggable("disable");
				$('#proLitDrag').find(".ui-draggable").draggable("disable");
				$('.ContentDND').find(".ui-draggable").css("cursor", "default");
				$('#proLitDrag').find(".ui-draggable").css("cursor", "default");

				$("#buttonReset").removeClass("submitButton").addClass("disabled");
				$("#buttonReset").attr("disabled", "disabled");
				$('.ContentDND').find(".ui-draggable").draggable("disable");
				$(".ui-droppable").droppable("disable");
				$(".proRightAnswer").addClass("proCorrect");
				$(".proWrongAnswer").addClass("proIncorrect");
				var lCorrect = $(".proCorrect").length;
				if (lCorrect == dndContent.dragcontent.length) {
					showFeedbackm04_p01(true);
					DataManager.isSliderLocked	= false;
					$("#buttonReset").removeClass("submitButton").addClass("disabled");
					$("#buttonReset").attr("disabled", "disabled");
					$(".solutionBtnContainer").hide();
					m04_p01.markPageComplete();
				} else {
					showFeedbackm04_p01(false);
					$("#buttonSub").hide();
					$("#buttonSolution").removeClass('disabled').show();
					$("#buttonSolution").removeAttr("disabled");
					$(".SolutionText").show();
					$(".solutionBtnContainer").show();
					//$(".instruction").html("Click <b>Solution</b> to view the correct answers.");
				}
				$(".proCorrect").show();
				$(".proIncorrect").show();
				if ($(".proCorrect").length == gCount) {
					$("#buttonSub").removeClass("submitButton").addClass("disabled");
					$("#buttonSub").attr("disabled", "disabled");
				}
				else {
					$("#tryBtn").show();
					_enableTryAgain();
					$("#buttonSub").removeClass("submitButton").addClass("disabled");
					$("#buttonSub").attr("disabled", "disabled");
				}
				m04_p01.dragComplete = true;
			}

		});
	}
	
	
	function showFeedbackm04_p01(flag){
		
		var feedObj = mainContainerm04_p01.find("#dndFeedbackBox").find(".tempFeedback").clone();
		feedObj.removeClass("tempFeedback");
		if(flag){			
			Feedback.showFeedback("That is correct.");
		}else {
			Feedback.showFeedback("That is incorrect.");
		}
		mainContainerm04_p01.find("#dndFeedbackContent").append(feedObj);
		$("#mcssFeedbackBox").css({"left": "30.77%","top": "41.88%"});
		
	}


	function _enableTryAgain() {

		$("#buttonTry").removeClass("disabled").addClass("tryAgainButton");
		$("#buttonTry").removeAttr("disabled");
		$(".tryAgainButton").bind("click", function () {
			$("#buttonTry").removeClass("tryAgainButton").addClass("disabled");
			$("#buttonTry").attr("disabled", "disabled");
			$(".dropboxCenter").empty();
			$(".proLitDragBoxes").hide();
			$("#solution_div").show();
			$(".SolutionText").show();
		});

	}
};

