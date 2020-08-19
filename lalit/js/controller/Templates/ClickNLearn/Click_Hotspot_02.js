
var Click_Hotspot_02 = {};
Click_Hotspot_02.data;


Click_Hotspot_02.init=function(data){
	Click_Hotspot_02.data = data;
	$('img[usemap]').rwdImageMaps();
	$('area').bind('click', Click_Hotspot_02.areaClickHandler);
	$('#areaPopupClose').bind('click', Click_Hotspot_02.areaPopupCloseHandler);	
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
}


Click_Hotspot_02.createAreaContent	=	function(intItemnum){
	trace(Click_Hotspot_02.data.data.cnl_v2_Items[intItemnum-1].label);
	var areaLable	=	Click_Hotspot_02.data.data.cnl_v2_Items[intItemnum-1].label;	
	var areaContent	=	Click_Hotspot_02.data.data.cnl_v2_Items[intItemnum-1].content;	
	$("#areaPopupHeader").html(areaLable);
	$("#areaPopupContent").html(areaContent);
	$("#popupContainer").show();
}
Click_Hotspot_02.areaClickHandler	=	function(){
	Click_Hotspot_02.createAreaContent(parseInt($(this).attr('id')));
}

Click_Hotspot_02.areaPopupCloseHandler	=	function(){
	$("#popupContainer").hide();
}