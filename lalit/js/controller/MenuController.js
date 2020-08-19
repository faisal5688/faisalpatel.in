var MenuController = function() {

}
MenuController.prev_id = '';
MenuController.selectedModuleMenu = null;
MenuController.selectedTopicMenu = null;

MenuController.CreateMultiLevelMenu = function(MenuJsonData) {
    // trace("TOC DATA::" + MenuJsonData);

    var strDefaultClass = 'unlocked';
    if (DataManager.isTOCLocked)
        strDefaultClass = 'disabled';
    var intPagecounter = 0;
    var strMenu = "<ul>";

    for (var i = 0; i < MenuJsonData.length; i++) {

        for (j = 0; j < MenuJsonData[i].length; j++) {
            strMenu += '<li><a class="text linkData ' + strDefaultClass + '" onclick="MenuController.checkForLoadPage(' + intPagecounter + ');" id="page_link_' + intPagecounter + '">' + MenuJsonData[i][j].title + '<span class="state"></span></a> </li>';

            intPagecounter++;
        }
    }
    strMenu += "</ul>";
    $("#menuViewContent").html(strMenu);
}

/**This function is for creating the multi level menus for the first time**/

MenuController.CreateMenu = function(MenuJsonData) {

    TileMenuController.create_tile_menu('level1_menu', DataManager.courseStruct)

    var strDefaultClass = 'unlocked';

    if (DataManager.isTOCLocked)
        strDefaultClass = 'disabled';
    var strMenu = "<ul class='module-menu'>";

    var intPagecounter = 0;
    var totalPages = 0;
    var pageNo = 0;

    for (var t = 0; t < DataManager.courseStruct.length; t++) {
        var _len = MenuJsonData[t].length
        totalPages += parseInt(_len)
    }

    for (var m = 0; m < DataManager.courseStruct.length; m++) {
        strMenu += "<li id='main_module_" + m + "' class='main-menu-item menu-item'><span onclick='MenuController.onMainMenu_clicked(event,this);'>" + DataManager.courseStruct[m].title + "</span>";
        strMenu += "<ul id='page_container_" + m + "' isOpened='0' class='page-menu hide-menu-item'>";

        var strMenu1 = "";
        var _len = MenuJsonData[m].length
        for (var j = 0; j < _len; j++) {
            pageNo = parseInt(pageNo) + 1;
            pageNo = (pageNo < 10 ? "0" : "") + pageNo;
            MenuJsonData[m][j].pageNo = pageNo + "/" + totalPages;
            strMenu1 += '<li class="menu-item"><a class="text linkData ' + strDefaultClass + '" onclick="MenuController.checkForLoadPage(' + intPagecounter + ');" id="page_link_' + intPagecounter + '">' + MenuJsonData[m][j].title + '<span class="state"></span></a></li>';
            intPagecounter++;
        }
        strMenu += strMenu1 + "</ul></li>";
    }

    strMenu += "</ul>";

    $("#menuViewContent").html(strMenu);
}

MenuController.onMainMenu_clicked = function(evt, item) {

    if (evt) {
        evt.preventDefault();
    }

    if (MenuController.selectedModuleMenu) {
        MenuController.selectedModuleMenu.slideUp();
        MenuController.selectedModuleMenu.attr('isopened', '0');
    }

    MenuController.selectedModuleMenu = $($(item).parent().find('.page-menu')[0]);

    var cur_id = MenuController.selectedModuleMenu.attr('id');
    var isopened = MenuController.selectedModuleMenu.attr('isopened');

    if (isopened == '0') {
        if (cur_id != MenuController.prev_id) {
            MenuController.selectedModuleMenu.slideDown();
            MenuController.selectedModuleMenu.attr('isopened', '1');
            MenuController.prev_id = cur_id;
        } else {
            MenuController.prev_id = '';
        }
    }
}

MenuController.onTopicMenu_clicked = function(evt, item) {

    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    if (MenuController.selectedTopicMenu) {
        MenuController.selectedTopicMenu.slideUp();
    }
    MenuController.selectedTopicMenu = $(item).parent().find('.page-menu');
    MenuController.selectedTopicMenu.slideDown();
}

/**this function is for checking the States of menu and accordingly loading the page  **/

