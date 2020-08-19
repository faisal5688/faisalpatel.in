
var InputFocusController	=	function(){}

InputFocusController.initialize	=	function(){
	if(DeviceHandler.device == StaticLibrary.ANDROID)
	{
		$("input[type=text]").focusin(function() {
			
			$("#footer").hide();
		});
		
		$("input[type=text]").focusout(function() {
			
			$("#footer").show();
			$("#footer").css("bottom","-39px");
		});
	}
}