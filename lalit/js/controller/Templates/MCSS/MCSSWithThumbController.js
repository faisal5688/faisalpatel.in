var MCSS = {};
MCSS.questionData = {};
MCSS.optionArr = [];
MCSS.mainContainer;
MCSS.maxOptions = 4;
MCSS.prevOption;
MCSS.userAnswer;
MCSS.correctAnswer;
MCSS.currentAttempt;
MCSS.activityInitialized;
MCSS.activityCompleted = false;
MCSS.audioEnded = false;
MCSS.letters = ["A", "B", "C", "D"];

MCSS.initMCSS = function(data) {

    MCSS.latencyStartTime = new Date();
    MCSS.mainContainer = $("#mcssContainer").find("#mcssHolder");
    MCSS.questionData = data;
    MCSS.currentAttempt = 0;
    MCSS.activityInitialized = false;

    Feedback.init($("#mcssFeedbackBox"), $(".feedbackContainment"));
    eventMgr.addControlEventListener(Feedback, "feedbackClosed", MCSS.closeFeedback);

    SubmitButton.init($("#mcssHolder").find("#mcssSubmitBtn"));
    eventMgr.addControlEventListener(SubmitButton, "submitClicked", MCSS.submitClicked);

    MCSS.createOptions();
    MCSS.disableOptions();

    //MCSS.addListeners();

    MCSS.showQuestion();
    MCSS.mainContainer.find("#mcssNextBtn").hide();
    $("#mcssContainer").prepend("<div class='page_title'></div>");

    var _pageTitle = DataManager.TOCData[currentPageLocationIndex].title;

    $('.page_title').html(_pageTitle);

    setTimeout(function() {
        MainController.initializeTemplateInShell();
    }, MainController.pageInterval);

    if (MainController.getCurrentPageCompletionStatus() == 1) {
        MCSS.addListeners();
    }

    //initialise FOF content popup
    if (MCSS.questionData.fof) {
        Fof.initFOF(MCSS.questionData.fof);
        $('#fof_button_holder').show();
        $('#fof_note').show();
    } else {
        $('#fof_button_holder').hide();
        $('#fof_note').hide();
    }

    //initialise Detail content popup
    if (MCSS.questionData.detail) {
        Detail.initDetail(MCSS.questionData.detail);
        $('#details_button_area').show();
    } else {
        $('#details_button_area').hide();
    }

    MCSS.addListeners();
}

MCSS.pageAudioHandler = function(currTime, totTime) {
    //trace(Math.round(currTime) +" && "+Math.round(totTime));
    if ((parseInt(currTime) != 0) && (parseInt(totTime) != 0) && (parseInt(currTime) >= parseInt(totTime))) {
        if (!MCSS.audioEnded) {
            //MCSS.addListeners();	
            MCSS.audioEnded = true;
        };
    }
}

MCSS.createOptions = function() {

    var _tocData = DataManager.TOCData[currentPageLocationIndex];

    var pageData = _tocData.pageData;

    var _mcssContainer = $("#mcssContainer")
    _mcssContainer.addClass(pageData)

    if (_tocData.isInteraction == 'true') {
        _mcssContainer.addClass('iOption')
    }

    //create clone options for assessment	
    for (var o = 0; o < MCSS.maxOptions; o++) {

        var option = $(MCSS.mainContainer.find("#mcssOptionContainer").find(".cloneOption")).clone();

        option.removeClass("cloneOption");

        if (_tocData.isInteraction == 'true') {
            try {
                option.addClass('iOption')
                var _lable = MCSS.letters[o]
                var _imgURL = './course_01/images/' + pageData + "_" + parseInt(o + 1) + '.jpg'
                option.find(".option_lable").html(_lable);
                option.find(".option_img").attr('src', _imgURL);
            } catch (err) {
                console.error(err)
            }

        } else {
            try {
                var _lable = MCSS.letters[o]
                var _imgURL = './course_01/images/kc_bg_' + parseInt(o + 1) + '.jpg'
                option.find(".option_lable").html(_lable);
                option.find(".option_img").attr('src', _imgURL);
            } catch (err) {
                console.error(err)
            }

        }
        //  option.attr('data-lable', _lable)
        //  option.attr('data-img', _imgURL)

        var opt = new Option(option, "mcss", o);
        MCSS.optionArr.push(opt);
        eventMgr.addControlEventListener(opt.holder, "optionClicked", MCSS.mcssOptionClicked);
        MCSS.mainContainer.find("#mcssOptionContainer").append(opt.holder)
    }
};

