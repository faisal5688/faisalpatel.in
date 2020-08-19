/** Footer Controller for the entire Application.
 *  
 */

var NavigatorController = function() {

}
var popupCheck;

var eventMgr = new EventManager();
var obj = new Object();
var isFromDetailLink = false;

function gaapHighlightHandler(event) {
    if (DataManager.gaapHighlight == true) {
        GaapController.updataGaap(event.obj.gaapID);
        MainController.showGaapInstruction();
        $("#navigatorGAAPBtn").addClass('GAAPBtnhighlight');
    } else {
        return;
    }
}


NavigatorController.bindNavigatorEvents = function() {

    FunctionLibrary.checkVersion();

    CalculatorController.initialize();
    TranscriptController.initialize();
    eventMgr.addControlEventListener(document, StaticLibrary.GAAP_HIGHLIGHT_EVENT, gaapHighlightHandler);

    /* update state of tile menu and show it*/

    $('#homeMenuBtn').on('click', function(evt) {
        homeBtnClicked = true;
        if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
            popupCheck = false;
            DataManager.AudioPlayStaus = true;
            AudioController.popupPlayPauseControl();
        } else {
            popupCheck = true;
        }

        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");
        TileMenuController.updateMenu();
        MenuController.showTileMenu(evt);
        $('#bottomNav_menu').removeClass("disabled");
        $('#close_tile_menu01').hide();
        $('#close_tile_menu').show();

    });

    $('#close_tile_menu').click(function() {
        TileMenuController.hideTileMenu();
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");

        if (DataManager.audioElement != "" && DataManager.audioElement != null && popupCheck == false) {
            if (!DataManager.audioElement.ended) {
                AudioController.popupPlayPauseControl();
            } else {
                AudioController.popupPlayPauseControl();
            }
        }
    });

    $('#navigatorAudioBtn').click(function() {
        if (!$(this).parent().hasClass("disabled")) {
            AudioController.ManageAudio();
        }
    });

    $("#navigatorMenuBtn").click(function() {

        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");

        if (!$(this).parent().hasClass("disabled")) {

            if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                popupCheck = false;
                DataManager.AudioPlayStaus = true;
                AudioController.popupPlayPauseControl();
            } else {
                popupCheck = true;
            }

            MenuController.reset();
            MenuController.setMenuState();
            $("#menuView").find("#menuViewContent").scrollTop(0);
            FunctionLibrary.showPopup("#menuView");
        }
    });

    $("#menuViewMainClosebtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
        FunctionLibrary.hidePopup("#menuView");

        if (DataManager.audioElement != "" && popupCheck == false) {
            AudioController.popupPlayPauseControl();
        }
    });

    $("#navigatorGAAPBtn").click(function() {
        $("#navigatorGAAPBtn").removeClass('GAAPBtnhighlight');
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, obj);
        eventMgr.dispatchCustomEvent(document, StaticLibrary.GAAP_NOTIFICATION_EVENT, "true", {});

        if (!$(this).parent().hasClass("disabled")) {

            if (!$(this).hasClass("active")) {
                if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                    popupCheck = false;
                    DataManager.AudioPlayStaus = true;
                    AudioController.popupPlayPauseControl();
                } else {
                    popupCheck = true;
                }
                $(this).addClass("active");
                FunctionLibrary.resetAnimatedPopup($(this), "#GaapView");
                MainController.hideGaapInstruction();
            } else {
                eventMgr.dispatchCustomEvent(document, StaticLibrary.GAAP_CLOSE_EVENT, "");
                if (DataManager.audioElement != "" && popupCheck == false) {
                    AudioController.popupPlayPauseControl();
                }
                FunctionLibrary.hideAnimationPopup($(this), "#GaapView");

                $(this).removeClass("active");
            }
        }
    });

    $("#navigatorFavoritesBtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, obj);
        if (!$(this).parent().hasClass("disabled")) {
            if (!$(this).hasClass("active")) {

                if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                    popupCheck = false;
                    DataManager.AudioPlayStaus = true;
                    AudioController.popupPlayPauseControl();
                } else {
                    popupCheck = true;
                }
                $(this).addClass("active");
                FunctionLibrary.resetAnimatedPopup($(this), "#favoritesView");
                FavoriteController.getFavorite();

            } else {
                if (DataManager.audioElement != "" && popupCheck == false) {
                    AudioController.popupPlayPauseControl();
                }
                FunctionLibrary.hideAnimationPopup($(this), "#favoritesView");

                $(this).removeClass("active");
            }
        }
    });

    $("#navigator_new_icon").click(function(event) {
        if (!$(this).parent().hasClass("disabled")) {
            event.preventDefault();
            var email = 'us-eandc@kpmg.com';
            var subject = '';
            var emailBody = '';
            window.location = 'mailto:' + email + '?subject=';
        }
    });

    /*Help button open close event*/
    $("#navigatorHelpBtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");
        if (!$(this).parent().hasClass("disabled")) {
            //NavigatorController.popupOpened();
            if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                popupCheck = false;
                DataManager.AudioPlayStaus = true;
                AudioController.popupPlayPauseControl();
            } else {
                popupCheck = true;
            }
            $("#helpView .helpmain").show();
            FunctionLibrary.showPopup("#helpView");
        }
    });
    $("#helpViewMainClosebtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
        if (DataManager.audioElement != "" && popupCheck == false) {
            if (!DataManager.audioElement.ended) {
                AudioController.popupPlayPauseControl();
            } else {
                AudioController.popupPlayPauseControl();
            }
        }
        FunctionLibrary.hidePopup("#helpView");
    });
    /*End*/


    /*Glossary button open close event*/
    $("#navigatorGlossaryBtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");
        if (!$(this).parent().hasClass("disabled")) {
            //NavigatorController.popupOpened();
            if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                popupCheck = false;
                DataManager.AudioPlayStaus = true;
                AudioController.popupPlayPauseControl();
            } else {
                popupCheck = true;
            }
            GlossaryController.updateGlossary();
            FunctionLibrary.showPopup("#glossaryView");
            if (GlossaryController.firstClick == true) {
                GlossaryController.showIndexing(0, 0);
                GlossaryController.firstClick = false;
            }
        }

    });

    $("#glossaryViewMainClosebtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
        FunctionLibrary.hidePopup("#glossaryView");
        //NavigatorController.popupClosed();
        if (DataManager.audioElement != "" && popupCheck == false) {
            if (!DataManager.audioElement.ended) {
                AudioController.popupPlayPauseControl();
            } else {
                AudioController.popupPlayPauseControl();
            }
        }

    });
    /*End*/

    /*Resource button open close event*/
    $("#navigatorRespurceBtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");
        if (!$(this).parent().hasClass("disabled")) {
            //NavigatorController.popupOpened();
            if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
                popupCheck = false;
                DataManager.AudioPlayStaus = true;
                AudioController.popupPlayPauseControl();
            } else {
                popupCheck = true;
            }
            FunctionLibrary.showPopup("#resourceView");
            if (isFromDetailLink)
                $("#resourceContentFrame .res_tab").eq(1).trigger('click');
            else
                $("#resourceContentFrame .res_tab").eq(0).trigger('click');
        }
    });

    $("#resourceViewMainClosebtn").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
        FunctionLibrary.hidePopup("#resourceView");
        //NavigatorController.popupClosed();	
        if (DataManager.audioElement != "" && popupCheck == false) {
            if (!DataManager.audioElement.ended) {
                AudioController.popupPlayPauseControl();
            } else {
                AudioController.popupPlayPauseControl();
            }
        }
        $(".tabpopup").hide();
        $("#resourceContentFrame .res_tab").removeClass('active_tab');

    });
    /*End*/

    $("#resourceContentFrame .res_tab").click(function() {
        if (!$(this).hasClass('active_tab')) {
            $("#resourceContentFrame .res_tab").removeClass('active_tab');
            $(this).addClass('active_tab');
            $(".tabpopup").hide();
            $("." + $(this).attr('target')).show();

            if (isFromDetailLink) {
                isFromDetailLink = false;
                for (var idx = 0; idx < modulewiseStartEndidx.length; idx++) {
                    if (currentPageLocationIndex >= modulewiseStartEndidx[idx].startIndex && currentPageLocationIndex <= modulewiseStartEndidx[idx].endIndex) {
                        $(".tableD").scrollTop(modulewiseScrollPos[idx]);
                        break;
                    }
                }
            }
        }
    });

    $("#navigatorPlayPauseBtn").click(function() {

        if (!$(this).parent().hasClass("disabled")) {
            if (DataManager.audioElement) {
                if (!$(this).parent().hasClass("play"))
                    DataManager.audioPausedByLearner = true;
                else
                    DataManager.audioPausedByLearner = false;
                AudioController.popupPlayPauseControl();
            }
        }

    });

    $("#navigatorReplayBtn").click(function() {
        //trace("Replay Btn");
        if (!$(this).parent().hasClass("disabled")) {
            ReplayController.ReplayBtn();
        }
    });

    $("#navigatorPlayBookmarkBtn").click(function() {
        //trace("navigatorPlayBookmarkBtn");
        if (!$(this).parent().hasClass("disabled")) {
            FavoriteController.setFavorite();
        }
    });

    $("#bookmarkViewMainClosebtn").click(function() {});

    $(".exitBtn").click(function() {

        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupOpen");

        if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
            popupCheck = false;
            DataManager.AudioPlayStaus = true;
            AudioController.popupPlayPauseControl();
        } else {
            popupCheck = true;
        }
        FunctionLibrary.showPopup("#exitView");

    });

    $("#exitViewMainClosebtn").click(function() {
        FunctionLibrary.hidePopup("#exitView");
    });

    $("#id_btnConfirmExit").click(function() {

        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");

        if (DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseCompliance"] != "local") {
            if (isHomeMenuShown) {
                currentPageLocationIndex--;
            }
            SCORMAPIService.updateScoVariables();
        }

        FunctionLibrary.hidePopup("#exitView");
        if (window.top) {
            window.top.close();
        } else {
            window.close();
        }
    });

    $("#id_btnCancelExit").click(function() {
        eventMgr.dispatchCustomEvent(document, StaticLibrary.CONTROL_AUDIO_VIDEO_EVENT, false, "popupClose");
        if (DataManager.audioElement != "" && popupCheck == false) {
            AudioController.popupPlayPauseControl();
        }
        FunctionLibrary.hidePopup("#exitView");
    });

    $('#exitButton').on('click', function(evt) {
        var ok = confirm('Exit the course?');
        if (ok) {
            window.close();
        }
    });

}

NavigatorController.popupOpened = function() {

    if (DataManager.audioElement != "" && DataManager.AudioPlayStaus != false) {
        popupCheck = false;
        DataManager.AudioPlayStaus = true;
        AudioController.popupPlayPauseControl();
    } else {
        popupCheck = true;
    }
}

NavigatorController.popupClosed = function() {

    if (DataManager.audioElement != "" && popupCheck == false) {
        AudioController.popupPlayPauseControl();
    }
}

NavigatorController.addEventsForDetailLink = function() {
    $(".detail_popup_link").click(function() {
        isFromDetailLink = true;
        $("#navigatorRespurceBtn").trigger('click');
    });
}