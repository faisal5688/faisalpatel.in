var FavoriteController = function(){
	
}

/**
This is used to get the favorites which are set by user

**/
FavoriteController.getFavorite = function(){	

	var strFavorite	=	"<ul>";	
	for(var i=0;i<DataManager.favoriteArray.length;i++){	
		if(DataManager.favoriteArray[i]!="NaN" && DataManager.favoriteArray[i]!=NaN)
			{		
		
			var intPageId	=	parseInt(DataManager.favoriteArray[i]);
			if(intPageId==currentPageLocationIndex){
				strFavorite	+=	"<li id='fav_"+i+"'><a class='currentFav' id='fav_link_"+DataManager.favoriteArray[i]+"' onclick='FavoriteController.goToFavorite("+intPageId+");'>"+DataManager.TOCData[intPageId].title+"</a></li><li class='lineBreak'></li>";
			}else{
				strFavorite	+=	"<li id='fav_"+i+"'><a id='fav_link_"+DataManager.favoriteArray[i]+"' onclick='FavoriteController.goToFavorite("+intPageId+");'>"+DataManager.TOCData[intPageId].title+"</a></li><li class='lineBreak'></li>";		
			
			}
		}
	}
	strFavorite	+=	"</ul>";
	$("#favoritesViewContent").html(strFavorite);
	$("#favoritesViewContent").scrollTop(0);	
}
/**
This is used to set the favorites by user

**/
FavoriteController.setFavorite = function(){
	
	if(!$(".bookmark").hasClass("added")){	
		$(".bookmark").addClass("added");	
		DataManager.favoriteArray.push(currentPageLocationIndex);
		$("#bookmarkViewContent").html("Your bookmark is added.");
		
	}else{
		DataManager.favoriteArray.splice($.inArray(currentPageLocationIndex, DataManager.favoriteArray),1);
		$(".bookmark").removeClass("added");
		$("#bookmarkViewContent").html("Your bookmark is removed.");
	}
	
	if(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"]!="local")
	{
		ScormWrapper.updateSCOVariables();
	}
	//FunctionLibrary.showPopup("#bookmarkStatusView");	
}

/**
This is used to set the favorites by user
**/
FavoriteController.checkFavorite = function(){	
	//alert("indexx  "+ $.inArray(currentPageLocationIndex,DataManager.favoriteArray))
	if($.inArray(currentPageLocationIndex,DataManager.favoriteArray) == -1){		
		$(".bookmark").removeClass("added");
	}
	else{	
		$(".bookmark").addClass("added");		
	}
}

/**
This is used to go to the favorites page 
**/
FavoriteController.goToFavorite = function(intPageId){
	if(currentPageLocationIndex!=parseInt(intPageId)){	
		$("#navigatorFavoritesBtn").removeClass("active");
		$('.iosSlider').iosSlider('goToSlide', intPageId + 1);		
		//TranscriptController.CreateTranscript(XMLParser.getTranscriptContent(DataManager.templateXMLData), 0);			
		FunctionLibrary.hideAnimationPopup($("#navigatorFavoritesBtn"),"#favoritesView");		
		MainController.PageLoader(parseInt(intPageId));
	}
	
}