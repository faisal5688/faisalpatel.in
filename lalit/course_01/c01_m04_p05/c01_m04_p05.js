var c01_m04_p05 = function () {
    this.init = function () {
        try {
            _jsonData = DataManager.templateXMLData.data;

            DND_OneToOne.initialize(DataManager.templateXMLData);
            eventMgr.addControlEventListener(DND_OneToOne, "templateActivityCompleted", this.chkActivityCompletion);
        }
        catch (err) {
            console.log(err);
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title)

        setTimeout(function () {
            MainController.initializeTemplateInShell();
        }, MainController.pageInterval);
    },

    this.chkActivityCompletion = function () {
        trace("ssss");
        if (!page15_dnd_o.activityCompleted) {
            page15_dnd_o.activityCompleted = true;
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();
        }
    }
}

$(document).ready(function () {
    $(".mainContent .section").show();
    var _c01_m04_p05 = new c01_m04_p05();
    _c01_m04_p05.init();
});

function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m04_p05.playHead_new == _cTime) {
        return;
    }

    if (_cTime >= _tTime) {
        DND_OneToOne.addListeners();
    }

    switch (_cTime) {
        default:
            break;
    }

    c01_m04_p05.playHead_new = _cTime;
}