var TextVideoObj = {};
var TextVideoData;
TextVideoObj.currentSection = 0;
TextVideoObj.playHeadStatus
TextVideoObj.activityCompleted = false;

var eventMgr = new EventManager();
var playerObj;
var currentpos = 0;
var myInt;
var video;
var currentScreenCompleted = 0;

TextVideoObj.initSection = function(data) {

    TextVideoObj.activityCompleted = false;
    TextVideoData = data;
    TextVideoObj.init();
    eventMgr.addControlEventListener(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, handleVideoControl);
    currentScreenCompleted = parseInt(DataManager.visitedPageArray[currentPageLocationIndex])
}

TextVideoObj.init = function(ind) {
    var html = "";
    currentpos = 0;

    if (TextVideoData.content.length > 0) {
        for (var i = 0; i < TextVideoData.content.length; i++) {
            html += TextVideoData.content[i];
        }
        $('#contentHolder').html(html);
    } else {
        $('#contentHolder').hide();

    }

    var vidDimentionParts = TextVideoData.videoDimension.split(',');
    var videoFile = 'course_01/media/video/' + TextVideoData.video + '.mp4';

    var videoStr = '<video width="' + vidDimentionParts[0] + '" height="' + vidDimentionParts[1] + '" controls autoplay onseeking=\"seekVideo(this.currentTime)\" onseeked=\"seekComplete()\">';
    videoStr += '<source src="' + videoFile + '" type="video/mp4">';
    videoStr += 'Your browser does not support the video tag.';
    videoStr += '</video>';

    $('.videoHolder').html(videoStr);
    video = $(".videoHolder video")[0];

    $(".videoHolder video").off("ended");
    $(".videoHolder video").on("ended", function() {
        clearInterval(myInt);
        currentScreenCompleted = 1;
        TextVideoObj.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
    });

    setTimeout(function() {
        MainController.initializeTemplateInShell();
        $('#bottomNav_transcript').removeClass('disabled');
    }, MainController.pageInterval);

    //initialise FOF content popup
    if (TextVideoData.fof) {
        Fof.initFOF(TextVideoData.fof);
        $('#fof_button_holder').show();
        $('#fof_note').show();
    } else {
        $('#fof_button_holder').hide();
        $('#fof_note').hide();
    }
    if (!currentScreenCompleted) {
        myInt = setInterval('getpos()', 1000);
    }
}

function getpos() {
    currentpos = video.currentTime;
}

function seekComplete() {
    //alert("Complete")
    clearInterval(myInt);
    if (!currentScreenCompleted) {
        setTimeout(function() {
            myInt = setInterval('getpos()', 1000);
        }, 1000);
    }
}

function seekVideo(time) {
    if (time > currentpos && !currentScreenCompleted) {
        //  trace("time:"+time+" currentpos:"+currentpos);
        video.currentTime = currentpos;
    }
}

function pageAudioHandler(currTime, totTime) {

}

function handleVideoControl(state) {
    if (video) {
        if (state.obj == "popupOpen") {
            video.pause();
        } else {
            if (video.paused == true && !TextVideoObj.activityCompleted && !homeBtnClicked) {
                video.play();
            }
        }
    }
}