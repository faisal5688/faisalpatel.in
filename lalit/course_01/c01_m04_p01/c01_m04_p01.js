var c01_m04_p01 = function () {
    var _this = this;
    this.init = function () {

        try {
            _jsonData = DataManager.templateXMLData.data;
        } catch (err) {
            console.log(err)
        }

        $("#sectionHolder").prepend("<div class='page_title'></div>");
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);

        //this.addEvents();
        setTimeout(function () {
            MainController.initializeTemplateInShell();

            //  var _audioData = _jsonData['audio']
            //  AudioController.updateInternalAudio(_audioData)

        }, MainController.pageInterval);


    }
    this.addEvents = function () {
        $('.firstbutton').off("click").on("click", function () {
            $('.section_01').hide();
            $('.section_02').show();
        })
        // $('.section_02 .checkBox').off("click").on("click", function() {
        //     $(this).toggleClass("mcssbulletPointsSelected");
        //     _this.checkSubmitEnable()
        // })
        // $('.section_02 .txt').off("click").on("click", function() {
        //     $(this).parents('.mcssOption').find('.checkBox').toggleClass("mcssbulletPointsSelected");
        //     _this.checkSubmitEnable()
        // })
        $('.section_02 .submitBtn').off("click").on("click", function () {
            if ($(this).hasClass('disabled')) return;
            //$('.section_02 .sectionpopupHolder').show();
            _this.genratePdf()
            MainController.markCurrentPageComplete();
            MainController.showNextInstruction();

        })
        $('.section_02 .launchInstrClose').off("click").on("click", function () {
            $('.section_02 .sectionpopupHolder').hide();
        })

        $('.myInput').bind('input propertychange', function () {
            if (this.value.length) {
               _this.checkSubmitEnable(true)
            }
        });

        


    }
    this.genratePdf = function () {
        try {
            var pdfArray = [];
            // $(".mcssbulletPointsSelected").each(function() {
            //     var section = ""
            //     if ($(this).attr("data-section") == "1") {
            //         section = "Reminders: "
            //     } else if ($(this).attr("data-section") == "2") {
            //         section = "Community and communication: "
            //     } else if ($(this).attr("data-section") == "3") {
            //         section = "Positive social norms: "
            //     } else if ($(this).attr("data-section") == "4") {
            //         section = "Rewards: "
            //     }
            //     pdfArray.push([section + $(this).parents('.mcssOption').find('.txt').text(), " "])
            // })

            $(".section_02 .myInput").each(function () {
                //alert($(this).val().length)
                // if ($(this).val().length > 1) {
                //     pdfArray.push([$(this).val()])
                // }
                pdfArray.push([$(this).parents('.inputOption').find('.txt').text()])
                pdfArray.push([$(this).val()])

            });
            // for (var i = 0; i <= 4; i++) {
            //     pdfArray.push([" ", " "])
            // }
            console.log(pdfArray)
            var doc = new jsPDF()

            // img.onload = function() {
            // alert("genratePdf")
            doc.addImage(img, 'JPG', 0, 0);
            //doc.text(15, 105, 'In your career -- and your life -- thus far, you have likely encountered situations when your values conflicted with what you were asked to do. Often it is not easy to align your own personal values and purpose with those of your boss, your co-workers, your direct reports, your customers/clients, or your firm at work (and of course, with others in life more generally). This exercise is designed to help you identify and develop the competencies necessary to achieve that alignment.');
            doc.autoTable({
                // style: { font: 'times' },
                // headStyles: { fillColor: [71, 10, 104], fontStyle: 'bold', halign: 'center', cellPadding: Padding = 2, lineColor: Color = 10, lineWidth: number = 0.3 },
                // columnStyles: { 0: { height: 'auto', halign: 'left', cellWidth: number = 140, cellPadding: Padding = 2, lineColor: Color = 10, lineWidth: number = 0.3 }, 1: { height: 'auto', halign: 'center', cellWidth: number = 40, cellPadding: Padding = 2, lineColor: Color = 10, lineWidth: number = 0.3 } },
                margin: { top: 120, bottom: 20 },
                didDrawPage: function (data) {
                    data.settings.margin.top = 10;
                },
                // head: [
                //     ['My Commitment(s)', 'Check-in date']
                // ],
                body: pdfArray,
            })

            var addFooters = function (doc) {
                var pageCount = doc.internal.getNumberOfPages();

                var footerText = "Then open your calendar and add your commitment to the appropriate date so that you can reflect on what you have accomplished and determine next steps.";

                doc.setFont('helvetica', 'italic')
                doc.setFontSize(8)
                doc.setTextColor(100, 0, 0);
                for (var i = 1; i <= pageCount; i++) {
                    doc.setPage(i)
                    /*doc.text(footerText, doc.internal.pageSize.width / 2, 287, {
                            align: 'left'
                        })*/
                    /*doc.text('Page ' + String(i) + ' of ' + String(pageCount), doc.internal.pageSize.width / 2, 287, {
                        align: 'left'
                    })*/

                    doc.addImage(footImg, 'JPG', 0, 280)

                }
            }

            addFooters(doc);

            doc.save('MyCommitment.pdf');

            // };

        } catch (err) { };
    }
    this.checkSubmitEnable = function (bo) {
        // bo = false;
        // $('.section_02 .checkBox').each(function() {
        //     if ($(this).hasClass('mcssbulletPointsSelected')) {
        //         bo = true;
        //         return false;
        //     }
        // })

        if (bo) {
            $('.submitBtn').removeClass('disabled');
        } else {
            $('.submitBtn').addClass('disabled');
        };


    }

}
var img = new Image();
var footImg = new Image();
$(document).ready(function () {
    $(".mainContent .section").show();
    var _c01_m04_p01 = new c01_m04_p01();
    _c01_m04_p01.init();
    //img.crossOrigin = "";
    img.src = './assets/images/pdf_header.jpg';
    //footImg.crossOrigin = "";
    footImg.src = './assets/images/pdf_footer.jpg';

    img.onload = function () {
        //alert("img")
    }

    footImg.onload = function () {
        //alert("footImg")
    }

});

function pageAudioHandler(currTime, totTime) {

    var _cTime = parseInt(currTime)
    var _tTime = parseInt(totTime)

    if (c01_m04_p01.playHead_new == _cTime) {
        return;
    }

    //   console.log("pageAudioHandler:  _cTime", _cTime, "  _tTime:   ", _tTime)

    if (_cTime >= _tTime) {
        $('.instxt').show();
        $('.firstbutton').show()
        var _c01_m04_p01 = new c01_m04_p01();
        _c01_m04_p01.addEvents();
        // MainController.markCurrentPageComplete();
        // MainController.showNextInstruction();
    }

    switch (_cTime) {
        case 0:
            $(".mainContent .section.section1").fadeIn();
            $(".section .section01").fadeIn();
            break;
        default:
            break;
    }


    c01_m04_p01.playHead_new = _cTime;

}