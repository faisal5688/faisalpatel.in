var JSONParser = function() {

};

JSONParser.contentGAAP = [];

/* *** SHELL DATA PARSING ******** */
JSONParser.parseCourseData = function(data) {

    var CourseData = [];
    var pageId = 0;
    var interactionID = 0;

    var curmod = "";
    var course_struct = [];
    var topicId = 0;

    TileMenuController.description = data.CourseData.description;
    TileMenuController.title = data.CourseData.title;

    var _len = data.CourseData.topic.length;

    var courseDetail = {
        'id': data.CourseData.id,
        'title': data.CourseData.title,
        'description': data.CourseData.description
    }

    var _first_page_num = 0;

    for (var t = 0; t < _len; t++) {

        CourseData[t] = [];
        CourseData[t][StaticLibrary.TITLE] = $(data.CourseData.topic[t]).attr(StaticLibrary.TITLE);

        if (CourseData[t][StaticLibrary.TITLE] != curmod) {
            topicId = 0;
            course_struct[DataManager.totalModules] = {
                id: "menu_item_" + (DataManager.totalModules + 1),
                first_page_num: _first_page_num,
                totalPages: data.CourseData.topic[t].page.length,
                number: DataManager.totalModules,
                title: CourseData[t][StaticLibrary.TITLE],
                image: $(data.CourseData.topic[t]).attr('image'),
                backgroundColor: $(data.CourseData.topic[t]).attr('backgroundColor'),
                status: 0
            };

            _first_page_num = _first_page_num + data.CourseData.topic[t].page.length;

            DataManager.totalModules++;
            curmod = CourseData[t][StaticLibrary.TITLE];
        }

        for (var p = 0; p < data.CourseData.topic[t].page.length; p++) {
            pageId++;
            CourseData[t][p] = [];
            CourseData[t][p].moduleId = DataManager.totalModules - 1;
            CourseData[t][p].topicId = topicId - 1;
            CourseData[t][p].pageId = pageId;

            CourseData[t][p][StaticLibrary.TITLE] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.TITLE);

            CourseData[t][p][StaticLibrary.TEMPLATE] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.TEMPLATE);

            CourseData[t][p]['comment'] = $(data.CourseData.topic[t].page[p]).attr("comment");

            CourseData[t][p][StaticLibrary.PAGE_SCRIPT] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.PAGE_DATA);

            CourseData[t][p][StaticLibrary.PAGE_DATA] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.PAGE_DATA);

            CourseData[t][p][StaticLibrary.PAGE_TO_LOAD] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.PAGE_TO_LOAD);


            var _isGroup = $(data.CourseData.topic[t].page[p]).attr('isGroup') || 'false';
            CourseData[t][p]['isGroup'] = _isGroup.toLowerCase();

            var _isInteraction = $(data.CourseData.topic[t].page[p]).attr('isInteraction') || 'false';
            CourseData[t][p]['isInteraction'] = _isInteraction.toLowerCase();

            if (CourseData[t][p]['isInteraction'] == 'true') {
                interactionID++;
                CourseData[t][p]['interactionID'] = interactionID;
            }
            CourseData[t][p][StaticLibrary.IS_ASSESSMENT] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.IS_ASSESSMENT);

            CourseData[t][p][StaticLibrary.HAS_AUDIO] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.HAS_AUDIO);

            CourseData[t][p][StaticLibrary.MARK_VISIT] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.MARK_VISIT);

            CourseData[t][p][StaticLibrary.SHOW_TITLE] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.SHOW_TITLE);

            CourseData[t][p][StaticLibrary.ENABLE_MENU] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.ENABLE_MENU);

            CourseData[t][p][StaticLibrary.NEXT_PAGE_ID] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.NEXT_PAGE_ID);

            CourseData[t][p][StaticLibrary.BACK_PAGE_ID] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.BACK_PAGE_ID);

            CourseData[t][p][StaticLibrary.ENABLE_BACK] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.ENABLE_BACK);

            CourseData[t][p][StaticLibrary.TRANSCRIPT] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.TRANSCRIPT);

            CourseData[t][p][StaticLibrary.PAGE_THEME] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.PAGE_THEME);

            JSONParser.contentGAAP = String($(data.CourseData.topic[t].page[p]).attr(StaticLibrary.GAAP_ID)).split(",");

            //CourseData[t][p][StaticLibrary.GAAP_ID] = $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.GAAP_ID);

            CourseData[t][p][StaticLibrary.GAAP_ID] = JSONParser.contentGAAP;

            if ($(data.CourseData.topic[t].page[p]).attr(StaticLibrary.IS_OBJECTIVE) && $(data.CourseData.topic[t].page[p]).attr(StaticLibrary.IS_OBJECTIVE) == "true") {
                DataManager.objectivePageArr.push(pageId);
            }

        }
    }
    course_struct[0].status = 1;

    DataManager.courseStruct = course_struct;
    DataManager.courseDetail = courseDetail;

    return CourseData;
}

