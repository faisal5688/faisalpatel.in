var Clickable_Image = function(obj,n,data){	
	this.holder = obj;
	this.id = n+1;
	this.holder.attr("id","click_"+this.id);		
	this.holder.find("#heading").html(data.label);
	//this.holder.find("#imgHolder img").attr("src",(data.image));			
	this.holder.on("click",function(){
		//trace("click "+this.id)
		$(this).trigger({
			type:"tabClicked",
			value:this.id
		});
	});	
	return this.holder;
};