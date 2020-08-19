var DisclaimerController = {};

DisclaimerController.init = function() {
    $("#disclaimerBox #disclaimerTxt").html(globalContentData.disclaimerText);
    DisclaimerController.addDisclaimerEvents();
}

DisclaimerController.addDisclaimerEvents = function() {
    $("#disclaimerBox #disclaimer_AcceptBtn").on("click", DisclaimerController.acceptDisclaimer);
}

DisclaimerController.acceptDisclaimer = function(evt) {
    FunctionLibrary.hideDisclaimer();
    AudioController.InitializeAudioElement('#audioPlayerObj');
}