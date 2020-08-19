var assessmentEngine = {};
var remedialData = {};
remedialData.questions = [];
remedialData.userAttempt = [];
remedialData.correctAttempt = [];
remedialData.userResult = [];

assessmentEngine.questionData = {};
assessmentEngine.questionCounter = -1;
assessmentEngine.bankCounter = -1;
assessmentEngine.questionToDisplay;
assessmentEngine.mainContainer;
assessmentEngine.maxOptions = 6;
assessmentEngine.prevOption;
assessmentEngine.currentContainer;
assessmentEngine.userAnswer = [];
assessmentEngine.userResult = [];
assessmentEngine.userPercent = 0;
assessmentEngine.correctAnswer = [];
assessmentEngine.currentActivity;
assessmentEngine.totalQuestions = 0;
assessmentEngine.bankQuestionsShown = [];
assessmentEngine.bankQuestionsCanShow = [];
assessmentEngine.latencyStartTime;
assessmentEngine.passPercent = 0;
assessmentEngine.assessmentData = {};
assessmentEngine.userScore = 0;

//array for bank array where splicing values will be done 
assessmentEngine.spliceQuestionsCanShow = [];
var assessmentarray = 0;

function initAssessmentEngine(assessmentData) {
    assessmentarray = 0;
    $("#assessmentHolder").hide();
    $("#assessmentResultPage").hide();
    assessmentEngine.mainContainer = $("#assessmentContainer").find("#assessmentHolder");

    assessmentEngine.assessmentData = assessmentData;

    assessmentEngine.userScore = parseInt(SCORMAPIService.getScore());

    for (var b = 0; b < assessmentEngine.assessmentData.length; b++) {
        //assessmentEngine.totalQuestions += assessmentEngine.assessmentData[b].questionsToDisplay;
        assessmentEngine.bankQuestionsShown[b] = [];
    }

    //get data from SCORM	
    assessmentEngine.getQuestionDataFromSCORM();
    assessmentEngine.passPercent = parseInt(DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["passingPercent"]);


    if (assessmentEngine.userScore >= assessmentEngine.passPercent) {
        $("#assessmentQuestionTxt").html("You have already completed the assessment with the score of " + assessmentEngine.userScore + "%");
    }
    assessmentEngine.showStartPage();
    setTimeout(function() {
        MainController.initializeTemplateInShell();

    }, 20);
    //assessmentEngine.showQuestion();
    //assessmentEngine.showResultScreen();	

    /*--------For QA and show all mode------------*/
    $(document).keydown(function(e) {

        if (e.which == 17) {
            isCtrl = true;
        }
        if (e.which == 16) {
            isShift = true;
        }

        if (e.which == 88 && isCtrl && isShift) {
            /*--------Ctrl+Shift+X QA mode ------------*/
            $('.answer').show();
            $('.correct').show();
            $('.incorrect').show();
            $('.optionText').css('padding-left', '62px');
        }
        if (e.which == 112 && isCtrl && isShift) {

            /*--------Ctrl+Shift+F1 show all mode ------------*/
            e.preventDefault();

            for (var i = 0; i < assessmentEngine.assessmentData.length; i++) {
                assessmentEngine.assessmentData[i].isRandomize = "false";
                assessmentEngine.assessmentData[i].questionsToDisplay = assessmentEngine.assessmentData[i].questions.length;
            }
        }
    });
    /*--------For QA and show all mode end------------*/
}

assessmentEngine.startClicked = function() {

    UIController.UIControlDisabledOnAssessment();
    $("a.screenshot").hide();


    for (var b = 0; b < assessmentEngine.assessmentData.length; b++) {
        assessmentEngine.totalQuestions += assessmentEngine.assessmentData[b].questionsToDisplay;
        assessmentEngine.bankQuestionsShown[b] = [];
    }


    $("#navigatorTranscriptBtn").parent().addClass("disabled");
    FunctionLibrary.hideTranscriptPopup("#transcriptView");

    $(".qcounter").show();
    $("#assessmentQuestionTxt").html();
    assessmentEngine.createOptions();
    assessmentEngine.updateBankData();
    $("#assessmentStartPage").hide();
    $(".KCinstruction").show();
    assessmentEngine.showQuestion();
    $("#assessmentHolder").show();
    $(".assesmentMain2").show();

    setTimeout(function() {
        MainController.initializeTemplateInShell();
    }, 10);
};

