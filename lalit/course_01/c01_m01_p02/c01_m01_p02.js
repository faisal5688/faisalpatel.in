var _c01_m01_p04 = null;
var c01_m01_p04 = function () {
    var _self = this;
    var _carouselHolder = $("#carouselHolder, #carousel")
    this.init = function () {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title)


        setTimeout(function () {

            MainController.initializeTemplateInShell();


            _carouselHolder = $("#carouselHolder, #carousel")
            _carouselHolder.css({
                "display": "block",
                "opacity": 1
            });

            $("#PageContent .note").css({
                'display': 'block'
            });
            _self.showDiscription(1);

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);

        $(".button-nav.button-next").off("click").on("click", function(){
            if(carouselManager.carousel){
                carouselManager.carousel.next();
            }
        });

        $(".button-nav.button-prev").off("click").on("click", function(){
            if(carouselManager.carousel){
                carouselManager.carousel.prev();
            }
        });


    }

    this.showDiscription = function (sNo) {

        var _discriptions = $("#PageContent .note .discription");
        _discriptions.hide();

        var __discriptions = $("#PageContent .note .discription_" + sNo)
        __discriptions.show();

        if (sNo >= 6) {
            __discriptions = $("#PageContent .note .discription_" + (sNo - 1))
            __discriptions.show();

        } else {
            _carouselHolder.css({
                "display": "block",
                "opacity": 1
            });
           // carouselManager.carousel.rotCarouse1(0);
        }

    }

}

$(document).ready(function () {
    $(".mainContent .section").show();
    _c01_m01_p04 = new c01_m01_p04();
    _c01_m01_p04.init();
});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m01_p04.playHead_new == _cTime) {
        return;
    }

    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {
        
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section.section1").fadeIn();
            $(".section .section01").fadeIn();
            $(".section1List li p").fadeOut().hide();
            break;
        case 2:
            $(".section1List li .anim_1").fadeIn();
            break;
        case 16:
            $(".section1List li  .anim_1").fadeOut();
            $(".section1List li  .anim_2").fadeIn();
            break;
        case 22:
            $(".section1List li  .anim_2").fadeOut();
            $(".section1List li  .anim_3").fadeIn();
            break;
        case 34:
            $(".section1List li  .anim_3").fadeOut();
            $(".section1List li  .anim_4").fadeIn();
            break;
        case 41:
            $(".section1").hide();
            break;
        case 6:
           // _c01_m01_p04.showDiscription(2)
            break;
        case 7:
            //_c01_m01_p04.showDiscription(3)
            break;
        case 8:
           // _c01_m01_p04.showDiscription(4)
            break;
        case 12:
           // _c01_m01_p04.showDiscription(5)
            break;
        default:
            break;
    }


    c01_m01_p04.playHead_new = _cTime;

}