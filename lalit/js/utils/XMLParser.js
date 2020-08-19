var XMLParser = function() {}

XMLParser.alphabets = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

XMLParser.parseCourseData = function(data) {
    ////trace($($(data).find("topic")[0]).title);
    var CourseData = [];
    var parseTopicCounter = 0;
    $(data).find("topic").each(function() {
        CourseData[parseTopicCounter] = [];
        //	CourseData[parseTopicCounter][StaticLibrary.TITLE] = $(this).attr(StaticLibrary.TITLE);
        CourseData[parseTopicCounter][StaticLibrary.TOPICTITLE] = $(this).attr(StaticLibrary.TOPICTITLE);
        var parsePageCounter = 0;
        $(this).find("page").each(function() {
            CourseData[parseTopicCounter][parsePageCounter] = [];
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.TITLE] = $(this).attr(StaticLibrary.TITLE);
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.TEMPLATE] = $(this).attr(StaticLibrary.TEMPLATE);
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.PAGE_SCRIPT] = $(this).attr("id");
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.PAGE_TO_LOAD] = $(this).attr("templatetype");
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.IS_ASSESSMENT] = $(this).attr(StaticLibrary.IS_ASSESSMENT);
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.HAS_AUDIO] = $(this).attr(StaticLibrary.HAS_AUDIO);
            CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.MARK_VISIT] = $(this).attr(StaticLibrary.MARK_VISIT);

            if ($(this).attr(StaticLibrary.SHOW_TITLE))
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.SHOW_TITLE] = $(this).attr(StaticLibrary.SHOW_TITLE);
            else
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.SHOW_TITLE] = "true";

            if ($(this).attr(StaticLibrary.ENABLE_MENU))
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.ENABLE_MENU] = $(this).attr(StaticLibrary.ENABLE_MENU);
            else
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.ENABLE_MENU] = "true";

            if ($(this).attr(StaticLibrary.NEXT_PAGE_ID))
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.NEXT_PAGE_ID] = $(this).attr(StaticLibrary.NEXT_PAGE_ID);
            else
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.NEXT_PAGE_ID] = "#";
            if ($(this).attr(StaticLibrary.BACK_PAGE_ID))
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.BACK_PAGE_ID] = $(this).attr(StaticLibrary.BACK_PAGE_ID);
            else
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.BACK_PAGE_ID] = "#";

            if ($(this).attr(StaticLibrary.ENABLE_BACK))
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.ENABLE_BACK] = $(this).attr(StaticLibrary.ENABLE_BACK);
            else
                CourseData[parseTopicCounter][parsePageCounter][StaticLibrary.ENABLE_BACK] = "true";
            parsePageCounter++;
        });
        parseTopicCounter++;
    });
    return CourseData;
}

XMLParser.parseCourseDataSingleLevel = function(data) {
    var singleData = [];
    //var counter=0;
    for (var t = 0; t < data.length; t++) {
        for (var p = 0; p < data[t].length; p++) {
            singleData.push(data[t][p]);
        }
    }
    return singleData;
}

