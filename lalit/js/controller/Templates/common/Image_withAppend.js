
var evtMrg = new EventManager();
var ContentImg_append	=	new Image();

var ImageMain_append = function(obj,UseImageTag){
	this.id;
	this.holder	=	obj;
	this.useAsImage = UseImageTag;
	this.setObject	=	function(Data, id){
		
		if(this.useAsImage=="blank"){
			this.holder.hide();
		}else{
		this.id=id;
		this.data=Data;
		this.loadImage();
		}
	}
	
	this.loadImage = function(){
		var imgSrc="";		
		var retina = (window.retina || window.devicePixelRatio > 1);
		if(DeviceHandler.device == StaticLibrary.IPAD){
			if(DataManager.currentOrientaion == StaticLibrary.LANDSCAPE){
				imgSrc = this.data.ipad.landscape;
			}else{
				imgSrc = this.data.ipad.portrait;
			}
		}else if(DeviceHandler.device == StaticLibrary.ANDROID){	
			if(DataManager.currentOrientaion == StaticLibrary.LANDSCAPE){
				imgSrc = this.data.note.landscape;
			}else{
				imgSrc = this.data.note.portrait;
			}
		}else{
			//desktop
			imgSrc = this.data.desktop;
		}
		
		if(retina && DeviceHandler.device == StaticLibrary.IPAD){
			imgSrc = DataManager.settingDataObj.retinaImageUrl + imgSrc;
		}else{
			imgSrc = DataManager.settingDataObj.appImageURL + imgSrc;
		}		
		this.setSrc(imgSrc);	
	}
	
	
	this.setSrc	=	function(strSrc){			
		if(this.useAsImage=="true"){
			$(ContentImg_append).attr("src", strSrc);
			this.holder.append("<img id='"+this.id+"' src='"+strSrc+"'/>");
		}else if(this.useAsImage=="blank"){
			this.holder.css("background-image","");
			this.holder.hide();
			return;
		}else{		
			this.holder.append("<div id='"+this.id+"'></div>").css("background-image","url("+strSrc+")");
			this.holder.css("background-repeat","no-repeat");			
		}
		//this.holder.show();
	}
	
	this.onOrientaionChange = function(){
		if(this.useAsImage=="blank"){			
			this.holder.hide();
			return;
		}else{		
			this.loadImage(this.holder);	
		}
	}
	
}