JSONParser.parseConfigData = function(data) {

    var ConfigData = [];
    ConfigData[StaticLibrary.CONFIG_COURSE] = [];
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseID"] = $(data.configData.course).attr("courseID");
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseFolder"] = $(data.configData.course).attr("courseFolder");
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseDataType"] = $(data.configData.course).attr("courseDataType");
    //ConfigData[StaticLibrary.CONFIG_COURSE]["title"] = $(data.configData.course).attr("title");
    ConfigData[StaticLibrary.CONFIG_COURSE]["showIntro"] = $(data.configData.course).attr("showIntro");
    ConfigData[StaticLibrary.CONFIG_COURSE]["introLocation"] = $(data.configData.course).attr("introLocation");
    ConfigData[StaticLibrary.CONFIG_COURSE]["language"] = $(data.configData.course).attr("language");
    ConfigData[StaticLibrary.CONFIG_COURSE]["navigationMode"] = $(data.configData.course).attr("navigationMode");
    ConfigData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] = $(data.configData.course).attr("courseCompliance");

    ConfigData[StaticLibrary.CONFIG_FEATURE] = [];
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showHelp"] = $(data.configData.features).attr("showHelp");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showExit"] = $(data.configData.features).attr("showExit");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showGlossary"] = $(data.configData.features).attr("showGlossary");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showAudio"] = $(data.configData.features).attr("showAudio");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showTranscript"] = $(data.configData.features).attr("showTranscript");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showProgressBar"] = $(data.configData.features).attr("showProgressBar");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showNotepad"] = $(data.configData.features).attr("showNotepad");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showResources"] = $(data.configData.features).attr("showResources");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showFavorite"] = $(data.configData.features).attr("showFavorite");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showSynopsis"] = $(data.configData.features).attr("showSynopsis");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["pageCounterMode"] = $(data.configData.features).attr("pageCounterMode");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["showPageTransition"] = $(data.configData.features).attr("showPageTransition");
    ConfigData[StaticLibrary.CONFIG_FEATURE]["allowSwipe"] = $(data.configData.features).attr("allowSwipe");

    ConfigData[StaticLibrary.CONFIG_ASSESSMENT] = [];
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["available"] = $(data.configData.assessment).attr("available");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["passingPercent"] = $(data.configData.assessment).attr("passingPercent");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["allowRetake"] = $(data.configData.assessment).attr("allowRetake");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["maxAttempts"] = $(data.configData.assessment).attr("maxAttempts");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["randomizeQuestions"] = $(data.configData.assessment).attr("randomizeQuestions");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["randomizeOptions"] = $(data.configData.assessment).attr("randomizeOptions");
    ConfigData[StaticLibrary.CONFIG_ASSESSMENT]["showRemedial"] = $(data.configData.assessment).attr("showRemedial");

    ConfigData[StaticLibrary.CONFIG_SHORTCUTFILEPATH] = [];
    ConfigData[StaticLibrary.CONFIG_SHORTCUTFILEPATH]["shortcutUrl"] = $(data.configData.shortcutFilePath).attr("shortcutUrl");
    return ConfigData;

}

JSONParser.parseCourseDataSingleLevel = function(data) {
    var singleData = [];
    //var counter=0;
    for (var t = 0; t < data.length; t++) {
        for (var p = 0; p < data[t].length; p++) {
            singleData.push(data[t][p]);
        }
    }
    return singleData;
}

JSONParser.parseGlossaryData = function(data) {
    var glossaryAlphabets = [];
    for (var g = 0; g < data.glossary_alphabets.length; g++) {
        if (data.glossary_alphabets[g].terms.length) {
            glossaryAlphabets[g] = [];
            for (var t = 0; t < data.glossary_alphabets[g].terms.length; t++) {
                var itemObj = {};
                itemObj.title = data.glossary_alphabets[g].terms[t].title;
                itemObj.description = data.glossary_alphabets[g].terms[t].description;
                itemObj.index = data.glossary_alphabets[g].terms[t].index;
                glossaryAlphabets[g].push(itemObj);
            }
        }
    }
    /*for(var g=0;g<glossaryAlphabets.length;g++){
     if(glossaryAlphabets[g]!=undefined){
     $("#display").append(alphabets[g]+"<BR>");
     for(var x=0; x<glossaryAlphabets[g].length; x++){
     $("#display").append(glossaryAlphabets[g][x].title+"<BR>");
     $("#display").append(glossaryAlphabets[g][x].description+"<BR><BR>");
     }
     }
     }*/
    return glossaryAlphabets;
}