function pageAudioHandler(currTime, totTime) {
    trace(currTime + " | " + totTime);
    if ((currTime) >= (totTime - 0.1)) {
        assessmentEngine.addListeners();
    }
}

assessmentEngine.showStartPage = function() {
    if ((DataManager.nAgt.indexOf("Android") != -1)) {
        $("#assessmentStartPage").css("-webkit-transform", "scale(0.8,0.8)");
        $("#assessmentStartPage").css("-moz-transform", "scale(0.8,0.8)");
        $("#assessmentStartPage").css("transform", "scale(0.8,0.8)");
        $("#assessmentContainer").css("-webkit-transform", "scale(0.8,0.8)");
        $("#assessmentContainer").css("-moz-transform", "scale(0.8,0.8)");
        $("#assessmentContainer").css("transform", "scale(0.8,0.8)");
        $("#assessmentResultPage").css("-webkit-transform", "scale(0.8,0.8)");
        $("#assessmentResultPage").css("-moz-transform", "scale(0.8,0.8)");
        $("#assessmentResultPage").css("transform", "scale(0.8,0.8)");
        $("#assessmentHolder").css("min-height", "400px");
        $("#assessmentStartContent").css("margin-top", "3%");
        $("#assessmentContainer").css("margin-top", "-10px");
        $("#assessmentResultContent").css("margin-top", "-4%");
    }

    //trace(+DataManager.assementStartEndData);
    var container = $("#assessmentStartPage").find("#assessmentStartContent");
    if (String(SCORMAPIService.getAssessmentStatus()).toLowerCase() == "completed" || String(SCORMAPIService.getAssessmentStatus()).toLowerCase() == "complete") {
        //if(learner has already passed assessment show complete text) else show incomplete text		
        var completeInfo = DataManager.assementStartEndData.startPageObj.complete;
        completeInfo = completeInfo.split("#")[0] + SCORMAPIService.getScore() + completeInfo.split("#")[1];
        container.find("#assessmentStartTxt").html(completeInfo);
        container.find("#assessmentAdditionalTxt").hide();
        container.find("#assessmentInstrutionTxt").hide();
        container.find("#assessmentInfoTxt").hide();
        return;
    } else {
        container.find("#assessmentStartTxt").html(DataManager.assementStartEndData.startPageObj.incomplete);
        var info = DataManager.assementStartEndData.startPageObj.info;
        info = info.split("#")[0] + assessmentEngine.passPercent + info.split("#")[1]
        container.find("#assessmentInfoTxt").html(info);
        container.find("#assessmentInstrutionTxt").html(DataManager.assementStartEndData.startPageObj.instruction);
        container.find("#assessmentAdditionalTxt").html(DataManager.assementStartEndData.startPageObj.additionalText);
    }
};

assessmentEngine.getQuestionDataFromSCORM = function() {
    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        //"0.1,0.2#1.2,1.3#2.1,2.3";
        var sampleStr = SCORMAPIService.getAssessmentData();
        if (sampleStr != "" && sampleStr != "undefined" && sampleStr != undefined && sampleStr.length > 2) {
            var questArr = sampleStr.split("#");
            for (var q = 0; q < questArr.length; q++) {
                var internalSet = questArr[q].split(",");
                for (var i = 0; i < internalSet.length; i++) {
                    var num = parseInt(internalSet[i].split(".")[1]);
                    assessmentEngine.bankQuestionsShown[q].push(num);
                }
                //trace("q= "+q+"  "+assessmentEngine.bankQuestionsShown[q]);
            }
        }
    }
};