MCSS.addListeners = function() {
    //addlisteners to buttons	
    if (!MCSS.activityInitialized) {
        MCSS.activityInitialized = true;
        for (var o = 1; o <= MCSS.optionArr.length; o++) {
            var option = MCSS.optionArr[o - 1];
            option.addListeners();
        }
    }
};

MCSS.showQuestion = function() {
    MCSS.initializeMCSS();
};

/*MCSS functionality*/
MCSS.initializeMCSS = function() {
    MCSS.userAnswer = [];
    MCSS.correctAnswer = [];
    MCSS.activityCompleted = false;
    if (mcssData.scenarioText && mcssData.scenarioText.length > 2) {
        $("#mcssContainer #mcssScenarioTxt").html(mcssData.scenarioText);
    } else {
        $("#mcssContainer #mcssScenarioTxt").hide();
        $(".mcmsContainer").css("margin", "0");
    }
    $("#mcssContainer").find("#mcssQuestionTxt").html(MCSS.questionData.question);
    $("#mcssContainer").find("#mcssInstructionTxt").html(MCSS.questionData.instructionText);
    MCSS.correctAnswer = MCSS.questionData.correctAnswer.split(",");
    $("#mcssContainer").find(".mcssOption").addClass("hiddenOption");

    if ((DataManager.nAgt.indexOf("Android") != -1)) {
        //update for android Note 8
        $("#mcssHolder").css("min-height", "390px");
        $("#mcssContainer").css("margin-top", "0%")
    }
    for (c = 0; c < MCSS.questionData.options.length; c++) {
        var option = MCSS.optionArr[c];
        option.showOption(MCSS.questionData.options[c]);
    }
    setTimeout(function() {
        //mainController.initializeTemplateInShell();
    }, 20);
}

MCSS.resetMCSS = function() {
    MCSS.userAnswer = [];
    MCSS.prevOption = null;
    for (c = 0; c < MCSS.questionData.options.length; c++) {
        var option = MCSS.optionArr[c];
        option.reset();
    }
}

MCSS.mcssOptionClicked = function(evt) {

    var clicked = $(evt.target).parent().parent();
    if (MCSS.prevOption) {
        MCSS.prevOption.find("#optionBox").removeClass("MCSSbulletPointsSelected");
        MCSS.prevOption.removeClass("MCSSbulletPointsSelected");
    }

    MCSS.prevOption = clicked;
    clicked.addClass("MCSSbulletPointsSelected");
    var str = clicked.attr("id");
    MCSS.userAnswer[0] = str.split("_")[1];
    AudioController.playInternalAudio("blank");
    SubmitButton.chkSubmitEnable(true);
}

MCSS.submitClicked = function(evt) {
    MCSS.disableOptions();
    MCSS.chkUserAnswer();
};

MCSS.disableOptions = function() {
    for (var c = 1; c <= MCSS.maxOptions; c++) {
        var option = MCSS.optionArr[c - 1];
        option.disable();
    }
}

MCSS.chkUserAnswer = function() {
    var tempArr = [];
    tempArr = MCSS.correctAnswer.concat();

    var result = "Incorrect";
    if (tempArr[0] == MCSS.userAnswer[0]) {
        result = 'Correct';
    }
    MCSS.showFeedback(result, Number(MCSS.userAnswer[0]));

    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        var selectedOptName = MCSS.letters[parseInt(MCSS.userAnswer[0]) - 1],
            correctOptName = MCSS.letters[parseInt(tempArr[0]) - 1];
        MCSS.sendCMIInteractionData(result, selectedOptName, correctOptName);
    }

};

