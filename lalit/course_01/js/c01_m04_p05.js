var tabData = {};
var m02_p05c_mcms = {};
m02_p05c_mcms.activityCompleted = false;
var eventMgr = new EventManager();


m02_p05c_mcms.chkActivityCompletion = function(){	
trace("ssss");
	if(!m02_p05c_mcms.activityCompleted){
		m02_p05c_mcms.activityCompleted = true;
		MainController.markCurrentPageComplete();
		MainController.showNextInstruction();						
	}		
}
$(document).ready(function(){
       tabData = Parser.loadMCSSDataFn(DataManager.templateXMLData);  
       MCMS.initMCMS(tabData);
	   eventMgr.addControlEventListener(MCMS,"templateActivityCompleted",m02_p05c_mcms.chkActivityCompletion);
		setTimeout(function(){
		MainController.initializeTemplateInShell();			
	},50);	
	});

function pageAudioHandler(currTime,totTime){
	if(DataManager.audioFileName == DataManager.audioArray[currentPageLocationIndex]){	
		if(currTime >= totTime){	
			trace("pageAudio hander... Suraj");
			MCMS.addListeners();	
		}
	}
		else{
			MCMS.pageAudioHandler(currTime,totTime);
		}
}