assessmentEngine.updateBankData = function() {
    assessmentEngine.bankCounter++;
    assessmentEngine.questionToDisplay = 0;
    //resetting bank qustion array

    if (assessmentEngine.spliceQuestionsCanShow.length > 0)
        assessmentEngine.spliceQuestionsCanShow.splice(0, assessmentEngine.spliceQuestionsCanShow.length);
    if (assessmentEngine.bankQuestionsCanShow.length > 0)
        assessmentEngine.bankQuestionsCanShow.splice(0, assessmentEngine.bankQuestionsCanShow.length);

    for (var y = 0; y < assessmentEngine.assessmentData[assessmentEngine.bankCounter].questions.length; y++) {
        assessmentEngine.bankQuestionsCanShow.push(y);
    }
    trace("assessmentEngine.bankQuestionsCanShow " + assessmentEngine.bankQuestionsCanShow);
    if (assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter].length > 0) {
        //already some questions shown to user in earlier attempt in this bank
        assessmentEngine.spliceQuestionsCanShow = assessmentEngine.spliceArr(assessmentEngine.bankQuestionsCanShow, assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter]);
    } else {
        //first time learner has come to take assessment
        assessmentEngine.spliceQuestionsCanShow = assessmentEngine.bankQuestionsCanShow.concat();
    }
    trace('can show ' + assessmentEngine.spliceQuestionsCanShow);
    if (assessmentEngine.spliceQuestionsCanShow.length < assessmentEngine.assessmentData[assessmentEngine.bankCounter].questionsToDisplay) {
        //if available array size is less the required questions that has to be shown		
        var leftQuestionsArr = assessmentEngine.spliceArr(assessmentEngine.bankQuestionsCanShow, assessmentEngine.spliceQuestionsCanShow);
        if (assessmentEngine.assessmentData[assessmentEngine.bankCounter].isRandomize == "true") {
            leftQuestionsArr = assessmentEngine.randomizeArr(leftQuestionsArr);
        }
        trace('questionsLeftOut ' + leftQuestionsArr);
        assessmentEngine.spliceQuestionsCanShow = assessmentEngine.spliceQuestionsCanShow.concat(leftQuestionsArr);
    } else {

        //if question available in "spliceQuestionsCanShow" is still more than quesstionsToDisplay from that bank
        //alert(assessmentEngine.assessmentData[assessmentEngine.bankCounter].isRandomize);

        if (assessmentEngine.assessmentData[assessmentEngine.bankCounter].isRandomize == "true") {
            assessmentEngine.spliceQuestionsCanShow = assessmentEngine.randomizeArr(assessmentEngine.spliceQuestionsCanShow);
        }
    }
    trace('questions to show ' + assessmentEngine.spliceQuestionsCanShow);
};

assessmentEngine.createOptions = function() {
    //create clone options for assessment

    for (var o = 0; o < assessmentEngine.maxOptions; o++) {
        var option = $(assessmentEngine.mainContainer.find("#assessmentOptionContainer").find("#optionHolder").find(".tempOption")).clone();
        option.removeClass("tempOption");
        option.addClass("mcssOption");
        option.addClass("hiddenOption");
        option.attr("id", "assessmentOption_" + (o + 1));
        option.find("#assessmentOptionBox").on("click", assessmentOptionClicked);
        option.appendTo(assessmentEngine.mainContainer.find("#assessmentOptionContainer").find("#optionHolder"));

        var dropdown = $(assessmentEngine.mainContainer.find("#assessmentOptionContainer").find("#dropdownHolder").find(".tempdropdown")).clone();
        dropdown.removeClass("tempdropdown");
        dropdown.addClass("kcdropdown");
        dropdown.addClass("hiddenOption");
        dropdown.attr("id", "assessmentDropdown_" + (o + 1));
        dropdown.find('.dropboxContainer').find('.optDropBox').on('change', assessmentOptionClicked);
        dropdown.appendTo(assessmentEngine.mainContainer.find("#assessmentOptionContainer").find("#dropdownHolder"));
    }
};
assessmentEngine.addListeners = function() {
    //addlisteners to buttons	
    //if already completed, dont allow learner to start assessment 
    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
        if (String(SCORMAPIService.getAssessmentStatus()).toLowerCase() == "completed" || String(SCORMAPIService.getAssessmentStatus()).toLowerCase() == "complete") {
            if (DataManager.configData[StaticLibrary.CONFIG_ASSESSMENT]["allowRetake"] != "true") {
                return;
            }
        }
    }
    if (assessmentEngine.userScore >= assessmentEngine.passPercent) {
        $("#assessmentQuestionTxt").html("You have already completed the assessment with the score of " + assessmentEngine.userScore + "%");
    } else {
        $("#assessmentStartPage").find("#assessmentStartBtn").removeClass("submitButtonDisable").addClass("submitButton");
        $("#assessmentHolder").find("#assessmentSubmitBtn").on("click", assessmentEngine.submitClicked);
        $("#assessmentStartPage").find("#assessmentStartBtn").on("click", assessmentEngine.startClicked);
        $("#assessmentResultPage").find("#showRemedialBtn").on("click", assessmentEngine.showRemedialClicked);
        $("#assessmentResultPage").find("#hideRemedialBtn").on("click", assessmentEngine.showRemedialClicked);
    }


};