MenuController.checkForLoadPage = function(intPgId) {
    if (DataManager.isTOCLocked) {
        if (!$("#page_link_" + intPgId).hasClass("current")) {
            if (($("#page_link_" + intPgId).hasClass("enabled")) || ($("#page_link_" + intPgId).parent().hasClass("completed") && intPgId != (currentPageLocationIndex))) {
                DataManager.menuOpenState = true;
                currentPageLocationIndex = intPgId;
                if (DataManager.audioElement != "") {
                    DataManager.audioElement.pause();
                }
                NextBackController.updatedNavigationButton();
                $("#page_link_" + intPgId).removeClass("enabled");
                $("#navigatorMenuBtn").removeClass("active");
                FunctionLibrary.hideAnimationPopup($("#navigatorMenuBtn"), "#menuView");
                MainController.jumpToPage(intPgId);
            }
        } else {
            return;
        }
    } else {

        if (!$("#page_link_" + intPgId).hasClass("current")) {
            DataManager.menuOpenState = true;
            currentPageLocationIndex = intPgId;
            if (DataManager.audioElement != "") {
                DataManager.audioElement.pause();
            }

            NextBackController.updatedNavigationButton();
            $("#page_link_" + intPgId).removeClass("enabled");
            $("#navigatorMenuBtn").removeClass("active");

            MainController.jumpToPage(intPgId);
            FunctionLibrary.hideAnimationPopup($("#navigatorMenuBtn"), "#menuView");
        } else {
            return;
        }
    }

    MenuController.setMenuState();
}

MenuController.showTileMenu = function(evt) {
    TileMenuController.showTileMenu();
}

/**function to set different states  of menu according to the current page and the visited pages**/
MenuController.setMenuState = function() {
        if (DataManager.isTOCLocked) {
            var lastVsitedPage = 0;
            $("#menuView .current").removeClass("current");
            $("#menuView .enabled").removeClass("enabled");
            for (var i = 0; i < DataManager.visitedPageArray.length; i++) {
                if (DataManager.visitedPageArray[i] == 1) {
                    $("#page_link_" + i).parent().addClass("completed").removeClass("current disabled");
                    $("#page_link_" + i).removeClass("disabled");
                    lastVsitedPage = i;
                }
            }

            $("#page_link_" + (currentPageLocationIndex)).addClass("current");

            if ($("#page_link_" + (currentPageLocationIndex)).hasClass("current") && ($("#page_link_" + (currentPageLocationIndex)).parent().hasClass("completed"))) {
                $("#page_link_" + (lastVsitedPage + 1)).addClass("enabled").removeClass("disabled");
            }

        } else {
            var lastVsitedPage = 0;
            $("#menuView .current").removeClass("current");
            $("#menuView .enabled").removeClass("enabled");
            for (var i = 0; i < DataManager.visitedPageArray.length; i++) {
                if (DataManager.visitedPageArray[i] == 1) {
                    $("#page_link_" + i).parent().addClass("completed").removeClass("current");
                    lastVsitedPage = i;
                }
            }

            /*setting current page*/
            $("#page_link_" + (currentPageLocationIndex)).addClass("current");

            /*setting the enable state*/
            if ($("#page_link_" + (currentPageLocationIndex)).hasClass("current") && ($("#page_link_" + (currentPageLocationIndex)).parent().hasClass("completed"))) {
                $("#page_link_" + (lastVsitedPage + 1)).addClass("enabled");
            }
        }

        setTimeout(function() {
            var modId = DataManager.TOCData[currentPageLocationIndex].moduleId;
            var mod_menu_item = $('#main_module_' + modId).find('span');
            MenuController.onMainMenu_clicked(undefined, mod_menu_item);
        }, 20);
    }
    /*Binding events for the menu*/
MenuController.bindEvents = function() {
    $(".toggleMenu").click(function() {
        var intSubModuleIndex = parseInt($(this).attr("id").slice($(this).attr("id").indexOf("_") + 1));
        MenuController.toggleMenuAndClosePrevoius(intSubModuleIndex, $("#sub_module_" + intSubModuleIndex).hasClass('collapse'));
    });
}

/*If we don't need to close the previous opened Menu after clicking the next Menu*/
MenuController.toggleMenu = function(intIndex) {
    if ($("#module_" + intIndex).hasClass('collapse')) {
        MenuController.toggleClass($("#module_" + intIndex), 'expand', 'collapse');
        MenuController.toggleClass($("#sub_module_" + intIndex), 'hideSubMenu', 'showSubMenu');
    } else {
        MenuController.toggleClass($("#module_" + intIndex), 'collapse', 'expand');
        MenuController.toggleClass($("#sub_module_" + intIndex), 'showSubMenu', 'hideSubMenu');
    }
}

/*If need to close the prevoius menu after clicking on the next Menu*/
MenuController.toggleMenuAndClosePrevoius = function(intIndex) {
    $(".toggleMenu").removeClass('collapse').addClass('expand');
    $(".subMenus").removeClass('showSubMenu').addClass('hideSubMenu');

    MenuController.toggleClass($("#module_" + intIndex), 'collapse', 'expand');
    MenuController.toggleClass($("#sub_module_" + intIndex), 'showSubMenu', 'hideSubMenu');
}

MenuController.toggleClass = function(element, strClsToAdd, strClsToRmv) {
    element.addClass(strClsToAdd).removeClass(strClsToRmv);
}

MenuController.reset = function() {
    $('.page-menu').slideUp().attr('isopened', '0');;
    MenuController.selectedModuleMenu = undefined;
    MenuController.prev_id = '';
}