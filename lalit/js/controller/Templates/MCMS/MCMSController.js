var MCMS = {};
MCMS.questionData = {};
MCMS.optionArr = [];
MCMS.mainContainer;
MCMS.maxOptions = 6;
MCMS.prevOption;
MCMS.userAnswer;
MCMS.correctAnswer;
MCMS.currentAttempt;
MCMS.activityCompleted = false;

MCMS.initMCMS = function(data) {
    MCMS.mainContainer = $("#mcmsContainer").find("#mcmsHolder");
    MCMS.questionData = data;
    MCMS.currentAttempt = 0;

    //initialize Feedback
    Feedback.init($("#mcmsFeedbackBox"), $(".mcssWrap"));
    eventMgr.addControlEventListener(Feedback, "feedbackClosed", MCMS.closeFeedback);
    //initialize submit button
    SubmitButton.init($("#mcmsHolder").find("#mcmsSubmitBtn"));
    eventMgr.addControlEventListener(SubmitButton, "submitClicked", MCMS.submitClicked);

    MCMS.createOptions();
    MCMS.disableOptions();
    //MCMS.addListeners();
    MCMS.showQuestion();

    MCMS.mainContainer.find("#mcmsNextBtn").hide();
    setTimeout(function() {
        MainController.initializeTemplateInShell();
        $(".section_01 .closeBtn").addClass("disabled");
    }, 60);
    if (DeviceHandler.device != "desktop") {
        //DataManager.isSliderLocked	= true;		
    }
    //DataManager.isSliderLocked	= true;		
}

pageAudioHandler = function(currTime, totTime) {
    //trace(currTime +" "+totTime);
    if (currTime >= totTime) {
        trace("complete audio");
        MCMS.addListeners();

        $(".section_01").fadeIn();
        $(".section_01 .closeBtn").removeClass("disabled").on("click", function() {           
            $("#mcmsHolder.section").fadeIn();
        });
    }
}

MCMS.createOptions = function() {

    //create clone options for assessment
    for (var o = 0; o < MCMS.maxOptions; o++) {
        var option = $(MCMS.mainContainer.find("#mcmsOptionContainer").find(".cloneOption")).clone();
        option.removeClass("cloneOption");
        var opt = new Option(option, "mcms", o);
        MCMS.optionArr.push(opt);
        eventMgr.addControlEventListener(opt.holder, "optionClicked", MCMS.mcmsOptionClicked);
        MCMS.mainContainer.find("#mcmsOptionContainer").append(opt.holder)
        option.appendTo(MCMS.mainContainer.find("#mcmsOptionContainer"));
    }

};

MCMS.addListeners = function() {

    //addlisteners to buttons		
    for (var o = 1; o <= MCMS.maxOptions; o++) {
        var option = MCMS.optionArr[o - 1];

        option.addListeners();


    }
};

MCMS.showQuestion = function() {
    MCMS.initializeMCMS();
};

/*MCMS functionality*/
MCMS.initializeMCMS = function() {
    MCMS.userAnswer = [];
    MCMS.correctAnswer = [];
    MCMS.activityCompleted = false;
    $("#mcmsContainer").find("#mcmsQuestionTxt").html(MCMS.questionData.question);
    $("#mcmsContainer").find("#mcmsScenarioTxt").html(MCMS.questionData.scenarioText);
    $("#mcmsContainer").find("#mcmsInstructionTxt").html(MCMS.questionData.instructionText);
    MCMS.correctAnswer = MCMS.questionData.correctAnswer.split(",");
    $("#mcmsContainer").find(".mcssOption").addClass("hiddenOption");
    for (c = 0; c < MCMS.questionData.options.length; c++) {
        var option = MCMS.optionArr[c];
        option.showOption("<span>" + MCMS.questionData.options[c] + "</span>");
    }
}

MCMS.resetMCMS = function() {
    MCMS.userAnswer = [];
    for (c = 0; c < MCMS.questionData.options.length; c++) {
        var option = MCMS.optionArr[c];
        option.reset();
    }
}

MCMS.mcmsOptionClicked = function(evt) {
    var clicked = $(evt.target).parent().parent();
    var str = clicked.attr("id");
    //trace(clicked.find("#optionBox").hasClass("MCMSbulletPointsSelected"))
    if (clicked.find("#optionBox").hasClass("MCMSbulletPointsSelected")) {
        MCMS.userAnswer.push(str.split("_")[1]);
    } else {
        //MCMS.userAnswer.splice(MCMS.userAnswer.indexOf(str.split("_")[1]),1);
        MCMS.userAnswer.splice(jQuery.inArray(str.split("_")[1], MCMS.userAnswer), 1);
    }
    //trace(MCMS.userAnswer)
    if (MCMS.userAnswer.length > 0)
        SubmitButton.chkSubmitEnable(true);
    else
        SubmitButton.chkSubmitEnable(false);
}

