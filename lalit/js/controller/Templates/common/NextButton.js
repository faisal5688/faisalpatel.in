var NextButton = {};
NextButton.holder;

NextButton.init=function(obj){
	NextButton.holder = obj;
	NextButton.chkNextEnable(false);	
	NextButton.unbindEvents();
	NextButton.holder.on("click",function(){
		//trace(NextButton.holder.find("input").hasClass("disabled"))
		if(NextButton.holder.find("button").hasClass("disabled"))
			return;
		$(NextButton).trigger({
			type:"nextClicked",
			value:"none"
		});
		NextButton.chkNextEnable(false);
	});
}

NextButton.chkNextEnable=function(flag){
	if(flag){
		NextButton.holder.find("button").removeClass("disabled").addClass("submitButton");
	}else{
		NextButton.holder.find("button").removeClass("submitButton").addClass("disabled");
	}
};

NextButton.unbindEvents=function(){
	if(NextButton.holder)
		NextButton.holder.unbind();
}