JSONParser.getTranscriptContent = function(data) {
    var caption = "";
    caption = $(data).find("transcripts").find("transcript").text();
    return caption;
}

JSONParser.parseGlobalContentData = function(data) {
        //trace($(data.globalData).attr("courseTitle"));
        var globalObj = {};
        globalObj.courseTitle = $(data.globalData).attr("courseTitle");
        globalObj.nextInstruction = $(data.globalData).attr("nextInstruction")
        globalObj.copyRight = $(data.globalData).attr("copyRight");
        globalObj.disclaimerText = $(data.globalData).attr("disclaimerText");
        globalObj.welcomeNote = $(data.globalData).attr("welcomeNote");
        return globalObj;
    }
    /* *** SHELL DATA PARSING ENDS ******** */

JSONParser.parseGaapData = function(data) {
        var gappObj = [];
        for (var t = 0; t < data.data.ref_link.length; t++) {
            //trace("id"+$(data.data.ref_link[t]).attr("id"));
            var itemObj = {};
            itemObj.id = $(data.data.ref_link[t]).attr("id");
            itemObj.type = $(data.data.ref_link[t]).attr("type");
            itemObj.label = $(data.data.ref_link[t]).attr("label");
            itemObj.link = $(data.data.ref_link[t]).attr("link");
            itemObj.instruction = $(data.data.ref_link[t]).attr("instruction");
            gappObj.push(itemObj);
        }
        return gappObj;
    }
    /*Parsing Resource Data*/
JSONParser.parseResourceData = function(data) {
        var resourceObj = [];
        for (var t = 0; t < data.resources.links.length; t++) {
            var itemObj = {};
            itemObj.id = $(data.resources.links[t]).attr("id");
            itemObj.link_name = $(data.resources.links[t]).attr("link_name");
            itemObj.type = $(data.resources.links[t]).attr("type");
            itemObj.link = $(data.resources.links[t]).attr("link");
            resourceObj.push(itemObj);
        }
        return resourceObj;
    }
    /*End*/

/*Parsing Resource Data*/
JSONParser.parseDetailsData = function(data) {
        /* var detailsObj = [];
        for (var t = 0; t < data.details.links.length; t++) {
            var itemObj = {};
            itemObj.id = $(data.details.links[t]).attr("id");
            itemObj.link_name = $(data.details.links[t]).attr("link_name");
            itemObj.type = $(data.details.links[t]).attr("type");
            itemObj.link = $(data.details.links[t]).attr("link");
            detailsObj.push(itemObj);
        } */
        return data.details;
    }
    /*End*/

