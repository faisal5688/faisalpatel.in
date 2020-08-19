var SubmitButton = {};
SubmitButton.holder;

SubmitButton.init=function(obj){
	SubmitButton.holder = obj;
	SubmitButton.chkSubmitEnable(false);	
	SubmitButton.unbindEvents();
	SubmitButton.holder.on("click",function(){
		if(SubmitButton.holder.hasClass("disabled"))
			return;
		$(SubmitButton).trigger({
			type:"submitClicked",
			value:"none"
		});
		SubmitButton.chkSubmitEnable(false);
	});
}

SubmitButton.chkSubmitEnable=function(flag){
	if(flag){
		$("#buttonSub").removeClass("disabled").addClass("submitButton");
				$("#buttonSub").removeAttr("disabled","disabled");
	}else{
		$("#buttonSub").removeClass("submitButton").addClass("disabled");
				$("#buttonSub").attr("disabled","disabled");
 	}
};

SubmitButton.unbindEvents=function(){
	if(SubmitButton.holder)
		SubmitButton.holder.unbind();
}