assessmentEngine.showQuestion = function() {
    assessmentarray++;
    //alert(assessmentEngine.totalQuestions)
    $('.qnumber').html(assessmentarray);
    $('.total_qnumber').html(assessmentEngine.totalQuestions);
    if (assessmentEngine.questionCounter < assessmentEngine.totalQuestions - 1) {

        // $(".question_number").html(assessmentEngine.questionCounter+2+".");
        assessmentEngine.questionCounter++;

        //$(".question_number").html(assessmentEngine.questionCounter+2+".");

        //alert(assessmentEngine.questionCounter)
        // debugger
        $('#assessmentTitle').html('Questions ' + (assessmentEngine.questionCounter + 1));
        var pageNumStr = convertNumToString(assessmentEngine.questionCounter + 1) + " of " + convertNumToString(assessmentEngine.totalQuestions);
        MainController.updatedAssessmentPageNo(pageNumStr);



        //alert(assessmentEngine.questionToDisplay +" bbbbbbbbb "+ assessmentEngine.assessmentData[assessmentEngine.bankCounter].questionsToDisplay)

        if (assessmentEngine.questionToDisplay >= assessmentEngine.assessmentData[assessmentEngine.bankCounter].questionsToDisplay) {
            assessmentEngine.updateBankData();
        }
        assessmentEngine.questionToDisplay++;

        //alert(assessmentEngine.questionToDisplay +' - '+assessmentEngine.bankCounter+' - '+assessmentEngine.questionCounter);
        trace(assessmentEngine.spliceQuestionsCanShow)
        var n = assessmentEngine.spliceQuestionsCanShow[assessmentEngine.questionToDisplay - 1];
        //alert(n)
        trace(assessmentEngine.assessmentData[assessmentEngine.bankCounter].questions)
        assessmentEngine.questionData = assessmentEngine.assessmentData[assessmentEngine.bankCounter].questions[n];

        //not required - assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter].push(assessmentEngine.questionToDisplay-1);
        trace(assessmentEngine.questionData)
            //alert(assessmentEngine.questionData.type);
        assessmentEngine.currentActivity = assessmentEngine.questionData.type.toLowerCase();
        if (assessmentEngine.currentActivity == "mcss") {
            assessmentEngine.currentContainer = $(assessmentEngine.mainContainer);
            initializeMCSS();
        } else if (assessmentEngine.currentActivity == "dropdown") {
            assessmentEngine.currentContainer = $(assessmentEngine.mainContainer);
            initializeDD();
        } else {
            assessmentEngine.currentContainer = $(assessmentEngine.mainContainer);
            //initializeMCMS();			
        }
        assessmentEngine.userAnswer.splice(0, assessmentEngine.userAnswer.length);
        assessmentEngine.chkSubmitEnable(false);
        assessmentEngine.latencyStartTime = new Date();
    } else {
        assessmentEngine.showResultScreen();
    }

    //if(assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter].indexOf(n) < 0)
    if (jQuery.inArray(n, assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter]) < 0)
        assessmentEngine.bankQuestionsShown[assessmentEngine.bankCounter].push(n);
};

