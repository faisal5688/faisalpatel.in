var TextImageObj = {};
var TextImageData;
TextImageObj.currentSection = 0;
TextImageObj.initTemplate = true;
var evtMrg = new EventManager();

/*
 @ this array store the refrence of the content images
 */
TextImageObj.imgRefArr = [];

TextImageObj.initTextSection = function(data, initTemplate) {
        TextImageData = data;
        TextImageObj.initTemplate = (initTemplate == undefined) ? true : initTemplate;
        TextImageObj.showSection(0);
        //initialise FOF content popup
        if (TextImageData.fof) {
            Fof.initFOF(TextImageData.fof);
            $('#fof_button_holder').show();
            $('#fof_note').show();
            $('#fof_button').addClass('disabled');
        } else {
            $('#fof_button_holder').hide();
            $('#fof_note').hide();
        }

        //initialise Detail content popup
        if (TextImageData.detail) {
            Detail.initDetail(TextImageData.detail);
            $('#details_button_area').show();
        } else {
            $('#details_button_area').hide();
        }

    }
    /*
     @on orientaion change this function changes the images src and load it
     */

TextImageObj.onOrientationChange = function() {
    for (var i = 0; i < TextImageObj.imgRefArr.length; i++) {
        TextImageObj.imgRefArr[i].onOrientaionChange();
    }
}

TextImageObj.showSection = function(ind) {
    var container = $("#textImageContainer #sectionHolder");

    /*
     @ this create new image object and set it according to the type whether to use as image tag or background image
     */

    var contentImage = new ImageMain($("#imageHolder"), TextImageData.image.use_image_tag);
    var contentImage2 = new ImageMain($(".secondImg #imageHolder"), TextImageData.image.use_image_tag);
    contentImage.setObject(TextImageData.image);
    contentImage2.setObject(TextImageData.image);
    TextImageObj.imgRefArr.push(contentImage);
    TextImageObj.imgRefArr.push(contentImage2);
    evtMrg.addControlEventListener(document, StaticLibrary.ORIENTATION_CHANGE, TextImageObj.onOrientationChange);

    container.find("#contentHolder").html(TextImageData.content);

    if (DataManager.TOCData[currentPageLocationIndex].showTitle == "true") {
        $('.page_title').html(DataManager.TOCData[currentPageLocationIndex].title);
    }

    NavigatorController.addEventsForDetailLink();
    if (TextImageObj.initTemplate) {
        setTimeout(function() {
            MainController.initializeTemplateInShell();
        }, MainController.pageInterval);
    };
}

TextImageObj.showPlayPauseDisabled = function() {}

TextImageObj.markPageComplete = function() {
    MainController.markCurrentPageComplete();
    MainController.showNextInstruction();
}

TextImageObj.addAnimation = function(tn) {
    let _self = TextImageObj
    let _content = $("#content_" + tn) || null;
    if (_content.length < 1) {
        _content = $("#sectionHolder #contentHolder .mainCont");
    }
    try {
        _self.getChildrens(_content);
    } catch (err) {

    }

}

TextImageObj.getChildrens = function(ele) {
    let _self = TextImageObj
    try {
        var _childres = ele.children();
        $.each(_childres, function(i, el) {
            let _el = $(el)
            var _tagName = el.tagName;
            if ((_tagName.toLowerCase() != 'img')) {
                _el.removeClass('timeLine fadeIn').addClass('timeLine');
                setTimeout(function() {
                    _el.addClass('fadeIn');
                    _self.getChildrens(_el);
                }, (i * 600));
            }
        })

    } catch (err) {
        console.error(" getChildrens:   ", err)
    }
}

TextImageObj.videoSync = function(data) {
    var video = data['vObj'];
    video['cTime'] = data.cTime;
    //  this.ElementSync(video);
}

TextImageObj.audioSync = function(data) {
    //  this.ElementSync(data);
}

TextImageObj.ElementSync = function(data) {

    /*
    let nodes = data.nodes || data || [],
        lastTime = data.lastTime || -1,
        i = 0,
        time = parseFloat(data.cTime);
    if (nodes.length < 1) return;

    if (Math.abs(time - lastTime) < 0.1) {
        return;
    }

    lastTime = time;

    for (i = 0; i < nodes.length; i += 1) {
        let _node = nodes[i];
        let _sTime = _node['sTime'];
        let _eTime = _node['eTime'];
        let _ele = $(_node['element']);
        let classIn = _node['classIn'] || 'fadeIn';
        let classOut = _node['classOut'] || 'fadeOut';

        if (!_ele.hasClass(classIn)) {
            if ((time >= _sTime) && (_eTime ? time < _eTime : true)) {
                _ele.addClass(classIn);
                _ele.removeClass(classOut);
            }
        } else if (_ele.hasClass(classIn)) {
            if ((time < _sTime) || (_eTime ? time >= _eTime : false)) {
                _ele.removeClass(classIn);
                _ele.addClass(classOut);
            }
        }
    }
    */
}



$.fn.videosync = function() {
    // P01692
    // console.clear();

    /*   return this.each(function() {

           this.classIn = 'fadeIn';
           this.classOut = 'fadeOut';
           this.nodes = [];
           this.lastTime = -1;
           this.time = 0;
           var _that = this;

           $('.timeLine').each(function() {
               var _self = $(this)[0];
               _that.nodes.push({
                   sTime: parseFloat(_self.dataset['stime']),
                   eTime: parseFloat(_self.dataset['etime']),
                   classIn: _self.dataset['inclass'],
                   classOut: _self.dataset['outclass'],
                   element: $(this)
               });
           });

       });

       */

};