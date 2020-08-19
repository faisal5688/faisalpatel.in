var Fof = {};

var eventMgr = new EventManager();

Fof.initFOF = function(data) {
	Fof.data = data;
	Fof.bindEvents();
}


Fof.bindEvents = function() {
	$('#fof_button').on('click', function(evt) {
		if(!$(this).hasClass('disabled')){
			$('#fof_button').removeClass('highlight_fof');
			eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");
			
			$('#fof_popupHeader_shell').html(Fof.data.title);
			$('#fof_popupContent_shell').html(Fof.data.content);
			
			document.getElementById('fof_popupContent_shell').scrollTop = 0;
			
			$('#fof_detail_screen_lock_shell').show();
			$('#fof_popup_shell').show();
		}
	});

	$('#fofPopupCloseBtn_shell').on('click', function(evt) {
		$('#fof_popup_shell').hide();
		$('#fof_detail_screen_lock_shell').hide();
		eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
	});	
}