/* ***** TEMPLATE DATA PARSING ********* */
JSONParser.parseMCSSData = function(data) {
    var mcssData = {};
    var jsonData = data.data;
    //trace(jsonData)
    mcssData.question = $(jsonData).attr("question");
    mcssData.scenarioText = $(jsonData).attr("scenarioText");
    mcssData.audio = $(jsonData).attr("audio");
    mcssData.instructionText = $(jsonData).attr("instructionText");
    mcssData.downloadAndroidImages = $(jsonData).attr("downloadAndroidImages");
    mcssData.downloadImages = $(jsonData).attr("downloadImages");

    //console.log($(jsonData.image);
    if (jsonData.image) {
        mcssData.image = {};
        mcssData.image.use_image_tag = $(jsonData.image).attr("use_image_tag");
        mcssData.image.desktop = $(jsonData.image).attr("desktop");
        mcssData.image.ipad = {};
        mcssData.image.ipad.landscape = $(jsonData.image.ipad).attr("landscape");
        mcssData.image.ipad.portrait = $(jsonData.image.ipad).attr("portrait");
    }

    mcssData.responseType = $(jsonData.MCQ).attr("responseType");
    mcssData.maxAttempts = $(jsonData.MCQ).attr("maxAttempts");
    mcssData.correctAnswer = $(jsonData.MCQ).attr("correctAnswer");

    mcssData.options = [];
    for (var c = 0; c < jsonData.MCQ.options.option.length; c++) {
        mcssData.options.push(jsonData.MCQ.options.option[c]);
    }
    //trace("------------------- "+mcssData.options.length)
    mcssData.feedback = {};
    mcssData.feedback.genericResponse = {};
    mcssData.feedback.genericResponse.correct = {};
    mcssData.feedback.genericResponse.correct.content = $(jsonData.MCQ.feedback.genericResponse.correct).attr("content");
    mcssData.feedback.genericResponse.correct.audio = $(jsonData.MCQ.feedback.genericResponse.correct).attr("audio");
    mcssData.feedback.genericResponse.incorrect = {};
    mcssData.feedback.genericResponse.incorrect.content = $(jsonData.MCQ.feedback.genericResponse.incorrect).attr("content");
    mcssData.feedback.genericResponse.incorrect.audio = $(jsonData.MCQ.feedback.genericResponse.incorrect).attr("audio");
    mcssData.feedback.genericResponse.solution = {};
    mcssData.feedback.genericResponse.solution.content = $(jsonData.MCQ.feedback.genericResponse.solution).attr("content");
    mcssData.feedback.genericResponse.solution.audio = $(jsonData.MCQ.feedback.genericResponse.solution).attr("audio");
    mcssData.feedback.genericResponse.partial = {};
    mcssData.feedback.genericResponse.partial.content = $(jsonData.MCQ.feedback.genericResponse.partial).attr("content");
    mcssData.feedback.genericResponse.partial.audio = $(jsonData.MCQ.feedback.genericResponse.partial).attr("audio");

    mcssData.specificResponse = {};
    mcssData.specificResponse.response = [];
    for (var r = 0; r < jsonData.MCQ.feedback.specificResponse.response.length; r++) {
        var responseObj = {};
        responseObj.content = $(jsonData.MCQ.feedback.specificResponse.response[r]).attr("content");
        responseObj.audio = $(jsonData.MCQ.feedback.specificResponse.response[r]).attr("audio");
        mcssData.specificResponse.response[r] = responseObj;
    }

    if (jsonData.fof) {
        mcssData.fof = {};
        mcssData.fof.title = jsonData.fof.title;
        mcssData.fof.content = jsonData.fof.content;
    }

    if (jsonData.detail) {
        mcssData.detail = {};
        mcssData.detail.title = jsonData.detail.title;
        mcssData.detail.content = jsonData.detail.content;
    }

    return mcssData;

}

JSONParser.parseNestedMCSSData = function(data) {
    var mcssNestedData = {};
    mcssNestedData.MCQArr = [];
    var nestedJsonData = data.data;
    mcssNestedData.scenarioText = $(nestedJsonData).attr("scenarioText");
    for (var m = 0; m < nestedJsonData.MCQ.length; m++) {
        var jsonData = nestedJsonData.MCQ[m];
        var mcqData = {};

        mcqData.question = $(jsonData).attr("question");
        mcqData.instructionText = $(jsonData).attr("instructionText");
        mcqData.responseType = $(jsonData).attr("responseType");
        mcqData.maxAttempts = $(jsonData).attr("maxAttempts");
        mcqData.correctAnswer = $(jsonData).attr("correctAnswer");
        mcqData.options = [];
        for (var c = 0; c < jsonData.options.option.length; c++) {
            mcqData.options.push(jsonData.options.option[c]);
        }
        //trace("------------------- "+mcqData.options.length)
        mcqData.feedback = {};
        mcqData.feedback.genericResponse = {};
        mcqData.feedback.genericResponse.correct = {};
        mcqData.feedback.genericResponse.correct.content = $(jsonData.feedback.genericResponse.correct).attr("content");
        mcqData.feedback.genericResponse.correct.audio = $(jsonData.feedback.genericResponse.correct).attr("audio");
        mcqData.feedback.genericResponse.incorrect = {};
        mcqData.feedback.genericResponse.incorrect.content = $(jsonData.feedback.genericResponse.incorrect).attr("content");
        mcqData.feedback.genericResponse.incorrect.audio = $(jsonData.feedback.genericResponse.incorrect).attr("audio");
        mcqData.feedback.genericResponse.solution = {};
        mcqData.feedback.genericResponse.solution.content = $(jsonData.feedback.genericResponse.solution).attr("content");
        mcqData.feedback.genericResponse.solution.audio = $(jsonData.feedback.genericResponse.solution).attr("audio");
        mcqData.feedback.genericResponse.partial = {};
        mcqData.feedback.genericResponse.partial.content = $(jsonData.feedback.genericResponse.partial).attr("content");
        mcqData.feedback.genericResponse.partial.audio = $(jsonData.feedback.genericResponse.partial).attr("audio");

        mcqData.specificResponse = {};
        mcqData.specificResponse.response = [];
        for (var r = 0; r < jsonData.feedback.specificResponse.response.length; r++) {
            var responseObj = {};
            responseObj.content = $(jsonData.feedback.specificResponse.response[r]).attr("content");
            responseObj.audio = $(jsonData.feedback.specificResponse.response[r]).attr("audio");
            mcqData.specificResponse.response[r] = responseObj;
        }
        //trace(mcqData)
        mcssNestedData.MCQArr.push(mcqData);
    }
    return mcssNestedData;
}

