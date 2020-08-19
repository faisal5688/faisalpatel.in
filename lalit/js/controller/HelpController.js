var HelpController = function() {

}
var helpData;
var uAgnet = navigator.userAgent;
HelpController.CreateHelp = function(strHelpJsonData) {

    var strhelp = "";
    var i = 0;
    DataManager.isHelpOpen = true;
    helpData = strHelpJsonData;
    if (DeviceHandler.device == 'desktop') {
        strhelp += "<img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/" + strHelpJsonData.help_tab[i].image + ".png'>";
        $("#helpViewMainHeading").html(strHelpJsonData.help_main_heading);
        $("#helpViewContent").html(strhelp);
    } else {
        DeviceHandler.bindOrientaionEvent();
    }

}
HelpController.imageChange = function(orientation, device) {
    var strhelp = "";
    var i = 0;
    if (uAgnet.indexOf(StaticLibrary.ANDROID) >= 0) {

        if (orientation == "portrait") {
            strhelp += "<img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/" + helpData.help_tab[i].image + "_note_portrait.png'>";
        } else {
            strhelp += "<img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/" + helpData.help_tab[i].image + "_note_landscape.png'>";
        }
    } else {
        if (orientation == "portrait") {
            strhelp += "<img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/" + helpData.help_tab[i].image + "_ipad_portrait.png'>";
        } else {
            strhelp += "<img src='" + DataManager.configData[StaticLibrary.CONFIG_COURSE]["courseFolder"] + "/images/" + helpData.help_tab[i].image + "_ipad_landscape.png'>";
        }
    }
    $("#helpViewMainHeading").html(helpData.help_main_heading);
    $("#helpViewContent").html(strhelp);

}