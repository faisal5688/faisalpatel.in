var c01_m02_p01 = {
    pageContentObj: null,
    currentItem: null,
    animFlag: false,
    currentItemNo: 0,
    visitedArr: ["0"]
};
var c01_m02_p01_playHead = -1;
var _jsonData = {}


c01_m02_p01.markPageComplete = function() {
    // console.log("markPageComplete:  ")
    if (!c01_m02_p01.activityCompleted) {
        c01_m02_p01.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    };
};

c01_m02_p01.updateAudio = function(aNo) {
    c01_m02_p01.currentItemNo = aNo;
    var _audio = _jsonData['audios'][aNo];
    var _aObj = {
        path: _jsonData['basePath'] + "/" + _audio['path'],
        isAbsolute: true,
        isPopup: _audio['isPopup'] || false,
        callback: function() {
            /*if (aNo == 2) {
                c01_m02_p01.addEventsForActivity();
            } else {
                c01_m02_p01.updateMarkCompleted(aNo)
            }*/
            c01_m02_p01.updateMarkCompleted(aNo);
        }
    };

    try {
        AudioController.updateInternalAudio(_aObj);
    } catch (err) {

    }
    c01_m02_p01.updateTranscript();
}


c01_m02_p01.updateMarkCompleted = function(aNo) {
    c01_m02_p01.visitedArr[aNo] = '1';
    console.log(c01_m02_p01.visitedArr)
    try {
        c01_m02_p01.currentItem.addClass('visited');
    } catch (err) {}
    if (c01_m02_p01.currentItemNo == 0) {
        c01_m02_p01.addEvents();
    } else {
        if (c01_m02_p01.visitedArr.indexOf('0') == -1) {
            c01_m02_p01.markPageComplete();
        }
    }
}

c01_m02_p01.updateTranscript = function() {
    try {
        var tTxt = c01_m02_p01.data["transcript_" + c01_m02_p01.currentItemNo] || "";
        if (tTxt != "") {
            TranscriptController.update(tTxt)
        } else {
            TranscriptController.baseTranscript()
        }
    } catch (err) {

    }
}

c01_m02_p01.init = function(data) {

    c01_m02_p01.data = data;
    c01_m02_p01.visitedArr = ["0"];
    c01_m02_p01.currentItemNo = 0;
    c01_m02_p01.activityCompleted = false;

    $(".popupContainer").hide();
    $(".ins_text").html(c01_m02_p01.data.ins_text);
    $(".Titletxt").html(c01_m02_p01.data.Titletxt);

    $(".parentBlock .tab").each(function(i) {
        $(this).html(data["click_" + (i + 1)]);
        $(this).data("idx", (i + 1));
        c01_m02_p01.visitedArr.push("0");
        //  c01_m02_p01.transcriptText.push(data["transcript_" + (i + 1)]);
    });

    $("#bottomText").html(c01_m02_p01.data.bottom_text);
    //$(".ins_text").css("opacity","0")
    //MainController.setBackgroundAudio(c01_m02_p01.data.backgroundAudio)

}

c01_m02_p01.addEventsForActivity = function(num) {

    console.clear();

    var _radioOptions = $("#popupContainer .radioOption");
    _radioOptions.attr('disabled', false);

    var _btn_submit = $("#popupContainer .btn_submit");
    _btn_submit.addClass('disabled').removeClass('active')

    var _selectedOptions = ["0", "0", "0", "0"];

    if (_radioOptions) {
        _btn_submit.addClass("disabled");
        _btn_submit.off().on("click", function() {

            var _item = $(this);
            if (_item.hasClass('disabled')) return;
            console.clear();
            var _isResult = true;
            $.each(_selectedOptions, function(i, item) {
                var _option = $(item)
                    // console.log(i, _option.attr('class'))
                if (_option.hasClass('cOption')) {
                    _option.parent().addClass("correct")
                } else {
                    _option.parent().addClass("incorrect");
                    _isResult = false
                }
            })
            _item.addClass("disabled").removeClass('active');
            _radioOptions.attr('disabled', true);
            //  console.log(_isResult)
            c01_m02_p01.updateMarkCompleted(c01_m02_p01.currentItemNo);
        })

        _radioOptions.off().on("click", function() {
            var _option = $(this);
            var _id = _option.attr("id");
            var _tempArr = _id.split("_")
            var _gNo = parseInt(_tempArr[1])
            var _oNo = parseInt(_tempArr[2])
            _selectedOptions[_gNo - 1] = _option;
            if (_selectedOptions.indexOf('0') == -1) {
                _btn_submit.removeClass("disabled").addClass('active');
            }
            console.log(_id, _gNo, _oNo)
        }).attr('disabled', false)
    }
}

