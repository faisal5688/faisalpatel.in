var DetailsController = function(){
	
};

/*For creating the details*/
DetailsController.createDetails	=	function(){	
	$("#detailsContent").html(DataManager.DetailsObj);
	$("#detailsContent").scrollTop(0);	
	
	$(".detailsLink").bind('click',function(){	
		DetailsController.addClassVisitedLink($(this));
	});
	
}

/*This funtion add class to link which are visited for future use*/
DetailsController.addClassVisitedLink	=	function(element){
	element.addClass("linkVisited");	
}