XMLParser.parseConfigData = function(data) {
    var ConfigData = [];
    ConfigData[StaticLibrary.CONFIG_COURSE] = [];
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] = $(data).find("scoCompliance").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseFolder"] = $(data).find("courseFolder").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseTitle"] = $(data).find("courseTitle").text();

    ConfigData[StaticLibrary.CONFIG_COURSE]["courseID"] = $(data).find("courseid").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["title"] = $(data).find("title").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["showIntro"] = $(data).find("showIntro").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["introLocation"] = $(data).find("introlocation").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["language"] = $(data).find("languagecode").text();
    ConfigData[StaticLibrary.CONFIG_COURSE]["navigationMode"] = $(data).find("features").find("coursecontrol").text();

    ConfigData[StaticLibrary.CONFIG_FEATURE] = [];
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showHelp"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("help").text();
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showExit"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("exit").text();
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showGlossary"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("glossary").text();

    if ($(data).find(StaticLibrary.CONFIG_FEATURE).find("showAudio").text())
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showAudio"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("showAudio").text();
    else
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showAudio"] = "true";

    if ($(data).find(StaticLibrary.CONFIG_FEATURE).find("showTranscript").text())
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showTranscript"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("showTranscript").text();
    else
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showTranscript"] = "true";

    ConfigData[StaticLibrary.CONFIG_FEATURE]["showProgressBar"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("progressbarcontrol").find("progressbar").text();
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showNotepad"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("notepadcontrol").find("notepad").text();
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showResources"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("resources").text();
    ConfigData[StaticLibrary.CONFIG_FEATURE]["pageCounterMode"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("pageindicator").text();

    if ($(data).find(StaticLibrary.CONFIG_FEATURE).find("showPageTransition").text())
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showPageTransition"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("showPageTransition").text();
    else
        ConfigData[StaticLibrary.CONFIG_FEATURE]["showPageTransition"] = "true";
    if ($(data).find(StaticLibrary.CONFIG_FEATURE).find("allowSwipe").text())
        ConfigData[StaticLibrary.CONFIG_FEATURE]["allowSwipe"] = $(data).find(StaticLibrary.CONFIG_FEATURE).find("allowSwipe").text();
    else
        ConfigData[StaticLibrary.CONFIG_FEATURE]["allowSwipe"] = "true";

    ConfigData[StaticLibrary.CONFIG_ASSESSMENT] = [];
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["available"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("available").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["passingPercent"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("passingscrore").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["allowRetake"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("retake").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["maxAttempts"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("numattempts").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["randomizeQuestions"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("randomizeQuestions").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["randomizeOptions"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("randomizeOptions").text();
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["showRemedial"] = $(data).find(StaticLibrary.CONFIG_ASSESSMENT).find("remedial").text();

    return ConfigData;
}

XMLParser.parseGlossaryData = function(data) {
    var glossaryAlphabets = [];
    var tempArr = [];
    $(data).find("item").each(function() {
        var term = $(this).find("label").text();
        var alpha = term.substring(0, 1);
        if (tempArr[alpha] == null)
            tempArr[alpha] = [];

        var itemObj = {};
        itemObj.title = term;
        itemObj.description = $(this).find("data").text();
        if ($(this).find("audio").text())
            itemObj.audio = $(this).find("audio").text();

        tempArr[alpha].push(itemObj);
    });
    ////trace(tempArr)
    for (var a = 0; a < XMLParser.alphabets.length; a++) {
        glossaryAlphabets[a] = tempArr[XMLParser.alphabets[a]];
    }
    return glossaryAlphabets;
}

/*assessment Start END page data */
XMLParser.parseAssessmentStartEnd = function(data) {
    trace($($(data).find("body").find("text")[0]).text());
    trace("XMLParser.parseAssessmentStartEnd: ");
    var dataObj = {};
    var xmlData = $(data.value).find("body").find("bodyText");

    //start page content
    dataObj.startPageObj = {};
    dataObj.startPageObj.incomplete = $(xmlData.find("text")[0]).text();
    dataObj.startPageObj.info = $(xmlData.find("text")[6]).text() + "#" + $(xmlData.find("text")[7]).text();
    dataObj.startPageObj.complete = $(xmlData.find("text")[2]).text() + "#" + $(xmlData.find("text")[3]).text();
    dataObj.startPageObj.instruction = $($(data.value).find("body").find("instructionText")).text();
    dataObj.startPageObj.additionalText = $(data.value).find("body").find("additionalText").text();

    //result page content
    dataObj.resultPageObj = {};
    var resultData = $(data.value).find("AssessmentResult").find("Assessment");
    dataObj.resultPageObj.title = resultData.find("pageTitle").text();
    dataObj.resultPageObj.resultLabel = resultData.find("ResultText").text();
    dataObj.resultPageObj.scoreLabel = resultData.find("ScoreText").text();
    dataObj.resultPageObj.percentLabel = resultData.find("PercentText").text();
    dataObj.resultPageObj.passObj = {};
    dataObj.resultPageObj.passObj.message = resultData.find("PassText").find("CongtateText").text();
    dataObj.resultPageObj.passObj.instruction = resultData.find("PassText").find("InstructionText").text();
    dataObj.resultPageObj.failObj = {};
    dataObj.resultPageObj.failObj.message = resultData.find("FailText").find("FailSubTitle").text();
    dataObj.resultPageObj.failObj.instruction = resultData.find("FailText").find("Retake").find("RetakeInstructionText").text();
    ////trace(dataObj);
    return dataObj;
};

XMLParser.parseAssessmentData = function(data) {
    var AssessmentData = [];
    var bankCounter = 0;
    $(data).find("assessment").find("module").find("pool").find("bank").each(function() {
        var bankObj = {};
        //trace("numQuesToDisplay  "+$(this).attr("numQuesToDisplay"));
        bankObj.questionsToDisplay = parseInt($(this).attr("numQuesToDisplay"));
        bankObj.questions = [];
        $(this).find("question").each(function() {
            if ($(this).attr("id") != undefined) {
                var questionObj = {};
                questionObj.type = $(this).find("MCQ").attr("category");
                questionObj.CMIType = $(this).attr("type");
                if ($(this).attr("path") != undefined)
                    questionObj.path = $(this).attr("path");
                questionObj.id = $(this).attr("id");
                questionObj.remedialPage = $(this).find("body").find("remedialPage").text();
                questionObj.correctAnswer = $(this).find("MCQ").attr("correctAnswer");
                questionObj.question = $($(this).find("body").find("question").text()).find("font").text();
                //questionObj.question = $(questionObj.question).find("font").text();				
                questionObj.instruction = $(this).find("body").find("instruction").text();
                questionObj.choices = [];
                if ($(this).find("MCQ").find("choices")) {
                    $(this).find("MCQ").find("choices").find("choice").each(function() {
                        questionObj.choices.push($(this).text());
                    });
                }
                bankObj.questions.push(questionObj);
                trace(questionObj)
            }

        });

        AssessmentData[bankCounter] = bankObj;
        bankCounter++;
    });

    //trace(AssessmentData);
    //trace("======================AssessmentData===================");

    return AssessmentData;
}

XMLParser.parseMCSSData = function(data) {
    var mcssData = {};
    ////trace($(data).find("body").find("pageheading").text());
    var xmlData = $(data).find("body");
    mcssData.question = xmlData.find("pageheading").text();
    mcssData.audio = xmlData.find("assets").find("audio").find("path").text();
    mcssData.instructionText = "";
    mcssData.responseType = xmlData.find("MCQ").attr("responseType");
    mcssData.maxAttempts = xmlData.find("MCQ").attr("totalAttempts");
    mcssData.correctAnswer = xmlData.find("MCQ").attr("correctAnswer");
    //mcssData.transcriptContent = $($(data).find("transcripts").find("transcript")[0]).text();
    mcssData.options = [];
    $(xmlData.find("MCQ").find("choices").find("choice")).each(function() {
        mcssData.options.push($(this).text());
    });
    //trace("hakim_------------------- "+mcssData.correctAnswer)
    mcssData.feedback = {};
    mcssData.feedback.genericResponse = {};
    mcssData.feedback.genericResponse.correct = xmlData.find("MCQ").find("feedback").find("genericResponse").find("correct").text();
    mcssData.feedback.genericResponse.incorrect = xmlData.find("MCQ").find("feedback").find("genericResponse").find("tryAgain").text();
    mcssData.feedback.genericResponse.solution = xmlData.find("MCQ").find("feedback").find("genericResponse").find("solution").text();

    mcssData.specificResponse = {};
    mcssData.specificResponse.response = [];
    $(xmlData.find("MCQ").find("feedback").find("specificResponse").find("response")).each(function() {
        mcssData.specificResponse.response.push($(this).text());
    });
    return mcssData;
}

XMLParser.parseTextImageData = function(data) {

    //	trace("Inside Parser : " + data);

    var dataObj = {};
    dataObj.audio = $(data).find("body").find("assets").find("audio").text();
    dataObj.section = {};
    dataObj.section.content = $(data).find("body").find("image").find("source").find("caption").text();
    dataObj.section.image = $(data).find("body").find("image").find("source").find("path").text();
    if ($(data).find("body").find("hyperlink") && $(data).find("body").find("hyperlink").attr("call")) {
        //trace("---- HAS HYPERLINK---- "+ $(data).find("body").find("hyperlink").attr("call"));
        dataObj.hyperLinkObj = {};
        dataObj.hyperLinkObj.offSetX = parseFloat($(data).find("body").find("hyperlink").attr("left"));
        dataObj.hyperLinkObj.offSetY = parseFloat($(data).find("body").find("hyperlink").attr("top"));
        dataObj.hyperLinkObj.link = $(data).find("body").find("hyperlink").attr("call");
    }
    dataObj.section.audio = $(data).find("body").find("assets").find("audio").text();

    //dataObj.transcriptContent = $(data).find("transcripts").find("transcript").text();
    return dataObj;
}

XMLParser.getTranscriptContent = function(data) {
    var caption = "";
    caption = $(data).find("transcripts").find("transcript").text();
    return caption;
}
XMLParser.parseShortcutData = function(data) {
    var keyObj = "";
    keyObj = $(data).find("keyCode").text();
    return keyObj;
}
XMLParser.parseGlobalContentData = function(data) {
    //trace($(data).find("globalcontent"));
    var globalObj = {};
    globalObj.courseTitle = $(data).find("globalcontent").find("heading").find("course").text();
    globalObj.nextInstruction = $(data).find("globalcontent").find("additionaltext").find("endnotetxt").text();
    globalObj.copyRight = $(data).find("globalcontent").find("additionaltext").find("copyrighttext").text();
    /*$(data).find("globalcontent").find("heading").children().each(function(){		
    });*/
    return globalObj;
}