JSONParser.parseTextImageData = function(data) {
    var dataObj = data.data;
    var textImgObj = {};

    textImgObj.content = $(dataObj).attr("content");
    textImgObj.image = {};
    textImgObj.image.use_image_tag = $(dataObj.image).attr("use_image_tag");
    textImgObj.image.desktop = $(dataObj.image).attr("desktop");
    textImgObj.image.note = {};
    textImgObj.image.note.landscape = $(dataObj.image.note).attr("landscape");
    textImgObj.image.note.portrait = $(dataObj.image.note).attr("portrait");
    textImgObj.image.ipad = {};
    textImgObj.image.ipad.landscape = $(dataObj.image.ipad).attr("landscape");
    textImgObj.image.ipad.portrait = $(dataObj.image.ipad).attr("portrait");

    if (dataObj.fof) {
        textImgObj.fof = {};
        textImgObj.fof.title = dataObj.fof.title;
        textImgObj.fof.content = dataObj.fof.content;
    }

    if (dataObj.detail) {
        textImgObj.detail = {};
        textImgObj.detail.title = dataObj.detail.title;
        textImgObj.detail.content = dataObj.detail.content;
    }

    return textImgObj;
}

JSONParser.parseTextImageTwoColumnData = function(data) {
    var dataObj = data.data;
    var textImgTwoColObj = {};
    /* textImgTwoColObj.audio = dataObj.audio;  */
    textImgTwoColObj.image = dataObj.image;
    textImgTwoColObj.cuePointsArr = String(dataObj.cuePoints).split(",");
    textImgTwoColObj.sectionArr = [];
    $(dataObj.section).each(function() {
        var section = {};
        section.heading = $(this).attr("heading");
        section.content = $(this).attr("content");
        section.animationType = $(this).attr("animationType");
        textImgTwoColObj.sectionArr.push(section);
        //trace(section);
    });
    return textImgTwoColObj;
}
JSONParser.parseTextImageTwoColumnWithContinueData = function(data) {
    var dataObj = data.data;
    var textImgTwoColObj = {};
    /* textImgTwoColObj.audio = dataObj.audio;  */
    textImgTwoColObj.image = dataObj.image;
    textImgTwoColObj.cuePointsArr = String(dataObj.cuePoints).split(",");
    textImgTwoColObj.sectionArr = [];
    textImgTwoColObj.sectionArr1 = [];
    textImgTwoColObj.continueContent = [];
    $(dataObj.section).each(function() {
        var section = {};
        section.heading = $(this).attr("heading");
        section.content = $(this).attr("content");
        section.animationType = $(this).attr("animationType");
        textImgTwoColObj.sectionArr.push(section);
        //trace(section);
    });
    $(dataObj.section1).each(function() {
        var section1 = {};
        section1.heading = $(this).attr("heading");
        section1.content = $(this).attr("content");
        section1.animationType = $(this).attr("animationType");
        textImgTwoColObj.sectionArr1.push(section1);
        //trace(section);
    });
    $(dataObj.continueContent).each(function() {

        var continueContent = {};
        continueContent.content = $(this).attr("content");
        textImgTwoColObj.continueContent.push(continueContent);

    });
    return textImgTwoColObj;
}

JSONParser.parseImpairmentTestingData = function(data) {
    var dataObj = data.data;
    var textObj = {};
    textObj.tabContent = dataObj.tabContent;
    textObj.exampleTable = dataObj.exampleTable;
    textObj.tabItems = dataObj.tabItems;
    return textObj;
}

JSONParser.parseTextVideoData = function(data) {
    var dataObj = data.data;
    var textVideoObj = {};

    textVideoObj.video = $(dataObj).attr("video");
    textVideoObj.videoDimension = $(dataObj).attr("videoDimension");
    textVideoObj.content = $(dataObj).attr("content");

    if (dataObj.fof) {
        textVideoObj.fof = {};
        textVideoObj.fof.title = dataObj.fof.title;
        textVideoObj.fof.content = dataObj.fof.content;
    }

    return textVideoObj;
}

