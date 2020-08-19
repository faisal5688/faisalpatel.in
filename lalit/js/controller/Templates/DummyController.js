var DummyController = {};
DummyController.activityCompleted = false;

DummyController.init=function(data){			
	setTimeout(function(){
		MainController.initializeTemplateInShell();	
	},200);
}




