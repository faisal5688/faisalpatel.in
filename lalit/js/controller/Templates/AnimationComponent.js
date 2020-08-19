animObject = {};
animObject.activityCompleted = false;
animObject.animdata = "";
animObject.animdata1 = "";
animObject.animationEnded = false;
animObject.animPlayStaus = false;
animObject.callBackFn = null;
animObject.loadDataFn = null;
animObject.popupopen = false;
var eventMgr = new EventManager();
animObject.videoEndedFlag = false;

animObject.initAnimComponent = function(animdata, callBackFn, loadDataFn){
	animObject.activityCompleted = false;
	animObject.animdata = animdata;
	animObject.animdata1 = animdata;
	animObject.animationEnded = false;
	animObject.animPlayStaus = false;
	animObject.callBackFn = callBackFn;
	animObject.loadDataFn = loadDataFn;
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
		//Add Video Object
		animObject.addVideoComponent();
		$(".introOverlay").fadeIn();
		$(".introPopup").fadeIn(0).addClass('animated fadeInDown');
		$("#navigatorPlayPauseBtn").next('span').html("Play");
		$("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
	},200);
	setTimeout(function(){
		$("#navigatorPlayPauseBtn").next('span').html("Play");
		$("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
		if(!animObject.popupopen){
			$(".introOverlay").fadeIn();
			$(".introPopup").fadeIn(0).addClass('animated fadeInDown');
		}
	}, 1000);
	
	//eventMgr.addControlEventListener(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, animObject.PlayPauseAnimation);
};

animObject.checkInterval  = 50.0;
animObject.lastPlayPos    = 0;
animObject.currentPlayPos = 0;
animObject.bufferingDetected = false;
animObject.interval = {};
animObject.checkBuffering = function() {
	var player = document.getElementById('videoPlayer');
    animObject.currentPlayPos = player.currentTime

    // checking offset, e.g. 1 / 50ms = 0.02
    var offset = 1 / animObject.checkInterval;

    // if no buffering is currently detected,
    // and the position does not seem to increase
    // and the player isn't manually paused...
	//console.log("animObject.bufferingDetected:"+animObject.bufferingDetected);
	//console.log("animObject.currentPlayPos:"+animObject.currentPlayPos);
	//console.log("animObject.lastPlayPos:"+animObject.lastPlayPos);
    if (animObject.currentPlayPos <= (animObject.lastPlayPos)){
       animObject.bufferingDetected = true
    }
	else {
      animObject.bufferingDetected = false;
    }
    // if we were buffering but the player has advanced,
    // then there is no buffering // && !player.paused
    if(animObject.bufferingDetected == true || animObject.bufferingDetected == "true"){
		$("#loadingContainer").css("display","block");
		//console.log("In side If..");
	}
	else{
		 $("#loadingContainer").css("display","none");
		// console.log("In side Else..");
	}
    animObject.lastPlayPos = animObject.currentPlayPos;
}

//Video Component
animObject.addVideoComponent = function() {
	if (animObject.animdata.video && (animObject.animdata.video != "")) {
		var videoVolume = 0;
		if (DataManager.AudioElementvalume) {
			videoVolume = 1;
		};
		var videoFile = '' + DataManager.configData.course.courseFolder + '/media/video/' + animObject.animdata.video;
		var videoSize = {"width": 600, "height": 480};
		if (animObject.animdata.videoDimension && animObject.animdata.videoDimension.split(",").length == 2) {
			videoSize.width = animObject.animdata.videoDimension.split(",")[0];
			videoSize.height = animObject.animdata.videoDimension.split(",")[1];
		};
		animObject.animPlayStaus = false;
		//animObject.disablePlayPause();
		var videoStr = '<video id="videoPlayer" preload="auto">';
		videoStr += '<source src="' + videoFile + '.mp4" type="video/mp4">';
		videoStr += 'Your browser does not support the video tag.';
		videoStr += '</video>';
		$('#videoHolder').html(videoStr);
		$('#videoHolder').find('video')[0].volume = videoVolume;
		$('#videoHolder').show();
		//$('.VideoBtn').show();
		$('.VideoContent').show();
		$('#bottom_blank').show();
		animObject.animdata = "";
		$('.VideoBtn').off("click");
		$('.VideoBtn').on("click", function() {
			$("#videoHolder video")[0].play();
			animObject.videoEndedFlag = false;
			if (animObject.loadDataFn) {
				animObject.loadDataFn();
			};
		});
		$("#videoHolder video").off("ended");
		$("#videoHolder video").on("ended",function(){
			animObject.videoEndedFlag = true;
			animObject.disablePlayPause();
			if (animObject.callBackFn) {
				setTimeout(function() {
					animObject.callBackFn();
				}, 1000);
			} else {
				animObject.markPageComplete();
			};
			clearInterval(MainController.intervalValue);
			$("#loadingContainer").css("display","none");
		});
		
		$("#videoHolder video").on("loadstart",function(event){
			if (DeviceHandler.device != StaticLibrary.IPAD) {
				//$("#loadingContainer").css("display","block");		
			}
		});
		
		$("#videoHolder video").on("pause",function(event){
			clearInterval(MainController.intervalValue);
			$("#loadingContainer").css("display","none");
		});
		
		$("#videoHolder video").on("canplay",function(event){
			$("#loadingContainer").css("display","none");
		});
		
		$("#videoHolder video").on("play", function() {
			DataManager.AudioPlayStaus=true;
			MainController.hideLoading();
			setTimeout(function() {
				$("#btnSkip").show();
			}, 500);
			if (DeviceHandler.device != StaticLibrary.IPAD) {
				clearInterval(MainController.intervalValue);
				$("#loadingContainer").css("display","none");
				animObject.lastPlayPos = 0;
				MainController.intervalValue = setInterval(animObject.checkBuffering, animObject.checkInterval);
			}
			
			animObject.animdata = animObject.animdata1;
			animObject.animPlayStaus = true;
			$("#navigatorPlayPauseBtn").parent().addClass("pause").removeClass("play").removeClass("disabled");
			$("#navigatorPlayPauseBtn").next('span').html("Pause");
			//$("#navigatorPlayPauseBtn").attr("title", "Pause");
			setTimeout(function() {
				$('.VideoBtn').hide();
				$('.VideoContent').hide();
				$('#bottom_blank').hide();
				//$('#bottomNav_transcript').addClass('disabled');
			}, 100);
			$(this).off("play");
		});
		$("#videoHolder video").on("loadedmetadata",function(){
			if (animObject.loadDataFn) {
				animObject.loadDataFn();
			};
		});
		$('video').bind('contextmenu',function() { return false; });
		$(".introPopup .okBtn").on("click",function(){
			animObject.popupopen = true;
			$(".introPopup").addClass('animated fadeOutUp');
			setTimeout(function(){
				$(".introOverlay, .introPopup").fadeOut();
				$('#videoHolder').find('video')[0].play();
				$("#navigatorPlayPauseBtn").parent().addClass("pause").removeClass("play").removeClass("disabled");
			}, 1000);			
		});
		
	};
};

