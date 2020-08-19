/** 
 * Gaap Controller for the Creating GAAP. 
 */
var GaapController	=	function(){}

GaapController.createGaap	=	function(){	
	//trace("DataManager.currentGaapRefNum -> "+DataManager.currentGaapRefNum);
	if(DataManager.currentGaapRefNum== "#"){
		DataManager.currentGaapRefNum = 0;
	}
	var str = "<a href='"+DataManager.configData[StaticLibrary.CONFIG_COURSE]['courseFolder']+"/resources/"+DataManager.GaapObj[DataManager.currentGaapRefNum].link+"'  target='_blank'></a>";
	$("#GAAP_PDF").html(str);
	$("#GAAP_PDF_content").html(DataManager.GaapObj[DataManager.currentGaapRefNum].label);
}
/** 
 * Gaap Controller for the updating GAAP. 
 */	
GaapController.updataGaap = function(intPdfrefNum){
	DataManager.currentGaapRefNum=intPdfrefNum;
	GaapController.createGaap();
}		
