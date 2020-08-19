var Clickable_Image = function(obj,n,data){	
	this.holder = obj;
	this.id = n+1;
	this.holder.attr("id","click_"+this.id);		
	this.holder.find("#heading").html(data.label);
	
	if(data.image=="blank"){
		
		this.holder.find("#imgHolder img").remove();	
	}
	else{
		this.holder.find("#imgHolder img").attr("src",(data.image));			
	}
	
	this.addListeners = function(){	

		this.holder.on("click",function(){		
			$(this).trigger({
				type:"tabClicked",
				value:this.id
			});
		});	
		this.holder.hover(function(){
			if(DeviceHandler.device == StaticLibrary.DESKTOP)
			{
				$(this).addClass("hover");
			}
		},function(){
			if(DeviceHandler.device == StaticLibrary.DESKTOP)
			{
				$(this).removeClass("hover");
			}
		});		
	}
	this.removeListeners=function(){
		this.holder.unbind();
	}
	//return this.holder;
};