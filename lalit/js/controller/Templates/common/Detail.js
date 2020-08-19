var Detail = {};

Detail.initDetail = function(data) {
	Detail.data = data;
	Detail.bindEvents();
}


Detail.bindEvents = function() {
	$('#details_button').on('click', function(evt) {		
		//$('#fof_detail_screen_lock_shell').show();
		//$('#detail_popup_shell').show();
		Detail.showPopup();
	});

	$('#detailPopupCloseBtn_shell').on('click', function(evt) {
		$('#detail_popup_shell').hide();
		$('#fof_detail_screen_lock_shell').hide();
	});
}

Detail.showPopup = function(){
	$('#detail_popupHeader_shell').html(Detail.data.title);
	$('#detail_popupContent_shell').html(Detail.data.content);
	document.getElementById('detail_popupContent_shell').scrollTop = 0;
	$('#fof_detail_screen_lock_shell').show();
	$('#detail_popup_shell').show();
}
