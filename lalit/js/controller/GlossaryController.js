var GlossaryController = function() {}

GlossaryController.currentActiveAlphabet = "";
GlossaryController.data = "";
GlossaryController.firstClick = true;
GlossaryController.prevClicked;
GlossaryController.currentActiveId;
GlossaryController.onScreenGlossaryClicked = false;

GlossaryController.CreateGlossary = function(strGlossaryJsonDataObj) {

    if (strGlossaryJsonDataObj.length < 26) {
        strGlossaryJsonDataObj.length = 26;
    }
    GlossaryController.data = strGlossaryJsonDataObj;
    var firstLoad = true;
    for (var i = 0; i < strGlossaryJsonDataObj.length; i++) {

        if (strGlossaryJsonDataObj[i] != undefined) {
            for (var j = 0; j < strGlossaryJsonDataObj[i].length; j++) {
                str = "G_" + strGlossaryJsonDataObj[i][j].title;
                str = getInteractionString(str);
            }
            if (firstLoad == true) {
                GlossaryController.showTerms(i, strGlossaryJsonDataObj);
                GlossaryController.currentActiveAlphabet = i;
                firstLoad = false;
                $("#g_tab_" + i).addClass("defaultstate active visited");
                GlossaryController.prevClicked = $("#g_tab_" + i);
            } else {
                $("#g_tab_" + i).addClass("defaultstate active");

            }
        } else {
            $("#g_tab_" + i).addClass("disablelistate");
        }

    }

    GlossaryController.bindGlossaryEvents(strGlossaryJsonDataObj);
}

GlossaryController.bindGlossaryEvents = function(strGlossaryJsonDataObj) {
    $(".defaultstate").click(function() {
        if (!$(this).hasClass("visited")) {
            trace(GlossaryController.prevClicked);
            if (GlossaryController.prevClicked)
                GlossaryController.prevClicked.removeClass("visited");
            GlossaryController.prevClicked = $(this);
            var strId = $(this).attr("id");
            var intIndex = strId.substr(strId.lastIndexOf('_') + 1);
            GlossaryController.showTerms(parseInt(intIndex), strGlossaryJsonDataObj);
            $(this).addClass("visited");
        } else {
            return;
        }
    });

}



GlossaryController.showTerms = function(intAlphabetId, strGlossaryJsonDataObj) {
    GlossaryController.currentActiveId = intAlphabetId;
    trace("intAlphabetId::" + intAlphabetId)
    var leftGlossaryTerms = "<ul>";
    for (var i = 0; i < strGlossaryJsonDataObj[intAlphabetId].length; i++) {

        if (i == 0) {
            leftGlossaryTerms += "<li id='term_" + intAlphabetId + "_" + i + "' class='active' onclick='GlossaryController.showDescription(" + intAlphabetId + "," + i + ",true);'><a class='currentleftnav'><span>" + strGlossaryJsonDataObj[intAlphabetId][i].title + "</span></a></li>";
        } else {

            leftGlossaryTerms += "<li id='term_" + intAlphabetId + "_" + i + "' onclick='GlossaryController.showDescription(" + intAlphabetId + "," + i + ",true);'  ><a  class='currentleftnav'><span>" + strGlossaryJsonDataObj[intAlphabetId][i].title + "</span></a></li>";
        }
    }

    leftGlossaryTerms += "</ul>";
    $("#GlossaryLeftFrame").html(leftGlossaryTerms);

    GlossaryController.showDescription(parseInt(intAlphabetId), parseInt(0), false);

}

