var $tile_main_container, $level1_main_container, $selected_menu_container, CNTC_Was_Visible = false;
var eventMgr = new EventManager();

function TileMenuController() {}

TileMenuController.get_level1_menu_template_markup = function() {

    var menu_item_template_markup = "<li id='${id}' class='tile-menu-item tile-menu-level1 status_${status}' level='${level}' first_page_num='${first_page_num}' onclick='TileMenuController.on_item_clicked(event,this);'>";
    menu_item_template_markup += "<div class='tile-menu-bg-color lockTileMenuTile'>";


    //menu_item_template_markup += "<div style='background-image:url(course_01/images/${image})' class='tile-menu-bg-image'></div>";

    // menu_item_template_markup += "<div class='tile-menu-title'><div class='sectionTitle'><span>Module </span><span id='${id}_sec'></span> <span id='${id}_status_icon' class='status_${status}'></span> <img id='${id}_img' src='course_01/images/key_0${status}.png' alt='status' class='tile-menu-status-image'/></div>";

    menu_item_template_markup += "<div class='tile-menu-title'><div class='sectionTitle'><div class='menuWrapper'><div class='icon'></div><span>Module </span><span id='${id}_sec'></span> </div><div class='titletxt'>${title}</div><div id='${id}_status_icon' class='status_icon status_icon_${status}'></div></div></div>";

    //menu_item_template_markup += "";
    menu_item_template_markup += "</div>";
    menu_item_template_markup += "</li>";
    return menu_item_template_markup;
}

TileMenuController.get_level2_menu_template_markup = function() {

    var menu_item_template_markup = "<li id='${id}' class='tile-menu-item tile-menu-level1 status_${status}' first_page_num='${first_page_num}' onclick='TileMenuController.on_item_clicked(event,this); '>";

    menu_item_template_markup += "<div style='background-color:${backgroundColor}' class='tile-menu-bg-color'>";

    //menu_item_template_markup += "<div style='background-image:url(course_01/images/${image})' class='tile-menu-bg-image'></div>";

    // menu_item_template_markup += "<div class='tile-menu-title'> <span id='${id}_status_icon' class='status_${status}'></span> <img id='${id}_img' src='course_01/images/key_0${status}.png' alt='status' class='tile-menu-status-image'/>";

    menu_item_template_markup += "<div class='tile-menu-title'> <span id='${id}_status_icon' class='status_icon status_icon_${status}'></span></div> ";

    menu_item_template_markup += "<div class='titletxt'>${title}</div></div>";
    menu_item_template_markup += "</div>";
    menu_item_template_markup += "</li>";
    return menu_item_template_markup;
}

TileMenuController.updateStatus = function() {

    for (var m = 0; m < DataManager.courseStruct.length; m++) {
        var starPageNum = DataManager.courseStruct[m].first_page_num;
        var totalPages = DataManager.courseStruct[m].totalPages + starPageNum;
        var count = 0;

        for (var p = starPageNum; p < totalPages; p++) {
            count += Number(DataManager.visitedPageArray[p]);
        }

        if (count > 0) {
            if (count == DataManager.courseStruct[m].totalPages) {
                DataManager.courseStruct[m].status = 2
            } else {
                DataManager.courseStruct[m].status = 1;
            }
        }

    }
}

TileMenuController.create_tile_menu = function(menuContainer, menuData) {
    var menu_data = menuData;

    if (!menu_data) {
        return;
    }

    /*for(var i=0;i<19;i++){
    	DataManager.visitedPageArray[i] = 1;
    }*/

    $tile_main_container = $('#tile_menu_container');
    $level1_main_container = $('#' + menuContainer);

    TileMenuController.hideTileMenu();

    var $menu = $('<ul></ul>').attr('id', 'menu_level1');

    $.template('menu_item_template', TileMenuController.get_level1_menu_template_markup());
    $.tmpl('menu_item_template', menu_data).appendTo($menu);

    $desc = $('<li></li>');
    //$desc.append(TileMenuController.description);

    $menu.append($desc);
    $level1_main_container.html($menu);
    TileMenuController.bindEvents();

    for (var m = 0; m < DataManager.courseStruct.length; m++) {
        if (!DataManager.isTOCLocked) {
            if (DataManager.courseStruct[m].status == 0 || DataManager.courseStruct[m].status == 1) {
                DataManager.courseStruct[m].status = 1;
                $('#menu_item_' + (m + 1) + '_img').attr('src', 'course_01/images/key_01.png');
            }
        }
        // $('#menu_item_' + (m + 1) + '_sec').html("").html((m + 1));
        //when module 1 is hide
         $('#menu_item_' + (m + 1) + '_sec').html("").html((m));
    } 

}


