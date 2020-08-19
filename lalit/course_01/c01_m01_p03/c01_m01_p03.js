var c01_m01_p03 = {

};


c01_m01_p03.data;
c01_m01_p03.visitedArr = ["0"];
c01_m01_p03.currentItem = null;
c01_m01_p03.currentItemNo = 0;
c01_m01_p03.isMoving = false;

var _jsonData = {}

c01_m01_p03.markPageComplete = function () {
    if (!c01_m01_p03.activityCompleted) {
        //MainController.markCurrentPageComplete();
        //MainController.showNextInstruction();
        $(".dummyBtn").show();

        setTimeout(function () {
            var _tabs = $(".btnContainer .tab");
            _tabs.removeClass("selected");
            $(_tabs).addClass("enabled");
            $(".popupContainer").hide()
            c01_m01_p03.activityCompleted = true;
            AudioController.playInternalAudio("c01_m01_p03_2");
        }, 3000)
    };
};

c01_m01_p03.updateAudio = function (aNo) {
    c01_m01_p03.currentItemNo = aNo;
    var _audio = _jsonData['audios'][aNo];
    var _aObj = {
        path: _jsonData['basePath'] + _audio['path'],
        isAbsolute: true,
        isPopup: _audio['isPopup'] || false,
        callback: function () {
            c01_m01_p03.updateMarkCompleted(aNo)
        }
    };

    try {
        AudioController.updateInternalAudio(_aObj);
    } catch (err) {

    }

    //c01_m01_p03.updateTranscript();
}


c01_m01_p03.updateTranscript = function () {
    try {
        var tTxt = c01_m01_p03.data["transcript_" + c01_m01_p03.currentItemNo] || "";
        if (tTxt != "") {
            TranscriptController.update(tTxt)
        } else {
            TranscriptController.baseTranscript();
            $("#transcriptViewContent .trans").hide();
            $("#transcriptViewContent .trans_" + c01_m01_p03.currentItemNo).show()
        }
    } catch (err) {

    }
}


c01_m01_p03.init = function (data) {

    c01_m01_p03.data = data;

    c01_m01_p03.activityCompleted = false;
    c01_m01_p03.visitedArr = ["0"];
    c01_m01_p03.transcriptText = [];

    $(".popupContainer").hide();

    $(".intro_text").html(c01_m01_p03.data.intro_text);
    $(".ins_text").html(c01_m01_p03.data.ins_text);

    $(".btnContainer .tab").each(function (i) {
        $(this).html(data["click_" + (i + 1)]);
        $(this).data("idx", (i + 1));
        $("#popup_" + (i + 1) + "_Container .popupText").html(data["click_" + (i + 1) + "_text"])
        c01_m01_p03.visitedArr.push("0");
        c01_m01_p03.transcriptText.push(data["transcript_" + (i + 1)]);
    });

    $("#bottomText").html(c01_m01_p03.data.bottom_text);
    //$(".btnContainer .tab1main").css("opacity",0);

}

c01_m01_p03.hideShowScrollInst = function (popupID) {
    var uAgnet = navigator.userAgent;
    if (uAgnet.indexOf(StaticLibrary.IPAD) >= 0) {
        c01_m01_p03.isMoving = false;
        var scrollElem = $(".popup_group #popup_" + popupID + "_Container .popupText");

        function hasScrollBar() {
            return scrollElem.get(0).scrollHeight > scrollElem.height();
        }
        if (hasScrollBar())
            $(".vMore").show();
    }
}

c01_m01_p03.showDescPopup = function (num) {
    $(".btnContainer .closeBtn").hide();

    $(".popupContainer").hide()
    var selectedTab = '#popup_' + num + '_Container';
    $(selectedTab).show(0);
    if (num != 4)
        c01_m01_p03.hideShowScrollInst(num);
    else
        $(".vMore").hide(0);

}


c01_m01_p03.updateMarkCompleted = function (aNo) {

    // console.log("c01_m01_p03.updateAudio    ", c01_m01_p03.currentItemNo)

    c01_m01_p03.visitedArr[aNo] = '1';

    try {
        c01_m01_p03.currentItem.addClass('visited')
    } catch (err) {

    }

    if (c01_m01_p03.currentItemNo == 0) {
        c01_m01_p03.addEvents();
    } else {

        var _tabs = $(".btnContainer .tab");
        $(_tabs).removeClass("enabled");
        $(_tabs).addClass("enabled");
        $(".visited").addClass("enabled");

        
    }
    if (c01_m01_p03.visitedArr.indexOf('0') == -1) {
        c01_m01_p03.markPageComplete();
    }
      console.log(c01_m01_p03.visitedArr, aNo)

}

c01_m01_p03.addEvents = function () {

    var _tabs = $(".btnContainer .tab")
    $(_tabs).addClass("enabled");

    _tabs.off().on("click", function () {

        var _tab = $(this);

        //if (!_tab.hasClass('enabled')) return;

        if (_tab.hasClass('selected')) return;

        // if (c01_m01_p03.currentItem == undefined || c01_m01_p03.currentItem.attr('id') != _tab.attr('id') && _tab.hasClass("enabled")) {

        _tabs.removeClass("selected");
        _tab.addClass("selected");

        if (!_tab.hasClass('visited')) {
            $(".btnContainer .closeBtn").removeClass("enabled");
        }

        var eName = _tab.attr("id");
        var num = parseInt(eName.slice(3, 4));

        c01_m01_p03.currentItem = _tab;
        c01_m01_p03.showDescPopup(num);
        c01_m01_p03.updateAudio(num);
        c01_m01_p03.updateMarkCompleted(num)

       
        // }
    });

    $("#revealBoxLink_1").off().on("click", function () {
        $(".popup_container").fadeIn();
        DataManager.pagePopUpOpenState = true;
        $("#popup_content").html(c01_m01_p03.data.reveal_text1);
        $(".popupContainerWrapper, .blocker, .btnContainer .closeBtn ").fadeIn();
    });

    $(".btnContainer .closeBtn").off().on("click", function () {
        $(".popup_container").fadeOut();
        DataManager.pagePopUpOpenState = false;
        $(".popupContainerWrapper, .blocker, .btnContainer .closeBtn").fadeOut();
    });

}

$(document).ready(function () {
    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }

    setTimeout(function () {
        c01_m01_p03.currentItemNo = 0
        c01_m01_p03.init(_jsonData.content);
        MainController.initializeTemplateInShell();
        //c01_m01_p03.updateMarkCompleted(c01_m01_p03.currentItemNo);
        //  c01_m01_p03.updateAudio(0);

    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {

    if (currTime >= totTime) {
        if (c01_m01_p03.currentItemNo == 0) {
            c01_m01_p03.updateMarkCompleted(c01_m01_p03.currentItemNo);
        }
    }

    if (c01_m01_p03.activityCompleted && currTime == totTime) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
        $(".dummyBtn").hide();
    }
}