MCSS.showFeedback = function(result, selectedOption) {
    MCSS.currentAttempt++;
    var ans = "<ul>";
    for (c = 0; c < MCSS.questionData.options.length; c++) {
        if (MCSS.correctAnswer.indexOf((c + 1) + "") > -1) {
            ans += "<li>" + MCSS.questionData.options[c] + "</li>";
        }
    }

    ans += "</ul>";

    if (MCSS.questionData.responseType == 'specific') {

        var _fTxt = MCSS.questionData.specificResponse.response[selectedOption - 1].content;
        var _showResponseWithCorrect = MCSS.questionData.showResponseWithCorrect || "yes";

        if (_showResponseWithCorrect == "yes") {
            if (result != 'Correct') {
                var tempArr = [];
                tempArr = MCSS.correctAnswer.concat();
                _fTxt += '<br/>' + MCSS.questionData.specificResponse.response[tempArr[0] - 1].content;
            }
        }
        Feedback.showFeedback(_fTxt);
    } else {
        if (result == 'Correct') {
            Feedback.showFeedback(MCSS.questionData.feedback.genericResponse.correct.content);
        } else {
            Feedback.showFeedback(MCSS.questionData.feedback.genericResponse.incorrect.content);
        }
    }

    MCSS.showSolution();
    MCSS.markPageComplete();
}

MCSS.showFeedback_old = function(result) {

    MCSS.currentAttempt++;
    DataManager.transcriptView_initX = $("#mcssFeedbackBox").css('left');
    DataManager.transcriptView_initY = $("#mcssFeedbackBox").css('top');
    $("#feedbackContent").animate({ scrollTop: 0 }, 10);

    if (MCSS.questionData.responseType == "generic") {
        if (result == "Correct") {
            Feedback.showFeedback(MCSS.questionData.genericResponse.correct.content);
            MCSS.showTickOnly();
        } else {
            if (MCSS.currentAttempt < MCSS.questionData.maxAttempts) {
                Feedback.showFeedback(MCSS.questionData.genericResponse.incorrect.content);
            } else {
                Feedback.showFeedback(MCSS.questionData.genericResponse.solution.content);
                MCSS.showSolution();
            }
        }
    } else {

        var feedStr = "";
        for (var c = 0; c < MCSS.userAnswer.length; c++) {
            feedStr += MCSS.questionData.specificResponse.response[MCSS.userAnswer[c] - 1].content;
            if (c > 0) {
                feedStr += "<br>"
            }
        }



        //AudioController.playInternalAudio(MCSS.questionData.specificResponse.response[MCSS.userAnswer-1].audio);

        //uncomment the line, if for specific response we require the instruction to de displayed.

        /*if(MCSS.currentAttempt >= MCSS.questionData.maxAttempts){
        		 feedStr += "Correct answer is displayed on screen."
        }*/


        if (result == "Correct") {
            MCSS.showTickOnly();
        } else {
            if (MCSS.currentAttempt >= MCSS.questionData.maxAttempts) {
                MCSS.showSolution();
            }
        }

        Feedback.showFeedback(feedStr);
    }
};

MCSS.closeFeedback = function() {
    trace("close");
    if (MCSS.activityCompleted)
        return;
    if (MCSS.currentAttempt < MCSS.questionData.maxAttempts) {
        MCSS.activityInitialized = false;
        MCSS.addListeners();
        MCSS.resetMCSS();
    }
};

MCSS.showTickOnly = function() {
    for (var u = 0; u < MCSS.userAnswer.length; u++) {
        var option = MCSS.optionArr[MCSS.userAnswer[u] - 1];
        option.showTickCross("mcssTick");
    }
    MCSS.markPageComplete();

}

