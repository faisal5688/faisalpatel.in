var c01_m00_p01 = function() {
    var _jsonData = {};
    var _txtImgObj = TextImageObj;
    var _currentScreenId = 0;
    var _currentScreenLength = 0;
    var _isActivity = true;

    this.init = function() {

        try {
            _isActivity = true;
            _activityCompleted = false;
            _isVideo = true;
            _isVideoCompleted = false
            _jsonData = DataManager.templateXMLData.data;
            _txtImgObj.initTextSection(_jsonData);
            addNextBackActivity();
        } catch (err) {
            console.error(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html("");

        setTimeout(function() {
            MainController.initializeTemplateInShell();
        }, MainController.pageInterval);
    }


    var addNextBackActivity = function() {
        if (_isActivity) {
            _activityCompleted = false;
            var _textScreensData = _jsonData.textScreens;
            var _screenStr = "";
            _currentScreenLength = _textScreensData.length - 1;
            for (var i = 0; i <= _currentScreenLength; i++) {
                var _textScreen = _textScreensData[i];
                var str = "<ul id='content_" + i + "' class='content-txt'>";
                for (var j = 0; j < _textScreen.textBox.length; j++) {
                    var textBox = _textScreen.textBox[j];
                    str += textBox.text;
                }
                str += "</ul>";
                _screenStr += str;
            }
            $(".text-screen-wrapper").html(_screenStr);
            $(".next-back-btn").data("screen-id", _currentScreenId);
            $(".btnWrapper").hide();
        } else {
            _activityCompleted = true;
        }

    }
}


$(document).ready(function() {
    var _c01_m00_p01 = new c01_m00_p01();
    _c01_m00_p01.init();
})


function pageAudioHandler(currTime, totTime) {
    trace(Math.round(currTime) + ' - ' + Math.round(totTime))
    if (parseInt(currTime) >= parseInt(totTime)) {
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    }

}