TileMenuController.updateMenu = function() {
    //TileMenuController.updateStatus();

    var status = 0;
    for (var m = 0; m < DataManager.courseStruct.length; m++) {

        var _mNo = (m + 1)
        var _menuItem = $('#menu_item_' + _mNo)

        if (DataManager.courseStruct[m].status > 0 && DataManager.courseStruct[m].totalPages > 0) {
            $('#menu_item_' + _mNo + ' .tile-menu-bg-color').removeClass('lockTileMenuTile').css('background-color', DataManager.courseStruct[m].backgroundColor);
            _menuItem.css('cursor', 'pointer').addClass('enabled_menu');
        }

        status = TileMenuController.getTopicStatus(DataManager.courseStruct[m].first_page_num, DataManager.courseStruct[m].totalPages);

        if (status > 0 && DataManager.courseStruct[m].totalPages > 0) {
            DataManager.courseStruct[m].status = status;
            $('#menu_item_' + _mNo + '_img').attr('src', 'course_01/images/key_0' + status + '.png');
        }

        //Enable next module;

        if (status == 3 && m < DataManager.courseStruct.length && DataManager.courseStruct[m].totalPages > 0) {
            if (DataManager.courseStruct[_mNo] && DataManager.courseStruct[_mNo].totalPages > 0) {
                DataManager.courseStruct[_mNo].status = 1;
                $('#menu_item_' + (m + 2) + '_img').attr('src', 'course_01/images/key_01.png');
            }
        }

        _menuItem.removeClass('status_0');
        _menuItem.removeClass('status_1');
        _menuItem.removeClass('status_2');
        _menuItem.addClass('status_' + (status - 1))

        var _status_icon = $('#menu_item_' + _mNo + '_status_icon');
        _status_icon.removeClass('status_0');
        _status_icon.removeClass('status_1');
        _status_icon.removeClass('status_2');

        _status_icon.addClass('status_icon_' + (status - 1))

    }

}

TileMenuController.showTileMenu = function() {

    $('#homeMenuBtn').hide();
    $('#tile_menu_screen_cover').show();

    TileMenuController.enableBottomNavButtons(false);

    $tile_main_container.show();
    MainController.hideLoading();

    if (DataManager.isTrancriptOpen == true) {
        FunctionLibrary.hideTranscriptPopup("#transcriptView");
    }

}

TileMenuController.hideTileMenu = function() {
    homeBtnClicked = false;
    $('#homeMenuBtn').show();
    $('#close_tile_menu').hide();
    $('#tile_menu_screen_cover').hide();
    $tile_main_container.hide();
    TileMenuController.enableBottomNavButtons(true);
    $('#tileBtnNextContainer').hide();
}

TileMenuController.showTopicMenuForModule = function(modId) {
    TileMenuController.updateMenu();
    var id = parseInt(modId, 10) + 1;
    var $main_menu_item = $('#menu_item_' + id);
    $main_menu_item.trigger('click', $main_menu_item);
    TileMenuController.showTileMenu();
}

TileMenuController.on_item_clicked = function(evt, menu_item) {

    var $menu_item = $(menu_item);
    if (!$menu_item.hasClass('enabled_menu')) return;

    isHomeMenuShown = false;
    var parts = $menu_item.attr('id').split('_');
    var mid = parts[2];
    if (DataManager.courseStruct[mid - 1].status > 0 && DataManager.courseStruct[mid - 1].totalPages > 0) {
        TileMenuController.hideTileMenu();
        var pageId = parseInt($menu_item.attr('first_page_num'), 10);
        MainController.jumpToPage(pageId);
    }
}

TileMenuController.on_item_clicked_old = function(evt, menu_item) {

    var $menu_item = $(menu_item);

    if (!$menu_item.hasClass('enabled_menu')) return;

    var level = $menu_item.attr('level');

    if (level == 1) {
        var id = parseInt($menu_item.attr('id').split('_')[2], 10);

        if (id == 1) {
            TileMenuController.hideTileMenu();
            MainController.jumpToPage(0);
        } else {

            if (DataManager.courseStruct[id - 1].status > 0) {
                $selected_menu_container = $('#level2_' + id + '_menu');
                $level1_main_container.hide();
                $('#back_to_menu').show();
                $selected_menu_container.show();
            }
        }

    } else if (level == 2) {
        var parts = $menu_item.attr('id').split('_');
        var mid = parts[2],
            tid = parts[3];
        if (DataManager.courseStruct[mid - 1].topics[tid - 1].status > 0) {
            TileMenuController.hideTileMenu();
            var pageId = parseInt($menu_item.attr('first_page_num'), 10);
            MainController.jumpToPage(pageId);
        }
    }
}

