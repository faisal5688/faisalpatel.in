var GetDescription = {};
GetDescription.holder;

GetDescription.init=function(obj){
	GetDescription.holder = obj;
}

GetDescription.displayContent=function(head,des){
	GetDescription.holder.find("#desHeader").html(head);
	GetDescription.holder.find("#description").html(des);
}
GetDescription.hidePopup=function(){	
	GetDescription.holder.hide();
}