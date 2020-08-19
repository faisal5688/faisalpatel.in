
var LinkActivityObj = {};
var LinkActivityData;
LinkActivityObj.clickVisitedArr = [];
LinkActivityObj.activityCompleted;
LinkActivityObj.activityInitialized;

/*
@for Initial Content load
*/
LinkActivityObj.initActivity=function(data){
	LinkActivityData = data;
	LinkActivityObj.activityInitialized = false;	
	$("#contentWrap").html(LinkActivityData.htmlContent);	
	
	//popup initialized
	Popup_01.init($("#shellPopupContainer"));	

	LinkActivityObj.fillTheLink();
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},60);	
	
	//if page already visited earlier
	if(MainController.getCurrentPageCompletionStatus() == 1){
		LinkActivityObj.addListeners();
	}
}

/*
@for filling the Link in the html content
*/
LinkActivityObj.fillTheLink	=	function(){
	for(var i=0;i<LinkActivityData.links.length;i++){		
		//var str	='<a id="link_'+i+'" class="clickableLnkCls"> '+LinkActivityData.links[i].text+' </a><span id="tick_'+i+'" class="tick"> tick </span>'; 
		var str	='<a id="link_'+i+'" class="clickableLnkCls">'+LinkActivityData.links[i].text+'</a><span id="tick_'+i+'" class="tick" style="display:none;"> tick </span>'; 
		$("#hyperlink_"+(i+1)).html(str);
		LinkActivityObj.clickVisitedArr.push(0);
	}
		$(".clickableLnkCls").css("cursor","default");
		$(".clickableLnkCls").css("text-decoration","underline");
	/* $(".clickableLnkCls").bind("click",LinkActivityObj.linkClickHandler); */
}

/*
@handler for link click
*/
LinkActivityObj.linkClickHandler = function(event){
	
	var intLinkNum = parseInt($(this).attr("id").substring(parseInt($(this).attr("id").indexOf("_"))+1));	
	var strLinkContent = LinkActivityData.links[intLinkNum].content;
	LinkActivityObj.clickVisitedArr[intLinkNum]=1;
/* 	var strImageTags = "";
	if(LinkActivityData.links[intLinkNum].images.length!=0){
		var strImageTags = "<div>";
			for(var i=0;i<LinkActivityData.links[intLinkNum].images.length;i++){
				strImageTags +=	"<div><img src='"+LinkActivityData.links[intLinkNum].images[i].name+"'></div>";
			}
		strImageTags += "</div>";
	} 
	strLinkContent += strImageTags;	*/
	Popup_01.showPopup(LinkActivityData.links[intLinkNum].heading,strLinkContent);
	//$("#tick_"+intLinkNum).addClass("visited").css("visibility","visible");	
	$("#link_"+intLinkNum).addClass("visited");		
}

/*
@popup Close Handler
*/
LinkActivityObj.closePopup=function(){
	Popup_01.hidePopup();	
	LinkActivityObj.chkActivityCompletion();
}

LinkActivityObj.chkActivityCompletion = function(){
	//if(LinkActivityObj.clickVisitedArr.indexOf(0) <= -1){		
	if(jQuery.inArray(0,LinkActivityObj.clickVisitedArr) <= -1){
		if(!LinkActivityObj.activityCompleted){	
			LinkActivityObj.activityCompleted = true;
			//MainController.markCurrentPageComplete();
			//MainController.showNextInstruction();
			eventMgr.dispatchCustomEvent(LinkActivityObj,"templateActivityCompleted","","");
		}		
	}
}


LinkActivityObj.addListeners = function(){
	if(!LinkActivityObj.activityInitialized){
		LinkActivityObj.activityInitialized = true;
		$(".clickableLnkCls").css("cursor","pointer");
		$(".clickableLnkCls").unbind("click",LinkActivityObj.linkClickHandler); 
		$(".clickableLnkCls").bind("click",LinkActivityObj.linkClickHandler);
		eventMgr.addControlEventListener(Popup_01, "popupClosed", LinkActivityObj.closePopup);
	}
	
}	

LinkActivityObj.pageAudioHandler = function(currTime,totTime){
	if(currTime >= totTime){				
		LinkActivityObj.addListeners();		
	}
}