TileMenuController.bindEvents = function() {
    $('#back_to_menu').off('click').on('click', function() {
        $(this).hide();
        $selected_menu_container.hide();
        $level1_main_container.show();
    });

    $('#tileBtnNextContainer').off('click').on('click', function() {
        TileMenuController.hideTileMenu();
    });
}

TileMenuController.getTopicStatus = function(startPageNo, length) {
    var count = 0,
        status = 0;
    for (var i = startPageNo; i < (startPageNo + length); i++) {
        count += Number(DataManager.visitedPageArray[i]);
    }

    if (count == length) {
        status = 3;
    } else if (count > 0 && count < length) {
        status = 2;
    }

    return status;
}

TileMenuController.getModuleStatus = function(modno) {
    var count = 0,
        status = 0;
    for (var t = 0; t < DataManager.courseStruct[modno].topics.length; t++) {
        if (DataManager.courseStruct[modno].topics[t].status == 3) {
            count++;
        }
    }

    if (count == DataManager.courseStruct[modno].topics.length) {
        status = 3;
    } else if (count > 0 && count < DataManager.courseStruct[modno].topics.length) {
        status = 2;
    }

    return status;
}

TileMenuController.enableBottomNavButtons = function(shoudEnable) {

    if (shoudEnable) {

        $('#homeMenuBtn').removeClass("disabled");
        $('#bottomNav_menu').removeClass("disabled");

        $('#bottomNav_help').removeClass("disabled");
        $('#bottomNav_new_icon').removeClass("disabled");

        $('#navigatorBackBtn').parent().removeClass("disabled");
        $('#navigatorNextBtn').parent().removeClass("disabled");

        $('#bottomNav_glossary').removeClass("disabled");
        $('#bottomNav_resource').removeClass("disabled");

        if (!TileMenuController.wasTranscriptDisabled) {
            $('#bottomNav_transcript').removeClass("disabled");
        }
        if (!TileMenuController.wasAudioDisabled) {
            $('#bottomNav_audio').removeClass("disabled");
        }
        $('#bottomNav_replay').removeClass("disabled");
        if (!TileMenuController.wasPauseDisabled) {
            $('#bottomNav_pause').removeClass("disabled");
        }

        $('#topicTitle').show();
        $('#moduleColor').show();

        $('#moduleTitleContainer').show();
        $('.pageCount').show();

    } else {

        TileMenuController.wasTranscriptDisabled = $('#bottomNav_transcript').hasClass("disabled");
        TileMenuController.wasAudioDisabled = $('#bottomNav_audio').hasClass("disabled");
        TileMenuController.wasPauseDisabled = $('#bottomNav_pause').hasClass("disabled");

        $('#homeMenuBtn').addClass("disabled");
        $('#bottomNav_menu').addClass("disabled");

        $('#bottomNav_help').addClass("disabled");
        $('#bottomNav_new_icon').addClass("disabled");

        $('#bottomNav_glossary').addClass("disabled");
        $('#bottomNav_resource').addClass("disabled");
        $('#bottomNav_transcript').addClass("disabled");
        $('#bottomNav_audio').addClass("disabled");
        $('#bottomNav_replay').addClass("disabled");
        $('#bottomNav_pause').addClass("disabled");
        //
        $('#topicTitle').hide();
        $('#moduleColor').hide();

        $('#wrapperCont').css('background-color', "#00338d");
        $('.exitButton_holder').css('border-color', "#00338d");

        if (DeviceHandler.device == StaticLibrary.DESKTOP) {
            $("#exitBtn").hover(function() {
                if ($("#tile_menu_container").is(':visible')) {
                    $(this).css("color", "#00338d");
                }
            }, function() {
                $(this).css("color", "#ffffff");
            });
        }

        // $("#shellCourseTitle").html("Ethics & Integrity: Values in Action");

        $('.pageCount').hide();
        $('#navigatorBackBtn').parent().removeClass("disabled");
        $('#navigatorNextBtn').parent().removeClass("disabled");

    }

    $('#moduleTitleContainer').hide();
    $("#shellCourseTitle").html(globalContentData.courseTitle);

}