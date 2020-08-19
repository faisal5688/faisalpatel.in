
var TextImageObj = {};
var TextImageData;
TextImageObj.currentSection = 0;
var evtMrg = new EventManager();
/*
@create an array for storing images refrence
*/
TextImageObj.imgRefArr = [];

TextImageObj.initTextSection=function(data){	
	TextImageData = data;
	//alert(TextImageData.sectionArr.length);
	
	TextImageObj.showSection();
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},200); 
}

TextImageObj.onOrientationChange= function(){	
	for(var i=0;i<TextImageObj.imgRefArr.length;i++){		
		TextImageObj.imgRefArr[i].onOrientaionChange();
	}
}

TextImageObj.showSection = function(){

	var maincontainer = $("#textImageTwoColContainer");	
	/*var contentImage = new Image();
	
	 var retinaImagePath = DataManager.settingDataObj.retinaImageUrl + TextImageData.image;
	var normalImagePath = DataManager.settingDataObj.appImageURL + TextImageData.image;
	
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
	
	var contentImage = new ImageMain($("#imgHolder"),TextImageData.image.use_image_tag);
	contentImage.setObject(TextImageData.image);
	TextImageObj.imgRefArr.push(contentImage);
	evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, TextImageObj.onOrientationChange);

	for(var t=0; t<TextImageData.sectionArr.length; t++){
		var colContainer = maincontainer.find(".tempColumn").clone();
		colContainer.removeClass("tempColumn");	
		colContainer.attr("id", "ContentHolder"+t);
		colContainer.find("#HeadingContainer").html(TextImageData.sectionArr[t].heading);
		colContainer.find("#TextHolder").html(TextImageData.sectionArr[t].content);
		$("#columnContainer").append(colContainer);
	}
	
}


function pageAudioHandler(currTime,totTime){
	//trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){		
		if(!TextImageObj.activityCompleted){
			TextImageObj.activityCompleted = true;
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
		}		
	}
}