JSONParser.parseDNDClassificationData = function(data) {
    //trace(data.data);
    var dndObj = {};
    var dndData = data.data;
    dndObj.audio = $(dndData).attr("audio");
    dndObj.scenario = $(dndData).attr("scenarioText");
    dndObj.question = $(dndData).attr("question");
    dndObj.instruction = $(dndData).attr("instructionText");
    dndObj.responseType = $(dndData.DND).attr("responseType");
    dndObj.maxAttempts = $(dndData.DND).attr("maxAttempts");
    dndObj.draggableItems = {};
    dndObj.draggableItems.label = $(dndData.DND.draggableItems).attr("label");
    dndObj.draggableItems.items = [];
    for (var d = 0; d < dndData.DND.draggableItems.items.length; d++) {
        dndObj.draggableItems.items[d] = {};
        dndObj.draggableItems.items[d].target = $(dndData.DND.draggableItems.items[d]).attr("target");
        dndObj.draggableItems.items[d].content = $(dndData.DND.draggableItems.items[d]).attr("content");
        dndObj.draggableItems.items[d].image = $(dndData.DND.draggableItems.items[d]).attr("image");
    }
    dndObj.droppableItems = {};
    dndObj.droppableItems.label = $(dndData.DND.droppables).attr("label");
    dndObj.droppableItems.items = [];
    for (var r = 0; r < dndData.DND.droppables.items.length; r++) {
        dndObj.droppableItems.items[r] = {};
        dndObj.droppableItems.items[r].maxDrop = parseInt($(dndData.DND.droppables.items[r]).attr("maxDrop"));
    }

    dndObj.genericResponse = {};
    dndObj.genericResponse.correct = {};
    dndObj.genericResponse.correct.content = $(dndData.DND.feedback.genericResponse.correct).attr("content");
    dndObj.genericResponse.correct.audio = $(dndData.DND.feedback.genericResponse.correct).attr("audio");
    dndObj.genericResponse.correct.image = $(dndData.DND.feedback.genericResponse.correct).attr("image");
    dndObj.genericResponse.incorrect = {};
    dndObj.genericResponse.incorrect.content = $(dndData.DND.feedback.genericResponse.incorrect).attr("content");
    dndObj.genericResponse.incorrect.audio = $(dndData.DND.feedback.genericResponse.incorrect).attr("audio");
    dndObj.genericResponse.incorrect.image = $(dndData.DND.feedback.genericResponse.incorrect).attr("image");
    dndObj.genericResponse.solution = {};
    dndObj.genericResponse.solution.content = $(dndData.DND.feedback.genericResponse.solution).attr("content");
    dndObj.genericResponse.solution.audio = $(dndData.DND.feedback.genericResponse.solution).attr("audio");
    dndObj.genericResponse.solution.image = $(dndData.DND.feedback.genericResponse.solution).attr("image");

    dndObj.specificResponse = {};
    dndObj.specificResponse.response = [];
    for (var r = 0; r < dndData.DND.feedback.specificResponse.response.length; r++) {
        var responseObj = {};
        responseObj.content = $(dndData.DND.feedback.specificResponse.response[r]).attr("content");
        responseObj.image = $(dndData.DND.feedback.specificResponse.response[r]).attr("image");
        responseObj.header = $(dndData.DND.feedback.specificResponse.response[r]).attr("header");
        dndObj.specificResponse.response[r] = responseObj;
    }
    return dndObj;
}

JSONParser.parseTabData = function(data) {
    var tabObj = {};
    var tabData = data.data;
    tabObj.audio = $(tabData).attr("audio");
    tabObj.align_vertical = $(tabData).attr("align_vertical");
    tabObj.isSequential = $(tabData).attr("isSequential");
    tabObj.tabs = [];
    for (var t = 0; t < tabData.tabItems.length; t++) {
        var tab = {};
        tab.label = $(tabData.tabItems[t]).attr("label");
        tab.audio = $(tabData.tabItems[t]).attr("audio");
        tab.isDisable = $(tabData.tabItems[t]).attr("isDisable");
        tab.markVisit = $(tabData.tabItems[t]).attr("markVisit");
        tab.content = $(tabData.tabItems[t]).attr("content");
        if (tabData.tabItems[t].inputActivity) {
            tab.inputData = [];
            tab.feedback = {};
            tab.maxAttempts = tabData.tabItems[t].maxAttempts;
            for (var i = 0; i < tabData.tabItems[t].inputActivity.length; i++) {
                var inputRef = tabData.tabItems[t].inputActivity[i];
                var obj = {};
                obj.type = inputRef.type;
                obj.correctAnswer = inputRef.answer;
                if (inputRef.type == "input") {
                    //no additional parameters needed as of now
                } else if (inputRef.type == "dropDown") {
                    obj.options = [];
                    for (var p = 0; p < inputRef.options.length; p++)
                        obj.options.push($(inputRef.options[p]).attr("option"));
                }
                tab.inputData.push(obj);
            }
            tab.feedback.correct = tabData.tabItems[t].feedback.correct;
            tab.feedback.incorrect = tabData.tabItems[t].feedback.incorrect;
            tab.feedback.solution = tabData.tabItems[t].feedback.solution;
        }
        tabObj.tabs.push(tab);
    }

    if (tabData.fof) {
        tabObj.fof = {};
        tabObj.fof.title = tabData.fof.title;
        tabObj.fof.content = tabData.fof.content;
    }

    if (tabData.detail) {
        tabObj.detail = {};
        tabObj.detail.title = tabData.detail.title;
        tabObj.detail.content = tabData.detail.content;
    }

    return tabObj;
}

