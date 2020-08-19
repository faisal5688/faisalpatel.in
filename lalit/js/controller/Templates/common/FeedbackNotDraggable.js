(function($) {

    $.fn.drags = function(opt) {

        opt = $.extend({ handle: "#header", cursor: "move" }, opt);

        if (opt.handle === "") {
            var $el = this;
        } else {
            var $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
            if (opt.handle === "") {
                var $drag = $(this).addClass('draggable');
            } else {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            var z_idx = $drag.css('z-index'),
                drg_h = $drag.outerHeight(),
                drg_w = $drag.outerWidth(),
                pos_y = $drag.offset().top + drg_h - e.pageY,
                pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.parents().on("mousemove", function(e) {

                $('.draggable').offset({
                    top: e.pageY + pos_y - drg_h,
                    left: e.pageX + pos_x - drg_w
                }).on("mouseup", function() {
                    $(this).removeClass('draggable').css('z-index', z_idx);
                });

            });
            e.preventDefault(); // disable selection
        }).on("mouseup", function() {
            if (opt.handle === "") {
                $(this).removeClass('draggable');
            } else {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            }
        });

    }
})(jQuery);


var Feedback = {};
Feedback.holder;

Feedback.init = function(obj, containment) {
    Feedback.holder = obj;

    Feedback.holder.hide();
    DataManager.isFeedBackOpen = true;

    Feedback.holder.find("#feedbackHeader span").css("pointer-events", "none");
    Feedback.holder.css({
        "position": "relative",
        "height": "inherit",
        "float":"right",
        "margin":"0",
        "width":"445px"
    });
    Feedback.holder.css("top", "-120px");
    Feedback.holder.css("right", "5px");

    Feedback.holder.find("#feedbackClose").unbind();
    Feedback.holder.find("#feedbackClose").on("click", Feedback.closeFeedback);
    /*
        Feedback.holder.draggable({
            containment: ".mainContent",
            handle: "#mcssFeedbackBox #header",
            start: Feedback.feedbackDragStart,
            stop: Feedback.feedbackDragStop
        });
    
        */

    //  $('#mcssFeedbackBox').drags();

}
Feedback.showFeedback = function(str) {

    Feedback.holder.css("top", "-120px");
    Feedback.holder.css("right", "5px");
    Feedback.holder.find("#feedbackContent").html(str).scrollTop(0);

    Feedback.holder.show();
    $("#feedbackContent").scrollTop(0);

    $(".feedBackContent .titleTxt").css("cursor", "default");
    $("#feedbackContent").scrollTop(0);
}
Feedback.orientationChange = function() {

    Feedback.holder.css("top", "-120px");
    Feedback.holder.css("right", "5px");

}
Feedback.hideFeedback = function() {
    Feedback.holder.hide();
}


Feedback.closeFeedback = function() {
    Feedback.holder.hide();
    $(Feedback).trigger({
        type: "feedbackClosed",
        value: "none"
    });

    Feedback.holder.css("top", "-120px");
    Feedback.holder.css("right", "5px");
};