MCSS.showSolution = function() {
    for (c = 1; c <= MCSS.questionData.options.length; c++) {
        var option = MCSS.optionArr[c - 1];
        //if(MCSS.correctAnswer.indexOf(c.toString())>=0)		
        if (jQuery.inArray(c.toString(), MCSS.correctAnswer))
            option.showTickCross("mcssCross");
        else
            option.showTickCross("mcssTick");
    }
    MCSS.markPageComplete();

}

MCSS.markPageComplete = function() {
    if (!MCSS.activityCompleted) {
        MCSS.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
        eventMgr.dispatchCustomEvent(MCSS, "templateActivityCompleted", "", "");
    }
}

//randomization
MCSS.randomizeArr = function(arr) {
    var randomizeArr = arr.concat();
    randomizeArr.sort(MCSS.shuffle);
    return randomizeArr;
};

MCSS.shuffle = function() {
    var ran = 0.5 - Math.random();
    return ran;
};


MCSS.sendCMIInteractionData = function(result, selectedOptName, correctOptName) {

    var _tocData = DataManager.TOCData[currentPageLocationIndex];

    if (_tocData.isInteraction == 'true') {

        var _courseId = DataManager['courseDetail']['id'] || "FIRM-19-WB"

        try {
            //logic for sending data to scorm wrapper
            var latencyEndTime = new Date();
            //cmi.interactions.n.id	
            var _iID = _tocData.interactionID;

            //var _interactionID = DataManager.objectivePageArr.indexOf(_iID);
            var questionID = _courseId + "_KC" + _iID;
            //cmi.interactions.n.time

            var timeStr = convertNumToString(latencyEndTime.getHours()) + ":" + convertNumToString(latencyEndTime.getMinutes()) + ":" + convertNumToString(latencyEndTime.getSeconds());
            //cmi.interactions.n.type
            var cmiType = "choice";
            //cmi.interactions.n.correct_responses
            var correctResponse = correctOptName.toString();
            //cmi.interactions.n.weighting
            var weightage = "1";
            //cmi.interactions.n. student_response
            var userResponse = selectedOptName.toString();
            //cmi.interactions.n.result
            var userResult = result.toLowerCase();
            if (userResult == "incorrect")
                userResult = "wrong";
            //cmi.interactions.n.latency
            var latency = MCSS.calculateLatencyTime(MCSS.latencyStartTime, latencyEndTime);
            //sendInteractionDataToSCROM();
        } catch (err) {
            console.error(err)
        }

        try {
            SCORMAPIService.setInteractionData(questionID, cmiType, timeStr, latency, weightage, correctResponse, userResponse, userResult, _iID, DataManager.objectivePageArr.length);
        } catch (err) {
            console.error(err)
        }

    }

};


MCSS.calculateLatencyTime = function(startTime, endTime) {
    var timeStr = "";
    var hours = endTime.getHours() - startTime.getHours();
    var minutes = endTime.getMinutes() - startTime.getMinutes();
    var seconds = endTime.getSeconds() - startTime.getSeconds();
    var time = (seconds + (minutes * 60) + (hours * 60 * 60));
    //trace(hours+'#'+minutes+"#"+seconds+"#"+time);
    var min = 0;
    var sec = 0;
    if (time < 60) {
        sec = time;
        //timeStr ="PT" +hours+"H"+minutes+"M"+seconds+"S";
    } else if (time < 3600) {
        min = (parseInt(time / 60));
        sec = (time % 60);
        //timeStr ="PT" +hours+"H"+min+"M"+sec+"S";
    } else {
        hours = parseInt(time / 3600);
        min = parseInt(parseInt(time % 3600) / 60);
        sec = parseInt(parseInt(time % 3600) % 60);
        //timeStr ="PT" +hours+"H"+min+"M"+sec+"S";
    }
    timeStr = convertNumToString(hours) + ":" + convertNumToString(min) + ":" + convertNumToString(sec);
    return timeStr;
};

function convertNumToString(num) {
    var str;
    if (num < 10)
        str = "0" + num;
    else
        str = num.toString();
    return str;
};