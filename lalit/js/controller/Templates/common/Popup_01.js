var Popup_01 = {};
Popup_01.holder;

Popup_01.init=function(obj){
	
	Popup_01.holder = obj;
	Popup_01.holder.hide();
	Popup_01.holder.find("#popupClose").unbind();
	Popup_01.holder.find("#popupClose").on("click",Popup_01.closePopup);
}

Popup_01.showPopup=function(head,content){
	Popup_01.holder.find("#popupHeader").html(head);
	Popup_01.holder.find("#popupContent").html(content);
	Popup_01.holder.find("#popupContent").scrollTop(0);
	Popup_01.holder.show();
	Popup_01.holder.find("#popupContent").scrollTop(0);
}

Popup_01.closePopup=function(){
	Popup_01.hidePopup();
	//alert("called")
	$(Popup_01).trigger({
			type:"popupClosed",
			value:"none"
	});
};

Popup_01.hidePopup=function(){	
	Popup_01.holder.hide();
}