JSONParser.parseClickNLearnData = function(data) {
    var clickData = data.data;
    return clickData;
}

JSONParser.parseClickNLearn_interactivityData = function(data) {
    var clickData = data.data;
    return clickData;
}

JSONParser.parseNavHighlightData = function(data) {
    var navHighlightData = data.data;
    return navHighlightData;
}

JSONParser.parseActivityData = function(data) {
    var actData = data.data;
    return actData;
}

JSONParser.parseloadAnyImageAnyColumnData = function(data) {
        var dataObj = data.data;
        return dataObj;
    }
    /* *****shortcut parser data ****** */
JSONParser.parseShortcutData = function(data) {
        var keyObj = data.keyCode;
        return keyObj;
    }
    /* *****shortcut parser data end****** */
    /* ******** TEMPLATE PARSING ENDS ********** */

/* **** ASSESSMENT DATA PARSING ************ */
JSONParser.parseAssessmentData = function(data) {
        var AssessmentData = [];
        var bankCounter = 0;

        //$(data.assessment.module).each(function(){
        for (var k = 0; k < data.assessment.module.length; k++) {
            $(data.assessment.module[k].pool.bank).each(function() {
                var bankObj = {};

                bankObj.questionsToDisplay = parseInt($(data.assessment.module[k].pool.bank).attr("numQuesToDisplay"));
                bankObj.isRandomize = data.assessment.module[k].pool.bank.isRandomize;
                //alert(bankObj.isRandomize)
                bankObj.questions = [];
                //$($(data.assessment.module[k].pool.bank).attr("question")).each(function(){
                //if($(data.assessment.module[k].pool.bank.question).attr("id")!=undefined){
                //debugger
                //alert("1------- "+data.assessment.module[k].pool.bank.question.length)
                for (var i = 0; i < data.assessment.module[k].pool.bank.question.length; i++) {
                    var questionObj = {};
                    questionObj.type = data.assessment.module[k].pool.bank.question[i].body.MCQ.category;
                    questionObj.correctAns = $(data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice[i]).attr("correct");
                    questionObj.CMIType = $(data.assessment.module[k].pool.bank.question[i]).attr("type");
                    questionObj.id = $(data.assessment.module[k].pool.bank.question[i]).attr("id");

                    questionObj.remedialPage = $(data.assessment.module[k].pool.bank.question[i].body).attr("remedialPage");
                    questionObj.correctAnswer = $(data.assessment.module[k].pool.bank.question[i].body.MCQ).attr("correctAnswer");
                    questionObj.question = $(data.assessment.module[k].pool.bank.question[i].body).attr("question");

                    questionObj.instruction = $(data.assessment.module[k].pool.bank.question[i].body).attr("instruction");
                    questionObj.choices = [];
                    questionObj.choiceData = [];

                    //console.clear();
                    //alert("2------- "+data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice.length)
                    var answers;
                    for (var j = 0; j < data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice.length; j++) {
                        trace(data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice[j]["cdata-section"]);
                        questionObj.choices.push(data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice[j]["cdata-section"]);
                        questionObj.choiceData.push(data.assessment.module[k].pool.bank.question[i].body.MCQ.choices.choice[j]["correct"]);
                        //console.log("*****************************");
                    }
                    bankObj.questions.push(questionObj);
                    trace(questionObj)
                }
                //}

                //});
                AssessmentData[bankCounter] = bankObj;
                bankCounter++;
            });

        }
        //});
        trace(AssessmentData);

        return AssessmentData;
    }
    /*
     JSONParser.parseAssessmentData = function(data){
     var AssessmentData=[];
     var bankCounter=0;
     $(data.assessment.module.pool.bank).each(function(){
     var bankObj = {};
     bankObj.questionsToDisplay = parseInt($(this).attr("numQuesToDisplay"));
     bankObj.questions = [];
     $($(this).attr("question")).each(function(){
     var questionObj = {};
     questionObj.type = $(this).attr("type");
     if($(this).attr("path"))
     questionObj.path = $(this).attr("path");
     questionObj.id = $(this).attr("id");
     questionObj.remedialPage = $(this).attr("remedialPage");
     questionObj.correctAnswer = $(this).attr("correctAnswer");
     questionObj.question = $(this).attr("question");
     questionObj.instruction = $(this).attr("instruction");
     questionObj.choices = [];
     if($(this).attr("choices")){
     for(var c=0;c<$(this).attr("choices").choice.length;c++){
     questionObj.choices.push($(this).attr("choices").choice[c]);
     }
     }
     bankObj.questions.push(questionObj);
     });
     AssessmentData[bankCounter] = bankObj;
     bankCounter++;
     });
     //trace(AssessmentData[0]);
     return AssessmentData;
     }*/
    /*assessment Start END page data */
