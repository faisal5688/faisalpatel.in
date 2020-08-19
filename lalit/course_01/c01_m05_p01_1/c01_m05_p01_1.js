var c01_m05_p01_1 = {
    pageContentObj: null,
    currentItem: null,
    animFlag: false,
    currentItemNo: 0,
    visitedArr: ["0"]
};

var _jsonData = {}


c01_m05_p01_1.markPageComplete = function () {
    if (!c01_m05_p01_1.activityCompleted) {
        c01_m05_p01_1.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

c01_m05_p01_1.updateAudio = function (aNo) {
    c01_m05_p01_1.currentItemNo = aNo;
    var _audio = _jsonData['audios'][aNo];
    var _aObj = {
        path: _jsonData['basePath'] + _audio['path'],
        isAbsolute: true,
        isPopup: _audio['isPopup'] || false,
        // transcriptTxt: c01_m05_p01_1.data["transcript_" + aNo] || "",
        callback: function () {
            c01_m05_p01_1.updateMarkCompleted(aNo)
        }
    };

    try {
        AudioController.updateInternalAudio(_aObj);
    } catch (err) {

    }

    c01_m05_p01_1.updateTranscript();
}

c01_m05_p01_1.updateMarkCompleted = function (aNo) {

    c01_m05_p01_1.visitedArr[aNo] = '1';
    console.log(c01_m05_p01_1.visitedArr)

    try {
        c01_m05_p01_1.currentItem.addClass('visited');
    } catch (err) { }
    if (c01_m05_p01_1.currentItemNo == 0) {
        c01_m05_p01_1.addEvents();
    } else {
        if (c01_m05_p01_1.visitedArr.indexOf('0') == -1) {
            c01_m05_p01_1.markPageComplete();
        }
    }
}

c01_m05_p01_1.updateTranscript = function () {
    try {
        var tTxt = c01_m05_p01_1.data["transcript_" + c01_m05_p01_1.currentItemNo] || "";
        if (tTxt != "") {
            TranscriptController.update(tTxt)
        } else {
            TranscriptController.baseTranscript()
        }
    } catch (err) {

    }
}

c01_m05_p01_1.init = function (data) {

    c01_m05_p01_1.data = data;
    c01_m05_p01_1.visitedArr = ["0"];
    c01_m05_p01_1.currentItemNo = 0;
    c01_m05_p01_1.activityCompleted = false;
    //  c01_m05_p01_1.transcriptText = [];

    $(".popupContainer").hide();
    $(".ins_text").html(c01_m05_p01_1.data.ins_text);
    $(".Titletxt").html(c01_m05_p01_1.data.Titletxt);

    $(".parentBlock .tab").each(function (i) {
        var _no = parseInt(i + 1)
        $(this).html(data["click_" + _no]);
        $(this).data("idx", _no);
        c01_m05_p01_1.visitedArr.push("0");
        //   c01_m05_p01_1.transcriptText.push(data["transcript_" + _no]);
    });

    $("#bottomText").html(c01_m05_p01_1.data.bottom_text);

    //$(".ins_text").css("opacity","0")
    //MainController.setBackgroundAudio(c01_m05_p01_1.data.backgroundAudio)

}

c01_m05_p01_1.showDescPopup = function (num) {

    $("#popupContainer").attr("class", "popupContainer bg" + num);
    $(".popupOverlayBox").show();

    $(".popupContainer").show().find(".popupContentWraper").html("");
    $(".popupContainer .popupContentWraper").html(c01_m05_p01_1.data["click_" + num + "_text"]);

    $("#transcriptViewContent").scrollTop(0);

    $("#popupContainer .closeBtn").addClass("enabled");
    $("#popupContainer .closeBtn").off().on("click", function () {
        $(".popupContainer").hide();
        $(".popupOverlayBox").fadeOut();
        DataManager.pagePopUpOpenState = false;
        AudioController.playInternalAudio("blank");
        $(".parentBlock .tab").removeClass("highlight");
        if ($(".parentBlock .tab.visited").length < $(".parentBlock .tab").length) {
            var activeNext = $(".parentBlock .tab.visited").length + 1;
            $(".parentBlock .tab" + activeNext).addClass("enabled highlight");
            $(".parentBlock .tabTitle" + activeNext).fadeIn();
        }
        c01_m05_p01_1.currentItem = null;
        c01_m05_p01_1.currentItemNo = 0
        c01_m05_p01_1.updateTranscript()
    });

}


c01_m05_p01_1.addEvents = function () {
    $(".parentBlock .tab").addClass("enabled highlight");
    $(".parentBlock .tab").on("click", function () {
        if ($(this).hasClass('enabled')) {
            $(this).addClass("selected");
            var eName = $(this).attr("id");
            var num = parseInt(eName.slice(3, 4));
            c01_m05_p01_1.currentItem = $(this);
            c01_m05_p01_1.showDescPopup(num);
            c01_m05_p01_1.updateAudio(num);
        }
    });
}


$(document).ready(function () {
    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }

    setTimeout(function () {
        c01_m05_p01_1.currentItemNo == 0
        c01_m05_p01_1.init(_jsonData.content);
        MainController.initializeTemplateInShell();
        // c01_m05_p01_1.updateAudio(0);
    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {
    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)
    if (currTime >= totTime) {
        if (c01_m05_p01_1.currentItemNo == 0) {
            c01_m05_p01_1.updateMarkCompleted(c01_m05_p01_1.currentItemNo);
            $(".piller_1,.piller_2,.piller_3,.piller_4").addClass("inactive")
        }
    }
    // if (c01_m05_p01_1.currentItemNo == 0) {
    //     switch (_cTime) {
    //         case 0:
               
    //             break;
    //         case 4:
                
    //             break;

    //         case 18:
                
    //             break;
    //         default:
    //             break;
    //     }
    // }
}

