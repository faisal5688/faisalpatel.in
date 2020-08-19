var ReplayController = function() {

}

ReplayController.ReplayBtn = function() {
    clearInterval(MainController.intervalValue);
    $("#loadingContainer").css("display", "none");
    MainController.showLoading();
    MainController.PageLoader(currentPageLocationIndex);
    NextBackController.updateNextControl();
}