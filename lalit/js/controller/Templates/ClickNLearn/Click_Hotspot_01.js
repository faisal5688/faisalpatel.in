
var Click_Hotspot_01 = {};
Click_Hotspot_01.data;
Click_Hotspot_01.clickVisitedArr = [];
Click_Hotspot_01.activityCompleted = false;

Click_Hotspot_01.init=function(data){
	
	$('area').bind('click', Click_Hotspot_01.areaClickHandler);
	
	Click_Hotspot_01.data	=	data;
	$("#areaContent").html(Click_Hotspot_01.data.data.cnl_v2_Items[0].content);
	setTimeout(function(){
		$('img[usemap]').rwdImageMaps();	
		MainController.initializeTemplateInShell();	
	},60);	
}


Click_Hotspot_01.createAreaContent	=	function(intItemnum){
	//trace(Click_Hotspot_01.data.data.cnl_v2_Items[intItemnum-1].label);
	//var areaLable	=	Click_Hotspot_01.data.data.cnl_v2_Items[intItemnum-1].label;	
	var areaContent	=	Click_Hotspot_01.data.data.cnl_v2_Items[intItemnum-1].content;	
	//$("#areaPopupHeader").html(areaLable);
	$("#areaContent").html(areaContent);
	Click_Hotspot_01.clickVisitedArr[intItemnum-1] = 1; 
	Click_Hotspot_01.chkActivityCompletion();
}

Click_Hotspot_01.areaClickHandler	=	function(){
	Click_Hotspot_01.createAreaContent(parseInt($(this).attr('id')));
}


Click_Hotspot_01.chkActivityCompletion = function(){
	if(Click_Hotspot_01.clickVisitedArr.indexOf(0) <= -1){
		if(!Click_Hotspot_01.activityCompleted){
			Click_Hotspot_01.activityCompleted = true;
			//MainController.markCurrentPageComplete();
			//MainController.showNextInstruction();
			eventMgr.dispatchCustomEvent(ClickNLearn,"templateActivityCompleted","","");
		}		
	}
}