/*MCSS functionality*/
function initializeMCSS() {
    $("#dropdownHolder").hide();
    $("#optionHolder").show();
    $(".KCinstruction").html('<span class="instIcon"></span>Check the correct option and select <b>Submit.</b>');
    //alert(assessmentEngine.questionData.question);
    $("#assessmentQuestionTxt").html(assessmentEngine.questionData.question);
    assessmentEngine.currentContainer.find("#assessmentQuestionTxt").html(assessmentEngine.questionData.question);
    assessmentEngine.currentContainer.find("#assessmentInstructionTxt").html(assessmentEngine.questionData.instruction);
    assessmentEngine.correctAnswer = assessmentEngine.questionData.correctAnswer.split(",");
    assessmentEngine.currentContainer.find(".mcssOption").addClass("hiddenOption");

    for (var y = 0; y < 4; y++) {
        assessmentEngine.currentActivityAnswer = Number(assessmentEngine.questionData.correctAns);
        //alert(assessmentEngine.currentActivityAnswer);

    }
    /*for(var y = 0; y < 4; y++){
    	
    		if(assessmentEngine.questionData.correctAns=="1"){
    				alert(y);
    				$('#assessmentOption').addClass('correct');
    				alert('#assessmentOption_'+y);
    		}
    		else{
    				$('#assessmentOption').addClass('incorrect');
    			}
    }		*/




    for (c = 0; c < assessmentEngine.questionData.choices.length; c++) {
        $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).removeClass("hiddenOption");
        $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOptionBox").removeClass("bulltePointsSelected");
        $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOptionTxt").html(assessmentEngine.questionData.choices[c]);


        $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOption").removeClass("correct");
        $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOption").removeClass("incorrect");


        if (assessmentEngine.questionData.choiceData[c] == 1) {
            $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOption").addClass("correct");
        } else {
            $(assessmentEngine.currentContainer.find("#assessmentOption_" + (c + 1))).find("#assessmentOption").addClass("incorrect");
        }
        trace("A " + c + " : " + assessmentEngine.questionData.choiceData[c]);
        trace("==========================");
    }
}

function initializeDD() {
    $("#dropdownHolder").show();
    $("#optionHolder").hide();
    $(".KCinstruction").html('<span class="instIcon"></span>Choose the correct options and select <b>Submit</b>.');
    $("#assessmentQuestionTxt").html(assessmentEngine.questionData.question);
    assessmentEngine.currentContainer.find("#assessmentInstructionTxt").html(assessmentEngine.questionData.instruction);
    assessmentEngine.correctAnswer = assessmentEngine.questionData.correctAnswer.split(",");
    assessmentEngine.currentContainer.find(".kcdropdown").addClass("hiddenOption");
    for (var c = 0; c < assessmentEngine.questionData.dropdown.length; c++) {
        $(assessmentEngine.currentContainer.find("#assessmentDropdown_" + (c + 1))).removeClass("hiddenOption");
        $(assessmentEngine.currentContainer.find("#assessmentDropdown_" + (c + 1))).find(".dropdownContent").html(assessmentEngine.questionData.dropdown[c].text);
        trace(assessmentEngine.questionData.dropdown[c]);
        $(assessmentEngine.currentContainer.find("#assessmentDropdown_" + (c + 1)).find('.dropboxContainer').find('.optDropBox')).append('<option class="disabledOpt" disabled="disabled" selected="selected" index="' + c + '"value="---Select---">---Select---</option>');
        for (var d = 0; d < assessmentEngine.questionData.dropdown[c].options.length; d++) {
            $(assessmentEngine.currentContainer.find("#assessmentDropdown_" + (c + 1)).find('.dropboxContainer').find('.optDropBox')).append('<option class="activeOpt" index="' + c + '"value="' + assessmentEngine.questionData.dropdown[c].options[d] + '">' + assessmentEngine.questionData.dropdown[c].options[d] + '</option>');
        }
    }
    assessmentEngine.userAnswer = [];
}

function assessmentOptionClicked(evt) {
    if (assessmentEngine.currentActivity == "dropdown") {
        var selectIndex = $(evt.target).parent().parent().attr("id").split('_')[1];
        assessmentEngine.userAnswer[selectIndex - 1] = ($(evt.target).prop("selectedIndex") - 1);
        assessmentEngine.chkSubmitEnable(true);
        $(this).css("color", "#004890");
        //alert(assessmentEngine.userAnswer);

    } else {
        var clicked = $(evt.target).parent().parent();
        if (clicked.hasClass("bulltePointsSelected"))
            return;
        if (assessmentEngine.prevOption) {
            assessmentEngine.prevOption.find("#assessmentOptionBox").removeClass("bulltePointsSelected");
            assessmentEngine.prevOption.find("#assessmentOptionBox").css('cursor', 'pointer');
        }
        clicked.find("#assessmentOptionBox").addClass("bulltePointsSelected");
        clicked.find("#assessmentOptionBox").css('cursor', 'default');
        assessmentEngine.prevOption = clicked;
        var str = clicked.attr("id");
        assessmentEngine.userAnswer[0] = str.split("_")[1];
        assessmentEngine.chkSubmitEnable(true);
    }
}


