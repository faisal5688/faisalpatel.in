var TranscriptController = function() {}

/**
This is used to create the transcript containing the two parameter
strTranscriptJsonDataObj	->	Contain the transcript data object
intPageNumber				->	corresponding page index whose transcript need to be loaded
**/

TranscriptController.initialize = function() {
    $("#navigatorTranscriptBtn").on("click", function(event) {
        if (DataManager.isTrancriptOpen == false) {
            if (!$(this).parent().hasClass("disabled")) {
                $(this).parent().addClass("disabled");
                $("#transcriptPopup").show();
                FunctionLibrary.showTranscriptPopup("#transcriptView");
            }
        }
    });

    DataManager.transcriptView_initX = $("#transcriptView").css('left');
    DataManager.transcriptView_initY = $("#transcriptView").css('bottom');

    $("#transcriptViewMainClosebtn").on("click", function(event) {
        $("#navigatorTranscriptBtn").parent().removeClass("disabled");
        $("#transcriptPopup").hide();
        FunctionLibrary.hideTranscriptPopup("#transcriptView");

    });

    $("#transcriptPopup").draggable({ containment: '#containment', handle: "#transcriptHeaderPanel" });

    //FunctionLibrary.setDraggablePopup($("#transcriptPopup"));
}

TranscriptController.CreateTranscript = function(intPageNumber) {
    TranscriptController.pNo = intPageNumber
    TranscriptController.baseTranscript();
}

TranscriptController.baseTranscript = function() {
    var str = DataManager.TOCData[TranscriptController.pNo][StaticLibrary.TRANSCRIPT];
    TranscriptController.update(str)
}

TranscriptController.update = function(str) {
    $("#transcriptViewContent").html(str);
    $("#transcriptViewContent").scrollTop(0);
}