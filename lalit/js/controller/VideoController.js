/** 
 * video Controller for the video Application. 
 */
var VideoController	=	function(){}

VideoController.handleVideoElement	=	function(e){
	var videoOBJ= $("#videoObj");			
	AudioController.createAudioElement();
	$("#introAnimation").hide();
	$("#wrapperCont").css("visibility","visible");;
	NextBackController.updateNextControl();
}
	
		
