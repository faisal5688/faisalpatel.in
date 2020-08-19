var SubNavMenuController = function() {

}
SubNavMenuController.activeSubNavMenu = 0;
var current = 0;
var prevoiusLength = 0;
//var previousModule=0;
/**
This is used to create the SubMenu 

**/
SubNavMenuController.createSubNavMenu = function() {
    var strNavLink = "";

    for (var i = 0; i < DataManager.multiLevelTOCData[DataManager.currentModule].length; i++) {

        var intPageId = parseInt(DataManager.multiLevelTOCData[DataManager.currentModule][i].pageId) - 1;

        if (i == currentPageLocationIndex) {
            strNavLink += "<a id='subNavLink_" + intPageId + "' class='subNaveMenu screenshot active' onclick='SubNavMenuController.loadPage(" + intPageId + ");' href='javascript:void(0);' pageId='" + DataManager.multiLevelTOCData[DataManager.currentModule][i].pageId + "' rel='m" + properNum(DataManager.currentModule + 1) + "_p" + properNum(i + 1) + ".jpg' title=''></a>";
        } else if (intPageId == 1) {
            strNavLink += "<a id='subNavLink_" + intPageId + "' class='subNaveMenu screenshot visited' onclick='SubNavMenuController.loadPage(" + intPageId + ");' href='javascript:void(0);' pageId='" + DataManager.multiLevelTOCData[DataManager.currentModule][i].pageId + "' rel='m" + properNum(DataManager.currentModule + 1) + "_p" + properNum(i + 1) + ".jpg' title=''></a>";
        } else {
            strNavLink += "<a id='subNavLink_" + intPageId + "' class='subNaveMenu screenshot' onclick='SubNavMenuController.loadPage(" + intPageId + ");'  pageId='" + DataManager.multiLevelTOCData[DataManager.currentModule][i].pageId + "' href='javascript:void(0);' rel='m" + properNum(DataManager.currentModule + 1) + "_p" + properNum(i + 1) + ".jpg' title='' ></a>";
        }

        if (i == (DataManager.multiLevelTOCData[DataManager.currentModule].length - 1)) {
            $(".quickNav").html(strNavLink);
        }

    }


    SubNavMenuController.updateSubNavMenu();
    $(".moduleNo #moduleCount").html("Module " + (DataManager.currentModule + 1));

    /*for showing the thumbnail preview*/
    if (DeviceHandler.device == 'desktop') {
        if (currentPageLocationIndex != 0) {
            SubNavMenuController.screenshotPreview();
        } else {
            $("a.screenshot").unbind('mouseenter').unbind('mouseleave');
            $("a.screenshot").css("cursor", "default");
        }
    }
}

SubNavMenuController.updateSubNavMenu = function() {
    var title = DataManager.TOCData[currentPageLocationIndex].pageId;
    var previousModule = DataManager.currentModule;
    for (var i = 0; i < DataManager.multiLevelTOCData.length; i++) {
        var len = DataManager.multiLevelTOCData[i].length;
        for (var j = 0; j < len; j++) {
            if (title == DataManager.multiLevelTOCData[i][j].pageId) {
                DataManager.currentModule = i;
                j = DataManager.multiLevelTOCData[i].length;
                i = DataManager.multiLevelTOCData.length;
            }
        }
    }

    SubNavMenuController.activeSubNavMenu = currentPageLocationIndex;

    $(".subNaveMenu").removeClass("active");
    $("#subNavLink_" + currentPageLocationIndex).addClass("active");

    for (var i = 0; i < DataManager.visitedPageArray.length; i++) {
        if ($("#subNavLink_" + i).attr("pageId") == undefined) {} else {
            var j = (parseInt($("#subNavLink_" + i).attr("pageId")) - 1);
            if (DataManager.visitedPageArray[j] == 1) {
                $("#subNavLink_" + i).addClass("visited");
            }
        }
    }
    if (DeviceHandler.device == 'desktop') {
        if (currentPageLocationIndex != 0) {
            SubNavMenuController.screenshotPreview();
        } else {
            $("a.screenshot").unbind('mouseenter').unbind('mouseleave');
            $("a.screenshot").css("cursor", "default");
        }
    }
    if (previousModule != DataManager.currentModule)
        SubNavMenuController.createSubNavMenu();

}
SubNavMenuController.updateEnabled = function() {
    if (!$("#quickNav").parent().hasClass("disabled") && currentPageLocationIndex != 0) {
        if (DataManager.visitedPageArray[currentPageLocationIndex] == 1) {
            $("#subNavLink_" + (currentPageLocationIndex + 1)).addClass("visited");
            SubNavMenuController.screenshotPreview();
        }
    }
}

SubNavMenuController.loadPage = function(intPageNumber) {
    if (!$("#quickNav").parent().hasClass("disabled")) {
        if (currentPageLocationIndex != intPageNumber) {
            if (!DataManager.isTOCLocked) {
                $('.iosSlider').iosSlider('goToSlide', intPageNumber + 1);
                MainController.PageLoader(parseInt(intPageNumber));
            } else {
                if (DataManager.visitedPageArray[intPageNumber] == 1 || $("#subNavLink_" + intPageNumber).hasClass("visited")) {
                    $('.iosSlider').iosSlider('goToSlide', intPageNumber + 1);
                    MainController.PageLoader(parseInt(intPageNumber));
                }
            }
        }
    }
}
SubNavMenuController.screenshotPreview = function() {

    /* CONFIG */
    xOffset = 10;
    yOffset = 30;

    // these 2 variable determine popup's distance from the cursor
    // you might want to adjust to get the right result

    /* END CONFIG */
    if (DeviceHandler.device == 'desktop') {
        if (DataManager.isTOCLocked) {
            $("a.visited").hover(function(e) {
                    if (!$(this).hasClass("active")) {
                        var c = "";
                        $("body").append("<p id='screenshot'><img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/thumbnailImages/" + this.rel + "'  />" + c + "</p>");
                        $("#screenshot")
                            .css("top", ((e.pageY - xOffset) - 150) + "px")
                            .css("left", ((e.pageX + yOffset) - 50) + "px")
                            .fadeIn("fast");
                        $(this).css("cursor", "pointer");
                    } else {
                        $(this).css("cursor", "default !important");
                    }
                },
                function() {
                    $("#screenshot").remove();
                });

        } else {
            $("a.screenshot").hover(function(e) {
                    if (!$(this).hasClass("active")) {
                        var c = "";
                        $("#thumbnailContainer").html("<p id='screenshot'><img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/thumbnailImages/" + this.rel + "' />" + c + "</p>");
                        $("#screenshot")
                            .css("top", ((e.pageY - xOffset) - 150) + "px")
                            .css("left", ((e.pageX + yOffset) - 50) + "px")
                            .fadeIn("fast");
                        $(this).css("cursor", "pointer");
                    } else {
                        $(this).css("cursor", "");
                        $(this).css("cursor", "default !important");

                    }
                },
                function() {
                    $("#screenshot").remove();
                });
        }
        $("a.screenshot").mousemove(function(e) {
            $("#screenshot")
                .css("top", ((e.pageY - xOffset) - 150) + "px")
                .css("left", ((e.pageX + yOffset) - 50) + "px");
        });
    }
}

function properNum(n) {
    return n > 9 ? "" + n : "0" + n;
}