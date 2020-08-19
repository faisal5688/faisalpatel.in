
var TextImageObjSpecific = {};
var TextImageDataSpecific;
TextImageObjSpecific.currentSection = 0;
var evtMrg = new EventManager();

/*
@ this array store the refrence of the content images
*/
TextImageObjSpecific.imgRefArr = [];

TextImageObjSpecific.initTextSection=function(data){	
	TextImageDataSpecific = data;
	TextImageObjSpecific.showSection(0);

}

/*
@on orientaion change this function changes the images src and load it
*/
TextImageObjSpecific.onOrientationChange= function(){	
		for(var i=0;i<TextImageObjSpecific.imgRefArr.length;i++){		
			TextImageObjSpecific.imgRefArr[i].onOrientaionChange();
		}
}


TextImageObjSpecific.showSection = function(ind){
	var container = $("#textImageContainerSpecific #sectionHolderSpecific");	 
	
	/*
	@ this create new image object and set it according to the type whether to use as image tag or background image
	*/
	var contentImage = new ImageMain($("#container2 #imageHolder"),TextImageDataSpecific.image.use_image_tag);
	var contentImage2 = new ImageMain($(".secondImg #imageHolder"),TextImageDataSpecific.image.use_image_tag);
	contentImage.setObject(TextImageDataSpecific.image);
	contentImage2.setObject(TextImageDataSpecific.image);
	TextImageObjSpecific.imgRefArr.push(contentImage);
	TextImageObjSpecific.imgRefArr.push(contentImage2);
	evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, TextImageObjSpecific.onOrientationChange);
	
	
	container.find("#contentHolder").html(TextImageDataSpecific.content);
	MainController.initializeTemplateInShell();
}