JSONParser.parseAssessmentStartEnd = function(data) {
    //trace($($(data).find("body").find("text")[0]).text())
    //	var dataObj={};
    //	var jsonData = data.data.startPage;
    //	dataObj.startPageObj = {};
    //	dataObj.startPageObj.incomplete = $(jsonData.text)[0];
    //	dataObj.startPageObj.info = $(jsonData.text)[3]+"#"+$(jsonData.text)[4];
    //	dataObj.startPageObj.complete = $(jsonData.text)[1]+"#"+$(jsonData.text)[2];
    //	dataObj.startPageObj.instruction = $(jsonData.instructionText).attr("text");
    //	dataObj.startPageObj.additionalText = $(jsonData.additionalText).attr("text");
    //	return dataObj;

    trace(data.data.body.bodyText);
    trace("JSONParser.parseAssessmentStartEnd");

    var dataObj = {};
    var xmlData = data.data.body.bodyText;
    //start page content
    dataObj.startPageObj = {};
    dataObj.startPageObj.incomplete = xmlData.text[0];
    dataObj.startPageObj.info = xmlData.text[6] + "#" + xmlData.text[7];
    dataObj.startPageObj.complete = xmlData.text[2] + "#" + xmlData.text[3];
    dataObj.startPageObj.instruction = data.data.body.instructionText;
    dataObj.startPageObj.additionalText = data.data.body.additionalText;

    //result page content
    dataObj.resultPageObj = {};
    trace(data.data.AssessmentResult.Assessment);
    var resultData = data.data.AssessmentResult.Assessment;
    dataObj.resultPageObj.title = $(resultData).attr("pageTitle");
    dataObj.resultPageObj.resultLabel = $(resultData).attr("ResultText");
    dataObj.resultPageObj.scoreLabel = $(resultData).attr("ScoreText");
    dataObj.resultPageObj.percentLabel = $(resultData).attr("PercentText");
    dataObj.resultPageObj.passObj = {};
    dataObj.resultPageObj.passObj.message = resultData.PassText.CongtateText;
    dataObj.resultPageObj.passObj.instruction = resultData.PassText.InstructionText;
    dataObj.resultPageObj.passObj.audio = resultData.PassText.audio;
    dataObj.resultPageObj.failObj = {};
    dataObj.resultPageObj.failObj.message = resultData.FailText.FailSubTitle;
    dataObj.resultPageObj.failObj.instruction = resultData.FailText.Retake.RetakeInstructionText;
    dataObj.resultPageObj.failObj.audio = resultData.FailText.audio;
    ////trace(dataObj);
    return dataObj;

};


JSONParser.parseAccordionData = function(data) {
    var accData = data.data;
    var accordionData = {};

    accordionData.contents = accData.content;
    accordionData.accordionItems = accData.accordion;

    if (accData.fof) {
        accordionData.fof = {};
        accordionData.fof.title = accData.fof.title;
        accordionData.fof.content = accData.fof.content;
    }

    if (accData.detail) {
        accordionData.detail = {};
        accordionData.detail.title = accData.detail.title;
        accordionData.detail.content = accData.detail.content;
    }

    return accordionData;
}

JSONParser.parseClickRevealData = function(data) {
    var crData = data.data;
    var clickRevealData = {};

    clickRevealData.contents = crData.content;
    clickRevealData.tabs = crData.tabs;

    if (crData.fof) {
        clickRevealData.fof = {};
        clickRevealData.fof.title = crData.fof.title;
        clickRevealData.fof.content = crData.fof.content;
    }

    if (crData.fof1) {
        clickRevealData.fof1 = {};
        clickRevealData.fof1.title = crData.fof1.title;
        clickRevealData.fof1.content = crData.fof1.content;
    }

    if (crData.detail) {
        clickRevealData.detail = {};
        clickRevealData.detail.title = crData.detail.title;
        clickRevealData.detail.content = crData.detail.content;
    }

    return clickRevealData;
}

/* ***** PARSING ENDS ******** */