var ResourceController = function(){
	
};

/*For creating the resources*/
ResourceController.createResource	=	function(){	

	var strResourceLink	=	"<ul>";
	for(var i=0;i<DataManager.ResourceObj.length;i++){	

		if(DataManager.ResourceObj[i].type == "internal"){
			strResourceLink	+=	"<li><a  class='resourceLink' id='res_link_"+DataManager.ResourceObj[i].id+"' href='"+DataManager.configData.course.courseFolder+DataManager.ResourceObj[i].link+"' target='_blank'>"+DataManager.ResourceObj[i].link_name+"</a></li>";	
		}else{
			strResourceLink	+=	"<li><a class='resourceLink' id='res_link_"+DataManager.ResourceObj[i].id+"' href='"+DataManager.ResourceObj[i].link+"' target='_blank'>"+DataManager.ResourceObj[i].link_name+"</a></li>";	
		}
	}
	strResourceLink	+=	"</ul>";
	$("#resourceContent").html(strResourceLink);
	$("#resourceContent").scrollTop(0);	
	
	$(".resourceLink").bind('click',function(){	
		ResourceController.addClassVisitedLink($(this));
	});
	
}

/*This funtion add class to link which are visited for future use*/
ResourceController.addClassVisitedLink	=	function(element){
	element.addClass("linkVisited");	
}