//Audio handler
animObject.pageAudioHandler = function(currTime, totTime) {
	//$("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
	if((parseInt(currTime) != 0) && (parseInt(totTime) != 0) && (parseInt(currTime) >= parseInt(totTime))){
		
	};
};

//On Page Complete
animObject.markPageComplete = function(){
	if(!animObject.activityCompleted){
		animObject.activityCompleted = true;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();
	};
};

//On Page Unload Event
animObject.onPageUnloadedFromShell = function() {
	$('#videoHolder').find('video').remove();
	animObject.animationEnded = false;
	animObject.animPlayStaus = false;
	animObject.animdata = "";
	eventMgr.removeControlEventListener(document, StaticLibrary.ON_PAGE_UNLOADED, animObject.onPageUnloadedFromShell);
};

//Play/Pause Animation
animObject.PlayPauseAnimation = function() {
	var video = $('#videoHolder').find('video')[0];
	var pageCompleted = false;
	//console.error(animObject.animPlayStaus);
	trace("animObject.videoEndedFlag:"+animObject.videoEndedFlag)
	if(!video || animObject.videoEndedFlag){
		return;
	}
	//alert($('.VideoBtn').is(":visible"));
	trace("animObject.animPlayStaus:"+animObject.animPlayStaus)
	if (!$('.VideoBtn').is(":visible")) {		
		if(animObject.animPlayStaus) {	
			clearInterval(MainController.intervalValue);
			$("#loadingContainer").css("display","none");
			$('#videoHolder').find('video')[0].pause();
			$("#navigatorPlayPauseBtn").next('span').html("Play");
			//$("#navigatorPlayPauseBtn").attr("title", "Play");
			$("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause");
			animObject.animPlayStaus = false;			
		} else {
			if(DataManager.audioPausedByLearner){
				return;
			}
			if($('#clickNextInfo').css('display') == 'block')
			{
				pageCompleted = true;
			}
			if (!$("#navigatorPlayPauseBtn").parent().hasClass("disabled") || ($('#videoHolder').find('video')[0].paused && !homeBtnClicked  && !pageCompleted && !animObject.videoEndedFlag)){
				$('#videoHolder').find('video')[0].play();
				if (DeviceHandler.device != StaticLibrary.IPAD) {
					clearInterval(MainController.intervalValue);
					$("#loadingContainer").css("display","none");
					animObject.lastPlayPos = 0;
					MainController.intervalValue = setInterval(animObject.checkBuffering, animObject.checkInterval);
				}
				$("#navigatorPlayPauseBtn").next('span').html("Pause");
				//$("#navigatorPlayPauseBtn").attr("title", "Pause");
				$("#navigatorPlayPauseBtn").parent().addClass("pause").removeClass("play");				
			}
			animObject.animPlayStaus = true;
		};	
	};
};

//Play/Pause Animation
animObject.updateAnimationVolume = function() {
	var videoVolume = 0;
	if (DataManager.AudioElementvalume) {
		videoVolume = 1;
	};
	$('#videoHolder').find('video')[0].volume = videoVolume;
};

//Disable Play / Pause Animation
animObject.disablePlayPause = function(){
	$("#navigatorPlayPauseBtn").next('span').html("Play");
	//$("#navigatorPlayPauseBtn").attr("title", "");
	$("#navigatorPlayPauseBtn").parent().addClass("play").removeClass("pause").addClass("disabled");
};