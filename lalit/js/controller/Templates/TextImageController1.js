var TextImageObj1 = {};
TextImageObj1.activityCompleted = false;
TextImageObj1.textImageData = "";

TextImageObj1.initTextImage = function(textImageData) {

    TextImageObj1.activityCompleted = false;
    TextImageObj1.textImageData = textImageData;
    TextImageObj1.container = DataManager.templateCurrentParent.find("#textImageContainer");

    var contentImage = new Image();
    TextImageObj1.container.find("#imageHolder").hide();
    TextImageObj1.container.find("#linkHolder").hide();

    try {
        var retina = (window.retina || window.devicePixelRatio > 1);
        if (retina && (DataManager.nAgt.indexOf("iPad")) != -1) {
            $(contentImage).attr("src", DataManager.settingDataObj.appImageURL + TextImageObj1.textImageData.image);
        } else {
            $(contentImage).attr("src", DataManager.settingDataObj.appImageURL + TextImageObj1.textImageData.image);
            if ((DataManager.nAgt.indexOf("Android") != -1)) {
                $("#contentHolder").css("max-width", "650px");
            }
        }
    } catch (err) {
        console.error(err)
    }

    try {
        if (TextImageObj1.textImageData.hyperlinks) {

            var linkcnt = TextImageObj1.textImageData.hyperlinks.length;

            for (var i = 0; i < linkcnt; i++) {
                var linkdetails = TextImageObj1.textImageData.hyperlinks[i];
                var linkHolder = $('<div class="linkHolder"></div>');
                $(linkHolder).css("cursor", "pointer");
                $(linkHolder).css("left", linkdetails.linkX + "px");
                $(linkHolder).css("top", linkdetails.linkY + "px");
                $(linkHolder).css("width", linkdetails.linkW + "px");
                $(linkHolder).css("height", linkdetails.linkH + "px");
                $(linkHolder).attr("linkurl", linkdetails.linkurl);

                $(linkHolder).off("click").on("click", function() {
                    var link = $(this).attr('linkurl');
                    window.open(link, "_blank");
                });

                TextImageObj1.container.append(linkHolder);
            };
        }
    } catch (err) {
        console.error(err)
    }

    try {
        $(contentImage).load(function() {

            TextImageObj1.container.find("#imageHolder").append(contentImage);
            TextImageObj1.container.find("#imageHolder").show();
            TextImageObj1.container.find(".linkHolder").show();

            setTimeout(function() {
                MainController.initializeTemplateInShell();
            }, MainController.pageInterval);

        });

    } catch (err) {
        console.error(err)
    }

    try {
        TextImageObj1.container.find("#contentHolder").html((TextImageObj1.textImageData.content));
        $("#contentHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);

        NavigatorController.addEventsForDetailLink();
    } catch (err) {
        console.error(err)
    }

};

TextImageObj1.linkClickHandler = function(evt) {
    //  trace(TextImageObj1.textImageData.hyperLinkObj.link);
};

//Audio handler
TextImageObj1.pageAudioHandler = function(currTime, totTime) {
    try {
        if ((parseInt(currTime) != 0) && (parseInt(totTime) != 0) && (parseInt(currTime) >= parseInt(totTime))) {
            TextImageObj1.markPageComplete();
        };
    } catch (err) {
        console.error(err)
    }
};

//On Page Complete
TextImageObj1.markPageComplete = function() {
    try {
        if (!TextImageObj1.activityCompleted) {
            TextImageObj1.activityCompleted = true;
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();
        };
    } catch (err) {
        console.error(err)
    }
};