GlossaryController.showDescription = function(intAlphabetId, intTermId, flag) {
    if (GlossaryController.firstClick == false) {

        GlossaryController.showIndexing(intAlphabetId, intTermId);
    }
    if (!$("#term_" + intAlphabetId + "_" + intTermId).hasClass("active")) {
        $("#GlossaryLeftFrame .active").removeClass("active");
        $("#term_" + intAlphabetId + "_" + intTermId).addClass("active");
    }
    var rightGlossaryDesription = "" + DataManager.glossaryCollection[intAlphabetId][intTermId].description + "";
    $("#GlossaryDesFrame #descriptionHeader").html("<B>" + DataManager.glossaryCollection[intAlphabetId][intTermId].title + "</B>");
    $("#GlossaryContentFrame").html("<div class='glsContent'>" + rightGlossaryDesription + "</div>");
    $("#GlossaryContentFrame").scrollTop(0);
}

GlossaryController.reset = function() {
    GlossaryController.showTerms(parseInt(GlossaryController.currentActiveAlphabet), GlossaryController.data);
}

GlossaryController.showIndexing = function(intAlphabetId, intTerm) {
    intAlphabetId = GlossaryController.currentActiveId;
    var indexString = GlossaryController.data[intAlphabetId][intTerm].index;
    var intPageIndexArray = indexString.split(',');
    GlossaryController.createIndexing(intPageIndexArray);
}


GlossaryController.createIndexing = function(indexArray) {

    var strPageIndex = '<ul>';
    for (var i = 0; i < indexArray.length; i++) {
        if (DataManager.TOCData[(parseInt(indexArray[i]) - 1)] != undefined && DataManager.TOCData[(parseInt(indexArray[i]) - 1)] != null) {
            var indexTitle = DataManager.TOCData[(parseInt(indexArray[i]) - 1)].title;
            if (indexTitle.search("<br/>") >= 0)
                indexTitle = indexTitle.split("<br/>")[0] + indexTitle.split("<br/>")[1];
            if (!DataManager.isTOCLocked) {
                if (currentPageLocationIndex == (parseInt(indexArray[i]) - 1)) {
                    strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liEnabled"><a id="index_' + indexArray[i] + '" class="pageIndex currentPageIndex pageEnabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                } else {

                    if (indexArray[i] != 0) {
                        strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liEnabled"><a id="index_' + indexArray[i] + '" class="pageIndex pageEnabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                    }

                }

            } else {
                if (currentPageLocationIndex == (parseInt(indexArray[i]) - 1)) {
                    if (DataManager.visitedPageArray[(parseInt(indexArray[i]) - 1)] == 0) {
                        strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liDisabled"><a id="index_' + indexArray[i] + '" class="pageIndex currentPageIndex pageDisabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                    } else {
                        if (indexArray[i] != 0) {
                            strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liEnabled"><a id="index_' + indexArray[i] + '" class="pageIndex currentPageIndex pageEnabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                        }
                    }
                } else {

                    if (DataManager.visitedPageArray[(parseInt(indexArray[i]) - 1)] == 0) {

                        strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liDisabled"><a id="index_' + indexArray[i] + '" class="pageIndex  pageDisabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                    } else {
                        if (indexArray[i] != 0) {
                            strPageIndex += '<li onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');" class="liEnabled"><a id="index_' + indexArray[i] + '" class="pageIndex  pageEnabled" onclick="GlossaryController.jumpToPageLoader($(this),' + indexArray[i] + ');"><span>' + indexTitle + '</span></a></li>';
                        }

                    }


                }
            }
        }
    }
    strPageIndex += '</ul>';
    $("#pageIndexContent").html(strPageIndex);
    $(".pageDisabled").parent().css("cursor", "default");
}

GlossaryController.jumpToPageLoader = function(ele, intPageId) {
    if (!DataManager.isTOCLocked) {
        if (currentPageLocationIndex != (parseInt(intPageId) - 1)) {
            isHomeMenuShown = false;
            ele.addClass("currentPageIndex");
            FunctionLibrary.hidePopup("#glossaryView");
            $('.iosSlider').iosSlider('goToSlide', intPageId);
            FunctionLibrary.hideAnimationPopup($("#navigatorFavoritesBtn"), "#favoritesView");
            MainController.PageLoader(parseInt(intPageId - 1));

        }
    } else {
        if (DataManager.visitedPageArray[(parseInt(intPageId) - 1)] == 1) {
            if (currentPageLocationIndex != (parseInt(intPageId) - 1)) {
                ele.addClass("currentPageIndex");
                FunctionLibrary.hidePopup("#glossaryView");
                $('.iosSlider').iosSlider('goToSlide', intPageId);
                FunctionLibrary.hideAnimationPopup($("#navigatorFavoritesBtn"), "#favoritesView");
                MainController.PageLoader(parseInt(intPageId - 1));
            }
        }
    }
}

