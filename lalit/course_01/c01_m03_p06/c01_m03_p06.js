var c01_m03_p06 = {

};


c01_m03_p06.data;
c01_m03_p06.visitedArr = ["0"];
c01_m03_p06.currentItem = null;
c01_m03_p06.currentItemNo = 0;
c01_m03_p06.isMoving = false;

var _jsonData = {}

c01_m03_p06.markPageComplete = function () {
    if (!c01_m03_p06.activityCompleted) {
        c01_m03_p06.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

c01_m03_p06.updateAudio = function (aNo) {
    c01_m03_p06.currentItemNo = aNo;
    var _audio = _jsonData['audios'][aNo];
    var _aObj = {
        path: _jsonData['basePath'] + _audio['path'],
        isAbsolute: true,
        isPopup: _audio['isPopup'] || false,
        callback: function () {
            c01_m03_p06.updateMarkCompleted(aNo)
        }
    };

    try {
        AudioController.updateInternalAudio(_aObj);
    } catch (err) {

    }

    //c01_m03_p06.updateTranscript();
}


c01_m03_p06.updateTranscript = function () {
    try {
        var tTxt = c01_m03_p06.data["transcript_" + c01_m03_p06.currentItemNo] || "";
        if (tTxt != "") {
            TranscriptController.update(tTxt)
        } else {
            TranscriptController.baseTranscript();
            $("#transcriptViewContent .trans").hide();
            $("#transcriptViewContent .trans_" + c01_m03_p06.currentItemNo).show()
        }
    } catch (err) {

    }
}


c01_m03_p06.init = function (data) {

    c01_m03_p06.data = data;

    c01_m03_p06.activityCompleted = false;
    c01_m03_p06.visitedArr = ["0"];
    c01_m03_p06.transcriptText = [];

    $(".popupContainer").hide();

    $(".intro_text").html(c01_m03_p06.data.intro_text);
    $(".ins_text").html(c01_m03_p06.data.ins_text);

    $(".btnContainer .tab").each(function (i) {
        $(this).html(data["click_" + (i + 1)]);
        $(this).data("idx", (i + 1));
        $("#popup_" + (i + 1) + "_Container .popupText").html(data["click_" + (i + 1) + "_text"])
        c01_m03_p06.visitedArr.push("0");
        c01_m03_p06.transcriptText.push(data["transcript_" + (i + 1)]);
    });

    $("#bottomText").html(c01_m03_p06.data.bottom_text);
    //$(".btnContainer .tab1main").css("opacity",0);

}

c01_m03_p06.hideShowScrollInst = function (popupID) {
    var uAgnet = navigator.userAgent;
    if (uAgnet.indexOf(StaticLibrary.IPAD) >= 0) {
        c01_m03_p06.isMoving = false;
        var scrollElem = $(".popup_group #popup_" + popupID + "_Container .popupText");

        function hasScrollBar() {
            return scrollElem.get(0).scrollHeight > scrollElem.height();
        }
        if (hasScrollBar())
            $(".vMore").show();
    }
}

c01_m03_p06.showDescPopup = function (num) {
    $(".btnContainer .closeBtn").hide();
    // $(".popupContainer").hide()
    var selectedTab = '#popup_' + num + '_Container';
    $(selectedTab).show(0);
    if (num != 4)
        c01_m03_p06.hideShowScrollInst(num);
    else
        $(".vMore").hide(0);

}


c01_m03_p06.updateMarkCompleted = function (aNo) {

    // console.log("c01_m03_p06.updateAudio    ", c01_m03_p06.currentItemNo)

    c01_m03_p06.visitedArr[aNo] = '1';

    try {
        c01_m03_p06.currentItem.addClass('visited')
    } catch (err) {

    }

    if (c01_m03_p06.currentItemNo == 0) {
        c01_m03_p06.addEvents();
    } else {

        var _tabs = $(".btnContainer .tab");
        $(_tabs).removeClass("enabled");
        $(_tabs[aNo]).addClass("enabled");

        if (c01_m03_p06.visitedArr.indexOf('0') == -1) {
            c01_m03_p06.markPageComplete();
        }
    }

    //  console.log(c01_m03_p06.visitedArr, aNo)

}

c01_m03_p06.addEvents = function () {

    var _tabs = $(".btnContainer .tab")
    $(_tabs[0]).addClass("enabled");

    _tabs.off().on("click", function () {

        var _tab = $(this);

        if (!_tab.hasClass('enabled')) return;

        if (_tab.hasClass('selected')) return;

        // if (c01_m03_p06.currentItem == undefined || c01_m03_p06.currentItem.attr('id') != _tab.attr('id') && _tab.hasClass("enabled")) {

        _tabs.removeClass("selected");
        _tab.addClass("selected");

        if (!_tab.hasClass('visited')) {
            $(".btnContainer .closeBtn").removeClass("enabled");
        }

        var eName = _tab.attr("id");
        var num = parseInt(eName.slice(3, 4));

        c01_m03_p06.currentItem = _tab;
        c01_m03_p06.showDescPopup(num);
        c01_m03_p06.updateAudio(num);
        c01_m03_p06.updateMarkCompleted(num)
        // }
    });

    $("#revealBoxLink_1").off().on("click", function () {
        $(".popup_container").fadeIn();
        DataManager.pagePopUpOpenState = true;
        $("#popup_content").html(c01_m03_p06.data.reveal_text1);
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
        c01_m03_p06.currentItemNo = 0
        c01_m03_p06.init(_jsonData.content);
        MainController.initializeTemplateInShell();
        //c01_m03_p06.updateMarkCompleted(c01_m03_p06.currentItemNo);
        //  c01_m03_p06.updateAudio(0);
    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m03_p06.playHead_new == _cTime) {
        return;
    }

    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {
        //MainController.markCurrentPageComplete();
        //MainController.showNextInstruction();
    }

    if (currTime >= totTime) {
        if (c01_m03_p06.currentItemNo == 0) {
            setTimeout(function () {
                $(".tab").removeClass("enabled");
                c01_m03_p06.updateMarkCompleted(c01_m03_p06.currentItemNo);
            }, 700);

        }
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section.section1").fadeIn();
            $(".ins_text p").fadeOut().hide();
            break;
        case 48:
            $(".ins_text p").fadeIn();
            break;
        default:
            break;
    }
   
}