var c01_m04_p08 = {
    pageContentObj: null,
    currentItem: null,
    animFlag: false,
    currentItemNo: 0,
    visitedArr: ["0"],
    curTab:null
};

var _jsonData = {}


c01_m04_p08.markPageComplete = function() {
    if (!c01_m04_p08.activityCompleted) {
        c01_m04_p08.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

c01_m04_p08.updateAudio = function(aNo) {
    c01_m04_p08.currentItemNo = aNo;
    var _audio = _jsonData['audios'][aNo];
    var _aObj = {
        path: _jsonData['basePath'] + _audio['path'],
        isAbsolute: true,
        isPopup: _audio['isPopup'] || false,
        // transcriptTxt: c01_m04_p08.data["transcript_" + aNo] || "",
        callback: function() {
            c01_m04_p08.updateMarkCompleted(aNo)
        }
    };

    try {
        AudioController.updateInternalAudio(_aObj);
    } catch (err) {

    }

   // c01_m04_p08.updateTranscript();
}

c01_m04_p08.updateMarkCompleted = function(aNo) {

    c01_m04_p08.visitedArr[aNo] = '1';
    console.log(c01_m04_p08.visitedArr)

    try {
        c01_m04_p08.currentItem.addClass('visited');
    } catch (err) {}
    if (c01_m04_p08.currentItemNo == 0) {
        c01_m04_p08.addEvents();
    } else {
        if (c01_m04_p08.visitedArr.indexOf('0') == -1) {
            c01_m04_p08.markPageComplete();
        }
    }
}

c01_m04_p08.updateTranscript = function() {
    try {
        var tTxt = c01_m04_p08.data["transcript_" + c01_m04_p08.currentItemNo] || "";
        if (tTxt != "") {
            TranscriptController.update(tTxt)
        } else {
            TranscriptController.baseTranscript()
        }
    } catch (err) {

    }
}

c01_m04_p08.init = function(data) {

    c01_m04_p08.data = data;
    c01_m04_p08.visitedArr = ["0"];
    c01_m04_p08.currentItemNo = 0;
    c01_m04_p08.activityCompleted = false;
    //  c01_m04_p08.transcriptText = [];

    $(".popupContainer").hide();
    $(".ins_text").html(c01_m04_p08.data.ins_text);
    $(".Titletxt").html(c01_m04_p08.data.Titletxt);

    $(".parentBlock .tab").each(function(i) {
        var _no = parseInt(i + 1)
            //$(this).html(data["click_" + _no]);
        $(this).data("idx", _no);
        $("#popup_" + _no + "_Container .popupText").html(data["click_" + _no + "_popup"]);
        c01_m04_p08.visitedArr.push("0");
        //   c01_m04_p08.transcriptText.push(data["transcript_" + _no]);
    });

    $("#bottomText").html(c01_m04_p08.data.bottom_text);

    //$(".ins_text").css("opacity","0")
    //MainController.setBackgroundAudio(c01_m04_p08.data.backgroundAudio)



}

c01_m04_p08.showDescPopup = function(num) {

    $("#popupContainer").attr("class", "popupContainer bg" + num);
    $(".popupOverlayBox").show();

    $(".popupContainer").show().find(".popupContentWraper").html("");
    $(".popupContainer .popupContentWraper").html(c01_m04_p08.data["click_" + num + "_text"]);

    $("#transcriptViewContent").scrollTop(0);

    $(".popupContentParent .closeBtn").addClass("enabled");
    $(".popupContentParent .closeBtn").off().on("click", function() {
        $(".popupContainer").hide();
        $(".popupOverlayBox").fadeOut();
        $(".RightBtn").removeClass("active");
        $(".leftBtn").removeClass("active");
        DataManager.pagePopUpOpenState = false;
        AudioController.playInternalAudio("blank");
        $(".parentBlock .tab").removeClass("highlight");
        if ($(".parentBlock .tab.visited").length < $(".parentBlock .tab").length) {
            var activeNext = $(".parentBlock .tab.visited").length + 1;
            $(".parentBlock .tab" + activeNext).addClass("enabled highlight");
            $(".parentBlock .tabTitle" + activeNext).fadeIn();
        }
        c01_m04_p08.currentItem = null;
        c01_m04_p08.currentItemNo = 0
       // c01_m04_p08.updateTranscript()
    });

}


c01_m04_p08.addEvents = function() {
    $(".parentBlock .tab").addClass("enabled highlight");
    // $(".parentBlock .tab").on("click", function() {
    //     if ($(this).hasClass('enabled')) {
    //         $(this).addClass("selected");
    //         var eName = $(this).attr("id");
    //         var num = parseInt(eName.slice(3, 4));
    //         // $("#popup_" + (i + 1) + "_Container .popupText").html(data["click_" + (i + 1) + "_text"])

    //         if ($(this).hasClass('switchOn')) {
    //             c01_m04_p08.currentItem = $(this);
    //             c01_m04_p08.showDescPopup(num);
    //             c01_m04_p08.updateAudio(num);
    //         } else {
    //             var selectedTab = '#popup_' + num + '_Container';
    //             $(selectedTab).show(0);
    //         }


    //         $(this).toggleClass("switchOn");
    //     }
    // });

    $(".tab .leftBtn").on("click", function() {
        var _parent = $(this).parent();
        _parent.removeClass("switchOn");
        if (_parent.hasClass('enabled')) {
            _parent.addClass("selected");
            var eName = _parent.attr("id");
            var num = parseInt(eName.slice(3, 4));
            c01_m04_p08.currentItem = _parent;  
            c01_m04_p08.curTab = $(this);
            $(".RightBtn").removeClass("active");
        $(".leftBtn").removeClass("active");
            _parent.find(".RightBtn").removeClass("active");

            setTimeout(function() {
                var selectedTab = '#popup_' + num + '_Container';
                $(".popupContainer").hide();
                c01_m04_p08.curTab.addClass("active")
                $(selectedTab).show(0);
            }, 300);
        }
    });

    $(".tab .RightBtn").on("click", function() {
        var _parent = $(this).parent();
        _parent.addClass("switchOn");
        if (_parent.hasClass('enabled')) {
            
            _parent.addClass("selected");
            var eName = _parent.attr("id");
            var num = parseInt(eName.slice(3, 4));
            c01_m04_p08.currentItem = _parent;
            c01_m04_p08.curTab = $(this);
            $(".RightBtn").removeClass("active");
        $(".leftBtn").removeClass("active");
            _parent.find(".leftBtn").removeClass("active");
            setTimeout(function() {
                c01_m04_p08.curTab.addClass("active")
                c01_m04_p08.showDescPopup(num);
                c01_m04_p08.updateAudio(num);
            }, 300);



        }
    });

    $(".popupContainer .closeBtn").off().on("click", function() {
        $(".popupContainer").fadeOut();
        $(".RightBtn").removeClass("active");
        $(".leftBtn").removeClass("active");
        

    });
}


$(document).ready(function() {
    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }

    setTimeout(function() {
        c01_m04_p08.currentItemNo == 0
        c01_m04_p08.init(_jsonData.content);
        MainController.initializeTemplateInShell();
        // c01_m04_p08.updateAudio(0);
    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {
    if (currTime >= totTime) {
        if (c01_m04_p08.currentItemNo == 0) {
            c01_m04_p08.updateMarkCompleted(c01_m04_p08.currentItemNo);
        }
    }
}