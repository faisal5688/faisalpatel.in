var ClickNLearnWithImage = {};
ClickNLearnWithImage.currentClickId
ClickNLearnWithImage.clickVisitedArr = [];
ClickNLearnWithImage.mainContainer
ClickNLearnWithImage.activityInitialized = false;
ClickNLearnWithImage.activityCompleted
ClickNLearnWithImage.clickArray = [];
ClickNLearnWithImage.listenerAdded = false;

ClickNLearnWithImage.initClickables = function(data) {
	ClickNLearnWithImage.activityInitialized = false;
	var ClickData = data;
	var imagePath = 'course_01/images/';
	var clickableContainer = $('#clickableContainer');
	var template = clickableContainer.find(".tempClickable");

	for (var t = 0; t < ClickData.contents.length; t++) {
		$('#content_' + (t + 1)).html(ClickData.contents[t]);
	}

	$('#feedbackContent').html(ClickData.feedback);
	
	for (var t = 0; t < ClickData.clickables.length; t++) {
		var clickMC = template.clone();
		clickMC.removeClass("tempClickable");

		var clickable = ClickData.clickables[t];

		clickMC.find('.clickableImage').css({
			backgroundImage : 'url("' + imagePath + clickable.image + '")'
		}).attr('id', 'clickable_' + (t + 1));
		clickMC.find('.content').html(clickable.content).attr('id', 'itemContent_' + (t + 1));
		clickMC.find('.tick').attr('src', imagePath + clickable.tick).attr('id', 'tick_' + (t + 1));

		clickableContainer.append(clickMC);

		ClickNLearnWithImage.clickVisitedArr.push(0);
	}

	template.remove();

	setTimeout(function() {
		MainController.initializeTemplateInShell();
	}, 60);

	if(ClickData.fof){
		Fof.initFOF (ClickData.fof);
		$('#fof_button_holder').show();
		$('#fof_note').show();
	}else{
		$('#fof_button_holder').hide();
		$('#fof_note').hide();
	}
		
	if (ClickData.detail) {
		Detail.initDetail(ClickData.detail);
		$('#details_button_area').show();
	} else {
		$('#details_button_area').hide();
	}

	ClickNLearnWithImage.addListeners(ClickData.clickables.length);
}

ClickNLearnWithImage.addListeners = function(len) {
	if (!ClickNLearnWithImage.activityInitialized) {
		ClickNLearnWithImage.activityInitialized = true;
		for (var i = 1; i <= len; i++) {
			$('#clickable_' + i).on('click', ClickNLearnWithImage.handleClick);
		}
		
		$('#p38_feedback').on('click',ClickNLearnWithImage.showFeedback);
		
		$('#feedbackClose').on('click',function(){
			$('#p38_feedback_popup').hide();
			$('#fof_button_holder').show();
		});
	}
}

ClickNLearnWithImage.handleClick = function(evt) {
	var num = evt.target.id.split('_')[1];
	$('.clickableItem').removeClass('clickableItem-selected');
	$('.content').hide();
	$('#itemContent_' + num).fadeIn();
	$('#tick_' + num).fadeIn();
	$(evt.target).parent().addClass('clickableItem-selected');

	ClickNLearnWithImage.clickVisitedArr[num - 1] = 1;

	ClickNLearnWithImage.checkActivityCompletion();
}

ClickNLearnWithImage.checkActivityCompletion = function() {
	var sum = 0;
	for (var i = 0; i < ClickNLearnWithImage.clickVisitedArr.length; i++) {
		sum += ClickNLearnWithImage.clickVisitedArr[i];
	}

	if (sum == ClickNLearnWithImage.clickVisitedArr.length) {
		//$('#content_2').show();
		ClickNLearnWithImage.markClickNLearnWithImageComplete();		
	}
}

ClickNLearnWithImage.showFeedback = function(){	
	$('#p38_feedback_popup').show();
	$('#fof_button_holder').hide();
	ClickNLearnWithImage.markClickNLearnWithImageComplete();	
}

ClickNLearnWithImage.markClickNLearnWithImageComplete = function() {
	m01_p38.markPageComplete();	
	ClickNLearnWithImage.activityCompleted = true;
	MainController.markCurrentPageComplete();
	MainController.showNextInstruction();
	eventMgr.dispatchCustomEvent(ClickNLearnWithImage, "templateActivityCompleted", "", "");
}
