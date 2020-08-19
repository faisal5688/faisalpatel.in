var AssetPreloader = {};
var eventMgr = new EventManager();
var loadAssetArr = [];
var imgCounter = 0;
var retina = (window.retina || window.devicePixelRatio > 1);

AssetPreloader.loadAsset = function(arr){
	loadAssetArr = arr.concat();	
	imgCounter = 0;
	AssetPreloader.HandlePageAssetLoading()
}

AssetPreloader.HandlePageAssetLoading = function(){	
	var imgObjs = new Image();
	imgObjs.onload = AssetPreloader.imageLoadingDoneSuccessHandler;
	imgObjs.onerror = AssetPreloader.imageLoadingErrorHandler;
	
	if(retina && DeviceHandler.device == StaticLibrary.IPAD){
		imgObjs.src = DataManager.settingDataObj.retinaImageUrl + tempPathArr[imgCounter];
	}else{
		imgObjs.src = DataManager.settingDataObj.appImageURL + tempPathArr[imgCounter];
	}
	//imgObjs.src = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] +"/images/"+tempPathArr[imgCounter];
	//trace("imgObjs.src "+imgObjs.src)
}


AssetPreloader.imageLoadingDoneSuccessHandler = function(){
	imgCounter++;		
	if(imgCounter >= tempPathArr.length){
		imgCounter = 0;
		eventMgr.dispatchCustomEvent(AssetPreloader,StaticLibrary.ASSET_LOADED,"","");						
	}else{		
		AssetPreloader.HandlePageAssetLoading();
	}
};


AssetPreloader.imageLoadingErrorHandler=function(event){
	trace("Images downloading Failed.....");
	AssetPreloader.imageLoadingDoneSuccessHandler();
};

	