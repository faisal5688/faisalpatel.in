var DeviceHandler = {};
DeviceHandler.device;
DeviceHandler.browser;
DeviceHandler.browserVersion;

var evtMrg = new EventManager();

DeviceHandler.bindOrientaionEvent = function(){
	$(window).bind('orientationchange resize', function(e){
		//$("#transcriptView").css('left', DataManager.transcriptView_initX + 'px');
		$("#transcriptView").css('bottom', DataManager.transcriptView_initY + 'px');
		$("#mcssFeedbackBox").css('left', DataManager.feedbackView_initX + 'px');
		$("#mcssFeedbackBox").css('top', DataManager.feedbackView_initY + 'px');

			if (window.orientation == 0 || window.orientation == 180) {
			alert('This course is best viewed in the landscape orientation.');
			DataManager.currentOrientaion=StaticLibrary.PORTRAIT;
			
			$(".iosSlider").height($(".iosSlider").height()-50);
			//to set the feed bak to the center
			if(DataManager.isFeedBackOpen==true){			
				Feedback.orientationChange();
			}
			if(DataManager.isHelpOpen==true){			
				HelpController.imageChange(StaticLibrary.PORTRAIT,DataManager.nAgt);
			}
			if((DataManager.nAgt.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)))
			{
			
				$("body").height(window.innerHeight);
				$("body").css("overflow","hidden");
				$("body").css("width","100%");
				window.scrollTo(0,0); 
			
			}
		}else{
			DataManager.currentOrientaion=StaticLibrary.LANDSCAPE;
			if(DataManager.isFeedBackOpen==true){			
				Feedback.orientationChange();
			}
			if(DataManager.isHelpOpen==true && DeviceHandler.device != StaticLibrary.DESKTOP){			
				HelpController.imageChange(StaticLibrary.LANDSCAPE,DataManager.nAgt);
			}
			if((DataManager.nAgt.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)))
			{
			
				$("body").height(window.innerHeight);
				$("body").css("overflow","hidden");
				$("body").css("position","fixed");
				$("body").css("width","100%");
				window.scrollTo(0,0); 
			
			}
		}
		if(UIController.isdraggableSet==true){
			UIController.isdraggableSet=false;
		}
		//UIController.repositionDraggables();
		evtMrg.dispatchCustomEvent(document, StaticLibrary.ORIENTATION_CHANGE, "true");		
	 }).trigger('orientationchange');
	 	DataManager.orig_width=$(window).width();
		DataManager.orig_height=$(window).height();
}

DeviceHandler.detectDevice = function(){
	var uAgnet = navigator.userAgent;
	
	
	if(navigator.appName == "Microsoft Internet Explorer"){
		DeviceHandler.browser = "IE";
		
		
		var myNav = navigator.userAgent.toLowerCase();
		
		if(myNav.indexOf("msie 8.") > 0 || myNav.indexOf("msie 7.") || myNav.indexOf("msie 6."))
			DeviceHandler.browserVersion = 8;
		else
			DeviceHandler.browserVersion = 9; 
			
			
		var version =-1;
		var ua = window.navigator.userAgent
		var msie = ua.indexOf ( "MSIE " )
		if ( msie > 0 )      // If Internet Explorer, return version number
		version =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
		else                 // If another browser, return 0
		version = -1
		
		if(version==9){
			DeviceHandler.browserVersion = 9; 
		}
		

	}else{
		DeviceHandler.browser = navigator.appName;
	}
	
	if(uAgnet.indexOf(StaticLibrary.IPAD) >= 0){
			DeviceHandler.device = StaticLibrary.IPAD;
			
		}
	else if(uAgnet.indexOf(StaticLibrary.ANDROID) >= 0){
			DeviceHandler.device = StaticLibrary.ANDROID;
			
		}
	else{
			DeviceHandler.device = StaticLibrary.DESKTOP;
		}
}

//Disable elements on device

DeviceHandler.disableElementsOnDevice=function(){

/* *****shortcut variable ****** */
	var keyCodeData = DataManager.shortcutData;
/* *****shortcut variable end****** */

	if(DeviceHandler.device == StaticLibrary.ANDROID || DeviceHandler.device == StaticLibrary.IPAD){
		FunctionLibrary.showHideExitButton(true);
		$(".audio").addClass("disabled");
	}else{		
		$(document).off("keydown");
		$(document).keydown(function(evt) {
			//tab , enter
			if(evt.key =="Tab" || evt.keyCode==9 || evt.keyCode==13){
				if (!$(evt.target).hasClass("allowTab"))
					return false;
			}else{
				//trace(evt.ctrlKey +"  -  "+evt.keyCode)
				//added listenerws for navigating pages on desktop
				if(evt.ctrlKey && evt.shiftKey && evt.keyCode==keyCodeData){
					
					if($('#bodyOverlay').css('display')=='none'){
						//$('#bodyOverlay').css('display','block');				
						MainController.markCurrentPageComplete();
						if(currentPageLocationIndex == DataManager.TOCData.length - 1){
							NextBackController.disableNextButton(true);
						}
						else{
							$('.btnNext').removeClass('disabled');
						}
						//currentPageLocationIndex++;
						//setTimeout(function(){MainController.jumpToPage(currentPageLocationIndex);},100);						
					}
				}
				if(evt.ctrlKey && evt.shiftKey && evt.keyCode=='45'){
					$('#quickJump').toggle();
				}
			}
		});
	}
}

DeviceHandler.adjustIntroVideo = function(){
	if(DeviceHandler.device == StaticLibrary.ANDROID){
		$(".videoWrap").css("max-width","600px");
		$("#videoObj").css("height","420px");
		$(".videoWrap").css("top","10px");
		$(".videocanvas").css("height","420px");
		return;	
	}
	var vidHt = $("#videoObj").height();
	vidOff = (mainContainerHeight-vidHt)/2;
	$(".videoWrap").css("top",vidOff+30);
}