c01_m02_p01.showDescPopup = function(num) {

    $("#popupContainer").attr("class", "popupContainer bg" + num);
    $(".popupOverlayBox").show();

    $(".popupContainer").show().find(".popupContentWraper").html("");
    $(".popupContainer .popupContentWraper").html(c01_m02_p01.data["click_" + num + "_text"]);

    //$("#popupContainer .closeBtn").addClass("active");
    $("#popupContainer .closeBtn").off().on("click", function() {
        if (!$(this).hasClass("active")) return;
        $(".popupContainer").hide();
        $(".popupOverlayBox").fadeOut();
        DataManager.pagePopUpOpenState = false;
        AudioController.playInternalAudio("blank");
        $(".parentBlock .tab").removeClass("highlight");
        if ($(".parentBlock .tab.visited").length < $(".parentBlock .tab").length) {
            var activeNext = $(".parentBlock .tab.visited").length + 1;
            $(".parentBlock .tab" + activeNext).addClass("active highlight");
            $(".parentBlock .tabTitle" + activeNext).fadeIn();
        }
        c01_m02_p01.currentItem = null;
        c01_m02_p01.currentItemNo = 0;
        c01_m02_p01.updateTranscript();
    });


}



c01_m02_p01.addEvents = function() {
    $(".parentBlock .tab").addClass("active highlight");
    $(".parentBlock .tab").on("click", function() {
        if ($(this).hasClass('active')) {
            $(this).addClass("selected");
            var eName = $(this).attr("id");
            var num = parseInt(eName.slice(3, 4));
            c01_m02_p01.currentItem = $(this);
            c01_m02_p01.showDescPopup(num);
            c01_m02_p01.updateAudio(num);
        }
    });
}


$(document).ready(function() {
    try {
        _jsonData = DataManager.templateXMLData.data;
    } catch (err) {
        console.log(err)
    }

    setTimeout(function() {
        c01_m02_p01.currentItemNo = 0
        c01_m02_p01.init(_jsonData.content);
        MainController.initializeTemplateInShell();
        //  c01_m02_p01.updateAudio(0);

    }, MainController.pageInterval);

});

function pageAudioHandler(currTime, totTime) {
    if (currTime >= totTime) {
        if (c01_m02_p01.currentItemNo == 0) {
            c01_m02_p01.updateMarkCompleted(c01_m02_p01.currentItemNo);
        }
    }

    if (currTime >= totTime) {
        $(".popupContentParent .closeBtn").addClass("active");
        //$(".popup_1 .popup_content .popup_inst").fadeIn();
    }
    var secs = parseInt(currTime);
    if (c01_m02_p01_playHead == secs) {
        return;
    }
    c01_m02_p01_playHead = secs;



    // if (c01_m02_p01.currentItemNo == 1 || c01_m02_p01.currentItemNo == "1") {
    //     switch (secs) {
    //         case 3:
    //             $(".popup_1 .popup_content ul li").eq(0).fadeIn();
    //             break;
    //         case 10:
    //             $(".popup_1 .popup_content ul li").eq(1).fadeIn();
    //             break;
    //         case 17:
    //             $(".popup_1 .popup_content ul li").eq(2).fadeIn();
    //             break;
    //         case 24:
    //             $(".popup_1 .popup_content ul li").eq(3).fadeIn();
    //             break;

    //         default:
    //             break;
    //     }

    //     if (currTime >= totTime) {
    //         $("#popupContainer .closeBtn").addClass("active");
    //         $(".popup_1 .popup_content .popup_inst").fadeIn();
    //     }
    // }

    // if (c01_m02_p01.currentItemNo == 2 || c01_m02_p01.currentItemNo == "2") {
    //     switch (secs) {
    //         case 3:
    //             $(".popup_2 .popup_content ul li").eq(0).fadeIn();
    //             break;
    //         case 6:
    //             $(".popup_2 .popup_content ul li").eq(1).fadeIn();
    //             break;
    //         case 12:
    //             $(".popup_2 .popup_content ul li").eq(2).fadeIn();
    //             break;


    //         default:
    //             break;
    //     }

    //     if (currTime >= totTime) {
    //         $("#popupContainer .closeBtn").addClass("active");
    //         $(".popup_2 .popup_content .popup_inst").fadeIn();
    //     }
    // }

    switch (secs) {
        case 0:

            break;
        default:
            break;
    }

}