
var TextImageTwoColumnObj = {};
var TextImageTwoColumnData;
TextImageTwoColumnObj.currentSection = 0;
var evtMrg = new EventManager();
/*
@create an array for storing images refrence
*/
TextImageTwoColumnObj.imgRefArr = [];

TextImageTwoColumnObj.initTextSection=function(data){	
	TextImageTwoColumnData = data;
	//alert(TextImageTwoColumnData.sectionArr.length);
	
	TextImageTwoColumnObj.showSection();
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},200); 
}

TextImageTwoColumnObj.onOrientationChange= function(){	
	for(var i=0;i<TextImageTwoColumnObj.imgRefArr.length;i++){		
		TextImageTwoColumnObj.imgRefArr[i].onOrientaionChange();
	}
}

TextImageTwoColumnObj.showSection = function(){

	var maincontainer = $("#textImageTwoColContainer");	
	/*var contentImage = new Image();
	
	 var retinaImagePath = DataManager.settingDataObj.retinaImageUrl + TextImageTwoColumnData.image;
	var normalImagePath = DataManager.settingDataObj.appImageURL + TextImageTwoColumnData.image;
	
	var retina = (window.retina || window.devicePixelRatio > 1);
	
	if(retina && (DataManager.nAgt.indexOf("iPad")) != -1){		
		$(contentImage).attr("src", retinaImagePath);	
	}
	else{	
		$(contentImage).attr("src", normalImagePath);
	} 
	
	$(contentImage).load(function(){			
		maincontainer.find("#imgHolder").append(contentImage);
		maincontainer.find("#imgHolder").fadeIn();
		MainController.initializeTemplateInShell();
	});*/
	
	var contentImage = new ImageMain($("#textImageTwoColContainer #imgHolder"),TextImageTwoColumnData.image.use_image_tag);
	contentImage.setObject(TextImageTwoColumnData.image);
	TextImageTwoColumnObj.imgRefArr.push(contentImage);
	evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, TextImageTwoColumnObj.onOrientationChange);

	for(var t=0; t<TextImageTwoColumnData.sectionArr.length; t++){
		var colContainer = maincontainer.find(".tempColumn").clone();
		colContainer.removeClass("tempColumn");	
		colContainer.attr("id", "ContentHolder"+t);
		colContainer.find("#HeadingContainer").html(TextImageTwoColumnData.sectionArr[t].heading);
		colContainer.find("#TextHolder").html(TextImageTwoColumnData.sectionArr[t].content);
		$("#columnContainer").append(colContainer);
	}
	
}


function pageAudioHandler(currTime,totTime){
	//trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){		
		if(!TextImageTwoColumnObj.activityCompleted){
			TextImageTwoColumnObj.activityCompleted = true;
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
		}		
	}
}
