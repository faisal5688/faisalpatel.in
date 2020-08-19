
var ImgColObject = {};
var TextImageData;
ImgColObject.currentSection = 0;
ImgColObject.activityCompleted;

var evtMrg = new EventManager();
/*
@create an array for storing images refrence
*/
ImgColObject.imgRefArr = [];

ImgColObject.initTextSection=function(data){	
	TextImageData = data;

	ImgColObject.showSection();
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},200); 
}

/*
@This function call on changing of orientation, which call the ImageMain orientaion function and change the respective src.
*/
ImgColObject.onOrientationChange= function(){	
		for(var i=0;i<ImgColObject.imgRefArr.length;i++){		
			ImgColObject.imgRefArr[i].onOrientaionChange();
		}
}



ImgColObject.showSection = function(){
	ImgColObject.activityCompleted = false;
	var maincontainer = $("#textImageTwoColContainer");	
	var contentImage = new Image();
	for(var i=0; i<TextImageData.ImageSection.length; i++){	
		var ImgContainer = maincontainer.find(".tempImage").clone();
		ImgContainer.removeClass("tempImage");	
		ImgContainer.attr("id", "colImg"+i);

		$("#imgHolder").append(ImgContainer);
		/*
		@Crating image tag or background image accordingly using parameter use_image_tag
		*/		
		var contentImage = new ImageMain(ImgContainer,TextImageData.ImageSection[i].image.use_image_tag);
		contentImage.setObject(TextImageData.ImageSection[i].image);
		ImgColObject.imgRefArr.push(contentImage);
		evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, ImgColObject.onOrientationChange);
	
		
	}
	for(var t=0; t<TextImageData.ColumnSection.length; t++){
		var colContainer = maincontainer.find(".tempColumn").clone();
		colContainer.removeClass("tempColumn");	
		colContainer.attr("id", "ContentHolder"+t);
		colContainer.find("#HeadingContainer").html(TextImageData.ColumnSection[t].heading);
		colContainer.find("#TextHolder").html(TextImageData.ColumnSection[t].content);
		$("#columnContainer").append(colContainer);
	}
	
}

/* 
function pageAudioHandler(currTime,totTime){
	//trace(Math.round(currTime) +' - '+Math.round(totTime))
	if(currTime >= totTime){		
		if(!ImgColObject.activityCompleted){
			ImgColObject.activityCompleted = true;
			MainController.markCurrentPageComplete();
			MainController.showNextInstruction();
		}		
	}
}
 */