/*GLOBAL*/
assessmentEngine.chkSubmitEnable = function(flag) {
    if (flag) {
        if (assessmentEngine.userAnswer.length >= assessmentEngine.correctAnswer.length)
            assessmentEngine.currentContainer.find("#assessmentSubmitBtn").removeClass("submitButtonDisable").addClass("submitButton");
        else
            assessmentEngine.currentContainer.find("#assessmentSubmitBtn").removeClass("submitButton").addClass("submitButtonDisable");
    } else {
        assessmentEngine.currentContainer.find("#assessmentSubmitBtn").removeClass("submitButton").addClass("submitButtonDisable");
    }
};

assessmentEngine.submitClicked = function(evt) {
    if ($(evt.target).hasClass("submitButtonDisable"))
        return;
    assessmentEngine.chkSubmitEnable(false);
    assessmentEngine.chkUserAnswer();
};

assessmentEngine.chkUserAnswer = function() {
    var tempArr = [];
    var result = "Incorrect";
    tempArr = assessmentEngine.correctAnswer.concat();
    //alert(tempArr);
    if (assessmentEngine.currentActivity == "dropdown") {
        var cnt = 0;
        for (var c = 0; c < assessmentEngine.userAnswer.length; c++) {
            if (assessmentEngine.userAnswer[c] != tempArr[c]) {
                cnt = 1;
            }
        }
        if (cnt == 0) {
            result = "Correct";
        }
    } else {
        for (var c = 0; c < assessmentEngine.userAnswer.length; c++) {
            //var ind = tempArr.indexOf(assessmentEngine.userAnswer[c]);	
            var ind = jQuery.inArray(assessmentEngine.userAnswer[c], tempArr);
            if (ind >= 0)
                tempArr.splice(ind, 1);
        }
        if (tempArr.length <= 0) {
            result = 'Correct';
        }
    }

    assessmentEngine.updateRemedialData(result);
    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local")
        assessmentEngine.sendCMIInteractionData(result);
    assessmentEngine.showFeedback(result);
};

assessmentEngine.updateRemedialData = function(result) {
    //updating remedial data that needs to be shown on last result page
    //alert(result);	
    remedialData.questions.push(assessmentEngine.questionData.question);
    var correctStr = "";
    var userStr = "";
    if (assessmentEngine.currentActivity == "dropdown") {
        for (var c = 0; c < assessmentEngine.correctAnswer.length; c++) {
            var num = parseInt(assessmentEngine.correctAnswer[c]);
            correctStr += "<BR>" + assessmentEngine.questionData.dropdown[c].options[num];
        }
        for (var u = 0; u < assessmentEngine.userAnswer.length; u++) {
            var num = parseInt(assessmentEngine.userAnswer[u]);
            userStr += "<BR>" + assessmentEngine.questionData.dropdown[u].options[num];

        }


    } else {

        for (var c = 0; c < assessmentEngine.correctAnswer.length; c++) {
            var num = parseInt(assessmentEngine.correctAnswer[c]);
            correctStr = assessmentEngine.questionData.choices[num - 1];
            if (c > 0)
                correctStr += "<BR>";
        }

        for (var u = 0; u < assessmentEngine.userAnswer.length; u++) {
            var num = parseInt(assessmentEngine.userAnswer[u]);
            //trace("num "+num);
            //trace("num "+assessmentEngine.questionData.choices[num-1]);
            userStr = assessmentEngine.questionData.choices[num - 1];
            if (u > 0)
                userStr += "<BR>";
        }
    }

    remedialData.correctAttempt.push(correctStr);
    remedialData.userAttempt.push(userStr);
    remedialData.userResult.push(result);
    trace(remedialData);
};

