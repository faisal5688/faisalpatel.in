var SubmitButton = {};
SubmitButton.holder;

SubmitButton.init = function(obj) {
    SubmitButton.holder = obj;
    SubmitButton.chkSubmitEnable(false);
    SubmitButton.unbindEvents();
    SubmitButton.holder.on("click", function() {
        if (SubmitButton.holder.find("input").hasClass("disabled"))
            return;
        $(SubmitButton).trigger({
            type: "submitClicked",
            value: "none"
        });
        SubmitButton.chkSubmitEnable(false);
    });
}

SubmitButton.chkSubmitEnable = function(flag) {
    if (flag) {
        SubmitButton.holder.find("input").removeClass("disabled").addClass("submitButton");
    } else {
        SubmitButton.holder.find("input").removeClass("submitButton").addClass("disabled");
    }
};

SubmitButton.unbindEvents = function() {
    if (SubmitButton.holder)
        SubmitButton.holder.unbind();
}