MCMS.submitClicked = function(evt) {
    MCMS.disableOptions();
    MCMS.chkUserAnswer();
};

MCMS.disableOptions = function() {
    for (var c = 1; c <= MCMS.maxOptions; c++) {
        var option = MCMS.optionArr[c - 1];
        option.disable();
    }
}

MCMS.chkUserAnswer = function() {
    var tempArr = [];
    tempArr = MCMS.correctAnswer.concat();
    for (var c = 0; c < MCMS.userAnswer.length; c++) {
        //var ind = tempArr.indexOf(MCMS.userAnswer[c]);		 
        var ind = jQuery.inArray(MCMS.userAnswer[c], tempArr);
        if (ind >= 0)
            tempArr.splice(ind, 1);
    }
    var result = "Incorrect";
    if (tempArr.length <= 0 && MCMS.userAnswer.length == MCMS.correctAnswer.length) {
        result = 'Correct';
    }
    MCMS.showFeedback(result);
};


MCMS.showFeedback = function(result) {
    MCMS.currentAttempt++;
    if (MCMS.questionData.responseType == "generic") {
        if (result == "Correct") {
            Feedback.showFeedback(MCMS.questionData.feedback.genericResponse.correct.content);
            MCMS.showTickOnly();
        } else {
            if (MCMS.currentAttempt < MCMS.questionData.maxAttempts) {
                Feedback.showFeedback(MCMS.questionData.feedback.genericResponse.incorrect.content);
            } else {
                Feedback.showFeedback(MCMS.questionData.feedback.genericResponse.solution.content);
                MCMS.showSolution();
            }
        }
    } else {
        var feedStr = "";
        for (var c = 0; c < MCMS.userAnswer.length; c++) {
            feedStr += MCMS.questionData.specificResponse.response[MCMS.userAnswer[c] - 1].content;
            if (c > 0)
                feedStr += "<BR>"
        }

        //uncomment the line, if for specific response we require the instruction to de displayed.

        /*if(MCMS.currentAttempt >= MCMS.questionData.maxAttempts){
        		 feedStr += "Correct answers are displayed on screen."
        }*/

        Feedback.showFeedback(feedStr);
        //trace("result"+result)
        if (result == "Correct") {
            MCMS.showTickOnly();
        } else {
            if (MCMS.currentAttempt >= MCMS.questionData.maxAttempts)
                MCMS.showSolution();
        }
    }
};

MCMS.closeFeedback = function() {
    if (MCMS.activityCompleted)
        return;
    if (MCMS.currentAttempt < MCMS.questionData.maxAttempts) {
        MCMS.addListeners();
        MCMS.resetMCMS();
    }
};

MCMS.showTickOnly = function() {
    MCMS.markPageComplete();
    for (var u = 1; u <= MCMS.userAnswer.length; u++) {
        var option = MCMS.optionArr[MCMS.userAnswer[u - 1] - 1];
        option.showTickCross("mcssTick");
        /*$("#mcmsContainer").find("#mcmsOption_"+MCMS.userAnswer[u-1]).find("#mcmsTickCross").show();
        $("#mcmsContainer").find("#mcmsOption_"+MCMS.userAnswer[u-1]).find("#mcmsTickCross").addClass("mcssTick");*/
    }
}

MCMS.markPageComplete = function() {
    if (!MCMS.activityCompleted) {
        MCMS.activityCompleted = true;
        MainController.markCurrentPageComplete();
        MainController.showNextInstruction();
        eventMgr.dispatchCustomEvent(MCMS, "templateActivityCompleted", "", "");
    }
}

MCMS.showSolution = function() {
    MCMS.markPageComplete();

    for (c = 1; c <= MCMS.questionData.options.length; c++) {
        var option = MCMS.optionArr[c - 1];
        $("#mcmsContainer").find("#mcmsOption_" + c).find("#mcmsTickCross").show();
        //if(MCMS.correctAnswer.indexOf(c.toString())>=0)
        if (jQuery.inArray(c.toString(), MCMS.correctAnswer) >= 0)
            option.showTickCross("mcssTick");
        else
            option.showTickCross("mcssCross");
    }
}

//randomization
MCMS.randomizeArr = function(arr) {
    var randomizeArr = arr.concat();
    randomizeArr.sort(MCMS.shuffle);
    return randomizeArr;
};

MCMS.shuffle = function() {
    var ran = 0.5 - Math.random();
    return ran;
};