assessmentEngine.showFeedback = function(result) {
    if (result == 'Correct') {
        assessmentEngine.userResult[assessmentEngine.questionCounter] = 1;
    } else {
        assessmentEngine.userResult[assessmentEngine.questionCounter] = 0;
    }
    assessmentEngine.showQuestion();
};

assessmentEngine.showResultScreen = function() {
    $("#assessmentHolder").hide();
    $("#assessmentResultPage").find("#remedialContent").hide();
    $("#assessmentResultPage").find("#hideRemedialBtn").hide();
    $("#assessmentResultPage").show();
    $('.qcounter').hide();
    $('.resultfooter').hide();

    $('.KCinstruction').hide();
    UIController.UIControlEnabledOnAssessment();
    //$("a.screenshot").show();
    //call to shell to ENABLE all shell elements
    //UIControlEnabled();


    var resultCounter = 0;
    for (var r = 0; r < assessmentEngine.totalQuestions; r++) {
        if (assessmentEngine.userResult[r] == 1)
            resultCounter++;
    }
    assessmentEngine.userPercent = resultCounter / assessmentEngine.totalQuestions * 100;
    //trace("assessmentEngine.userPercent "+assessmentEngine.userPercent);
    var container = $("#assessmentResultPage").find("#assessmentResultContent");

    container.find("#resultTitle").html(DataManager.assementStartEndData.resultPageObj.title);
    container.find("#resultLabel").html(DataManager.assementStartEndData.resultPageObj.resultLabel);
    container.find("#scoreLabel").html(DataManager.assementStartEndData.resultPageObj.scoreLabel);
    container.find("#assessmentUserScore").html(Math.round(assessmentEngine.userPercent));

    //marking course status	
    SCORMAPIService.setAttempts(SCORMAPIService.getAttempts() + 1);
    SCORMAPIService.setScore(assessmentEngine.userPercent);
    if (assessmentEngine.userPercent >= assessmentEngine.passPercent) {
        SCORMAPIService.setAssessmentStatus("completed");
        MainController.markCurrentPageComplete();
        //container.find("#resultMessage").html(DataManager.assementStartEndData.resultPageObj.passObj.message);	

        $("#assessmentQuestionTxt").html(DataManager.assementStartEndData.resultPageObj.passObj.message);
        container.find("#assessmentUserStatus").html("Passed");
        //passed audio
        AudioController.playInternalAudio(DataManager.assementStartEndData.resultPageObj.passObj.audio);
        $("#userScore").html(Math.round(assessmentEngine.userPercent));
    } else {
        SCORMAPIService.setAssessmentStatus("incomplete");
        //container.find("#resultMessage").html(DataManager.assementStartEndData.resultPageObj.failObj.message);
        $("#assessmentQuestionTxt").html(DataManager.assementStartEndData.resultPageObj.failObj.message);
        container.find("#assessmentUserStatus").html("Failed");
        //failed audio
        AudioController.playInternalAudio(DataManager.assementStartEndData.resultPageObj.failObj.audio);
        $("#userScore").html(Math.round(assessmentEngine.userPercent));
    }
    $("#assessmentResultPage").find("#remedialContent").html(assessmentEngine.getRemedialContent());
    assessmentEngine.sendQuestionDatatoSCORM();
};

assessmentEngine.showRemedialClicked = function(evt) {
    if ($(evt.target).attr("id").indexOf("show") >= 0) {
        $("#assessmentResultPage").find("#remedialContent").show();
        $("#assessmentResultPage").find("#hideRemedialBtn").show();
        $("#assessmentResultPage").find('.resultfooter').show();
        $("#assessmentResultPage").find("#remedialContent").scrollTop(0);
    } else {
        $("#assessmentResultPage").find("#remedialContent").hide();
        $("#assessmentResultPage").find("#showRemedialBtn").show();
        $("#assessmentResultPage").find('.resultfooter').hide();
    }
    $(evt.target).hide();
};

