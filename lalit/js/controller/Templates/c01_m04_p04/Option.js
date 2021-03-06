var Option = function(obj,typ,id){
	this.holder = obj;
	this.type = typ;
	this.ID = id+1;
	this.holder.addClass("mcssOption");
	this.holder.addClass("hiddenOption");
	this.holder.attr("id","mcOption_"+this.ID);	
	this.holder.find("#tickCross").hide();		
	
	this.addListeners = function(){								
		this.resetTickCross();
		if(this.type=="mcss"){
			this.holder.find("#optionBox").removeClass("MCSSbulletPointsDisable");		
		}
		else{			
			this.holder.find("#optionBox").removeClass("MCMSBulletPointsDisabled");		
		}
		this.holder.find("#optionBox").attr("type",this.type);
		
		this.holder.find("#optionBox").on("click",function(){
			var temp = $(this).hasClass("MCSSbulletPointsSelected")
			trace("Here:::"+temp)
			temp = $(this).attr("type")
			trace("Here1:::"+temp)
			temp = $(this).hasClass("MCMSbulletPointsSelected")
				trace("Here2:::"+temp)
			if($(this).hasClass("MCSSbulletPointsSelected") || $(this).hasClass("MCMSbulletPointsSelected") )
				return;
			if($(this).attr("type")=="mcss"){				
				$(this).addClass("MCSSbulletPointsSelected");
			}
			else{
				if($(this).hasClass("MCMSbulletPointsSelected"))
					$(this).removeClass("MCMSbulletPointsSelected")
				else
					$(this).addClass("MCMSbulletPointsSelected")
			}
			
			//trigger event
			$(this).trigger({
				type:"optionClicked",
				value:this.id
			});
		});
	}
	
	this.showOption=function(txt){
		this.holder.removeClass("hiddenOption");
		if(this.type=="mcss")
			this.holder.find("#optionBox").removeClass("MCSSbulletPointsSelected");
		else
			this.holder.find("#optionBox").removeClass("MCMSbulletPointsSelected");
		this.holder.find("#optionTxt").html(txt);
	}
	
	this.showTickCross=function(className){
		this.holder.find("#tickCross").show();
		this.holder.find("#tickCross").addClass(className);
	}

	this.resetTickCross=function(){
		this.holder.find("#tickCross").hide();
		this.holder.find("#tickCross").removeClass("mcssCross").removeClass("mcssTick");
	}	
	
	this.disable=function(){
		if(this.type=="mcss")
			this.holder.find("#optionBox").addClass("MCSSbulletPointsDisable")		
		else
			this.holder.find("#optionBox").addClass("MCMSBulletPointsDisabled")		
		this.holder.find("#optionBox").unbind();
	}
	
	this.reset=function(){
		if(this.type=="mcss")
			this.holder.find("#optionBox").removeClass("MCSSbulletPointsSelected");	
		else
			this.holder.find("#optionBox").removeClass("MCMSbulletPointsSelected");	
	}
};