var tabData = {};
var c01_m05_p06_dnd = {};
c01_m05_p06_dnd.activityCompleted = false;
var eventMgr = new EventManager();


c01_m05_p06_dnd.chkActivityCompletion = function() {
    if (!c01_m05_p06_dnd.activityCompleted) {
        c01_m05_p06_dnd.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }
}


$(document).ready(function() {

    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }

    setTimeout(function() {
        MainController.initializeTemplateInShell();
        tabData = Parser.loadDnDClassificationDataFn(DataManager.templateXMLData);
        DNDClassification.initialize(tabData);
        eventMgr.addControlEventListener(DNDClassification, "templateActivityCompleted", c01_m05_p06_dnd.chkActivityCompletion);
    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {
    if (currTime >= totTime) {
        DNDClassification.addListeners();
        //$(".imgWrapper").hide();
    }
}