assessmentEngine.getRemedialContent = function() {
    var remedialStr = "";
    for (var r = 0; r < remedialData.questions.length; r++) {
        remedialStr += "<B>Question " + (r + 1) + " : </B>";
        remedialStr += remedialData.questions[r] + "<BR>";
        remedialStr += "<B>Your Answer: </B>";
        remedialStr += remedialData.userAttempt[r] + "<BR>";
        remedialStr += "<B>Correct Answer: </B>";
        remedialStr += remedialData.correctAttempt[r] + "<BR>";
        remedialStr += "<B>Result: </B>";
        remedialStr += remedialData.userResult[r] + "<BR><BR>";
    }
    return remedialStr;
};


assessmentEngine.sendQuestionDatatoSCORM = function() {
    var strToSend = "";
    for (var i = 0; i < assessmentEngine.bankQuestionsShown.length; i++) {
        var str = "";
        for (var j = 0; j < assessmentEngine.bankQuestionsShown[i].length; j++) {
            var format = i + "." + assessmentEngine.bankQuestionsShown[i][j];
            if (j < assessmentEngine.bankQuestionsShown[i].length - 1)
                format += ",";
            else
                format += "#";
            str += format;
        }
        strToSend += str;
    }
    strToSend = strToSend.substr(0, strToSend.length - 1);
    strToSend += "$";
    trace(strToSend);
    if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local")
        SCORMAPIService.setAssessmentData(strToSend);
};

assessmentEngine.sendCMIInteractionData = function(result) {
    //logic for sending data to scorm wrapper
    var latencyEndTime = new Date();
    //cmi.interactions.n.id	
    var questionID = DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseID"] + "_" + assessmentEngine.questionData.id;
    //cmi.interactions.n.time
    var timeStr = convertNumToString(latencyEndTime.getHours()) + ":" + convertNumToString(latencyEndTime.getMinutes()) + ":" + convertNumToString(latencyEndTime.getSeconds());
    //cmi.interactions.n.type
    var cmiType = assessmentEngine.questionData.CMIType;
    //cmi.interactions.n.correct_responses
    var correctResponse = "choice_" + assessmentEngine.correctAnswer.toString();
    //cmi.interactions.n.weighting
    var weightage = "1";
    //cmi.interactions.n. student_response
    var userResponse = "choice_" + assessmentEngine.userAnswer.toString();
    //cmi.interactions.n.result
    var userResult = result.toLowerCase();
    if (userResult == "incorrect")
        userResult = "wrong";
    //cmi.interactions.n.latency
    var latency = assessmentEngine.calculateLatencyTime(assessmentEngine.latencyStartTime, latencyEndTime);
    //sendInteractionDataToSCROM();
    SCORMAPIService.setInteractionData(questionID, cmiType, timeStr, latency, weightage, correctResponse, userResponse, userResult, assessmentEngine.questionCounter + 1, assessmentEngine.totalQuestions)
};


assessmentEngine.calculateLatencyTime = function(startTime, endTime) {
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
    //trace(timeStr);
    /*if(DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] == "scorm1_2")
    	timeStr = convertNumToString(hours)+":"+convertNumToString(min)+":"+convertNumToString(sec);
    else
    	timeStr ="PT" +hours+"H"+min+"M"+sec+"S";*/
    timeStr = convertNumToString(hours) + ":" + convertNumToString(min) + ":" + convertNumToString(sec);
    return timeStr;
};

//randomization
assessmentEngine.randomizeArr = function(arr) {
    var randomizeArr = arr.concat();
    randomizeArr.sort(assessmentEngine.shuffle);
    return randomizeArr;
};

assessmentEngine.shuffle = function() {
    var ran = 0.5 - Math.random();
    return ran;
};

assessmentEngine.spliceArr = function(arr, itemToSplice) {
    //arr - from which items (itemToSplice) to be spliced
    var splicingArr = arr.concat();
    for (var a = 0; a < itemToSplice.length; a++) {
        //var ind = splicingArr.indexOf(itemToSplice[a]); 
        var ind = jQuery.inArray(itemToSplice[a], splicingArr);
        if (ind >= 0)
            splicingArr.splice(ind, 1);
        else
            continue;
    }
    return splicingArr;
};

function convertNumToString(num) {
    var str;
    if (num < 10)
        str = "0" + num;
    else
        str = num.toString();
    return str;
};