GlossaryController.updateGlossary = function() {

    GlossaryController.showTerms(GlossaryController.currentActiveId, GlossaryController.data);

    $(".pageDisabled").parent().css("cursor", "default");
    $(".pageIndex").removeClass("currentPageIndex");
    $("#index_" + (currentPageLocationIndex + 1)).addClass("currentPageIndex");
    $("#index_" + (currentPageLocationIndex + 1)).parent().css("cursor", "default");


}
GlossaryController.setActiveTab = function() {
    var intAlphabetId = GlossaryController.currentActiveId;
    if (!$("#g_tab_" + intAlphabetId).hasClass("visited")) {
        $(".defaultstate").removeClass("visited");
        $("#g_tab_" + intAlphabetId).addClass("visited");
    } else {
        return;
    }


}

GlossaryController.showGlossaryTermsFromPage = function(intAlphabetId, linkTitle) {
    GlossaryController.currentActiveId = intAlphabetId;
    for (var i = 0; i < GlossaryController.data[intAlphabetId].length; i++) {
        if (linkTitle.toLowerCase() == (String(GlossaryController.data[intAlphabetId][i].title).toLowerCase())) {
            $("#term_" + intAlphabetId + "_" + i).trigger("click");
            break;
        }
    }
}
GlossaryController.onGlossaryLink = function(e) {
    var linkStr;
    if ($(this).attr("data-gTitleText") == undefined) {
        linkStr = String($(this).text()).toLowerCase();
    } else {
        linkStr = String($(this).attr("data-gTitleText")).toLowerCase();
    }
    linkStr = $.trim(linkStr);

    var firstChar = linkStr.charCodeAt(0);
    var firstCharPos = 0;
    trace("firstChar:" + firstChar)
    for (var i = 97; i <= 122; i++) {
        if (i == firstChar) {
            break;
        }
        firstCharPos++;
    }
    var tipText = GlossaryController._showGlossaryTermsTooltip(firstCharPos, linkStr);
    $('.glossTooltip').html("").html(tipText);

    $(this).tooltipster({
        contentAsHTML: true,
        content: $('.glossTooltip'),
        contentCloning: false,
        functionInit: function(instance, helper) {
            var content = tipText;
            instance.content(content);

        },
        trigger: 'custom',
        triggerOpen: {
            click: true,
            touchstart: true
        },
        triggerClose: {
            click: true,
            scroll: true,
            tap: true
        },
        maxWidth: 500,
        // arrow: false,
        functionReady: function() {
            var offset = $(this).offset();
            $(".tooltipster-base").offset(offset);
            clearTimeout(changeTooltipPositionTimer);
            changeTooltipPositionTimer = setTimeout(function() {}, 100)
        }

    });
    try { $(".glossaryLink").tooltipster('close'); } catch (err) {};
    $(this).tooltipster('open');





}
var changeTooltipPositionTimer;
$.tooltipster.on('position', function(e) {

    var p = e.position;

    ///alert(!e.helper.geo.origin.fixedLineage)
    if (!e.helper.geo.origin.fixedLineage) {

        var $body = $('.main_cont1'), //$(window.document.body)
            $tooltips = $('.tooltipster-base'),
            mt = parseInt($body.css('margin-top')),
            ml = parseInt($body.css('margin-left')),
            wh = $(window).outerHeight() - parseInt($body.outerHeight()),
            ww = $(window).outerWidth() - parseInt($body.outerWidth());
        // alert(mt + " " + ml)

        p.coord.top = p.coord.top - mt;
        p.coord.left = p.coord.left - ml;
        p.target -= (p.side === 'top' || p.side === 'bottom') ? ml : mt;
        e.edit(p);
        // if ($tooltips.offset().top < $body.offset().top) {
        //     p.side = 'bottom';

        // }
    }
});

var changeTooltipPosition = function(event) {
    clearTimeout(changeTooltipPositionTimer);
    var $body = $('.main_cont1'),
        $tooltips = $('.tooltipster-base'),
        wh = $(window).outerHeight() - parseInt($body.outerHeight()),
        ww = $(window).outerWidth() - parseInt($body.outerWidth()),
        tooltipX = event.pageX + 10,
        tooltipY = event.pageY + 30;

    if ($tooltips.offset().top < $body.offset().top) {
        // $tooltips.css({ top: ($body.offset().top + ($tooltips.outerHeight() / 2) + 50) });
        $tooltips.css({ top: tooltipY });
        //tooltips.tooltipster({ position: "bottom" });
    }

    if ($tooltips.offset().left + $tooltips.outerWidth() > $body.offset().left + $body.outerWidth()) {
        var leftPo = $body.offset().left + $body.outerWidth() - $tooltips.outerWidth() - 10;
        $tooltips.css({ left: leftPo });
    }

    //$('.glossTooltip').fadeIn();
    //$('.glossTooltip').css({ top: tooltipY, left: tooltipX });
    //$('.tooltipster-base').css({ top: tooltipY, left: tooltipX });
};

var hideTooltip = function() {
    $('.glossTooltip').hide();
};
$("#containment").bind({
    mouseleave: hideTooltip
});

GlossaryController._showGlossaryTermsTooltip = function(intAlphabetId, linkTitle) {
    trace("intAlphabetId::::" + intAlphabetId)
        //  GlossaryController.currentActiveId = intAlphabetId;
    for (var i = 0; i < GlossaryController.data[intAlphabetId].length; i++) {
        if (linkTitle.toLowerCase() == (String(GlossaryController.data[intAlphabetId][i].title).toLowerCase())) {
            return GlossaryController.data[intAlphabetId][i].description;
            break;
        }
    }

    return "";
}

GlossaryController.showGlossaryTermsTooltip = function(intAlphabetId, linkTitle) {
    trace("intAlphabetId::::" + intAlphabetId)
    GlossaryController.currentActiveId = intAlphabetId;
    for (var i = 0; i < GlossaryController.data[intAlphabetId].length; i++) {
        if (linkTitle.toLowerCase() == (String(GlossaryController.data[intAlphabetId][i].title).toLowerCase())) {
            return GlossaryController.data[intAlphabetId][i].description;
            break;
        }
    }

    return "";
}

GlossaryController.onGlossaryLinkFromShell = function(e) {
    var linkStr;
    if ($(this).attr("data-gTitleText") == undefined) {
        linkStr = String($(e.target).html()).toLowerCase();
    } else {
        linkStr = String($(this).attr("data-gTitleText")).toLowerCase();
    }

    linkStr = $.trim(linkStr);
    var firstChar = linkStr.charCodeAt(0);
    var firstCharPos = 0;
    for (var i = 97; i <= 122; i++) {
        if (i == firstChar) {
            break;
        }
        firstCharPos++;
    }
    GlossaryController.onScreenGlossaryClicked = true;
    $("#navigatorGlossaryBtn").trigger("click");
    $("#g_tab_" + firstCharPos).trigger("click");
    GlossaryController.showGlossaryTermsFromPage(firstCharPos, linkStr);
}


function getInteractionString(str) {
    var strTemp = str.replace(/\s+/g, '_');
    strTemp = strTemp.replace(/&ndash;/g, '_');
    strTemp = strTemp.replace(/,/g, '_');
    strTemp = strTemp.replace(/&/g, '_');
    return strTemp;
}