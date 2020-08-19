var findAPITries = 1;
var API = null;
var course_status = ""
var debugWindow;
var winWidth = 300;
var winHeight = 200;
var yPos = 200;
var xPos = 10;
var initialized = false;
var pageCount;
var timeCtr = 0;
var timeOutLoop = 30; //loop
var prevLessonLocation = "";
var startDate;
var blnLMSIntialized = false;
var timerRunning = false;
var nextInt = 0;
var debugerMode = false;

function onTimeOut() {
    timeCtr++;
    if (timeCtr > timeOutLoop) {
        timeCtr = 0;
        set_val("cmi.core.lesson_location", prevLessonLocation);
        commit();
    }
    setTimeout("onTimeOut()", 10000);
}

setTimeout("onTimeOut()", 10000);

function fnDebug(msg) {
    if (debugerMode == true) {
        if (debugWindow != null) {
            debugWindow.document.write("<BR>" + msg)
            debugWindow.focus();
        } else {
            var option = "width=" + winWidth + ",height=" + winHeight + ",fullscreen=no,toolbar=no,titlebar=0,status=0,location=0,scrollbars=yes, top=" + yPos + ",left=" + xPos + "";
            debugWindow = window.open("popup.html", "Debuger", option);
            debugWindow.document.write(msg);
            debugWindow.focus();
        }
    } else {
        if (debugWindow != null) {
            debugWindow.close();
            debugWindow = null;
        }

    }
}


function getLocation() {
    var tempStr = window.top.location.href
    return tempStr;
}


// function to check Flash ExternalInterface to confirm presence of JS wrapper before attempting any LMS communication.

function isAvailable() {
    return true;
}


//function to check the fpi
function FindAPI(win) {
    findAPITries = 1;
    while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        if (findAPITries > 7) {
            parent.status = "Error finding API -- too deeply nested.";
            return null;
        }
        win = win.parent;

    }
    return win.API;
}

function GetAPI() {
    API = null;
    if (API == null) {
        API = FindAPI(window);
        try {
            if ((API == null) && (window.opener != null) && (typeof(window.opener) != "undefined")) {
                API = FindAPI(window.opener);
            }
            if ((API == null) && (window.opener.top.opener != null) && (typeof(window.opener.top.opener) != "undefined")) {
                API = FindAPI(window.opener.top.opener);
            }
        } catch (e) {
            API = null;
        }
        if (API == null) {
            parent.status = "Unable to find an API adapter";
        }
    }
    return API;
}

function initSco() {
    if (!blnLMSIntialized) {
        var success = false
        API = GetAPI();
        if (API != null) {
            window.status = "API Found";
            var ret;
            var code;
            var diag;
            success = API.LMSInitialize("");
            startclock();
            fnDebug("ATTEMPTING -  SCORM initialize");
            blnLMSIntialized = true;
            return true;
        } else {
            window.status = "Unable to find an API Adapter...";
            fnDebug("Unable to find an API Adapter...");
            return false;
        }
    } else {
        return true;
    }

}


function getCode() {
    code = API.LMSGetLastError();
    return code;
}

function getInfo(code) {
    ret = API.LMSGetErrorString(code);
    return ret;
}

function getDiagnosticInfo() {
    diag = API.LMSGetDiagnostic("");
    return diag;
}

//function to set the values of the variables in the LMS
function set_interaction_data(strInteractionId, strInteractionType, strCurrTime, strLatency, strWeightage, strPattern, strStudentResponse, strInteractionResult, iCurrQuestionNum, iTotalQuestions) {

    fnDebug("ATTEMPT - set_interaction_data");

    API = GetAPI();

    if (API != null) {

        try {
            if (strInteractionId) {
                var _count = parseInt(API.LMSGetValue('cmi.interactions._count'), 10);
                if (isNaN(_count) || (_count == 0)) {
                    var _courseId = strInteractionId.split('_KC')[0];
                    var _maxQues = 6;
                    for (var _iID = 0; _iID < _maxQues; _iID++) {
                        var _iCMI = 'cmi.interactions.' + _iID;
                        var _qID = _courseId + "_KC" + (_iID + 1);
                        API.LMSSetValue(_iCMI + '.id', _qID)
                    }
                }
            }
        } catch (err) {
            console.error(err)
        }

        var _iCMI = 'cmi.interactions.' + (parseInt(iCurrQuestionNum - 1));

        if (strInteractionId) {

            // API.LMSSetValue(_iCMI + '.id', strInteractionId)

            if (strCurrTime){
                API.LMSSetValue(_iCMI + '.time', strCurrTime)
			}

            if (strInteractionType){
                API.LMSSetValue(_iCMI + '.type', strInteractionType)
			}

            if (strWeightage){
                API.LMSSetValue(_iCMI + '.weighting', strWeightage)
			}

            if (strStudentResponse){
                API.LMSSetValue(_iCMI + '.student_response', strStudentResponse)
			}

            if (strInteractionResult){
                API.LMSSetValue(_iCMI + '.result', strInteractionResult)
			}

            if (strLatency){
                API.LMSSetValue(_iCMI + '.latency', strLatency)
			}

            if (strPattern){
                API.LMSSetValue(_iCMI + '.correct_responses.0.pattern', strPattern)
			}

            commit();

        }

    }

};


//function to set the values of the variables in the LMS
function set_val(gname, gvalue) {
    var success;
    fnDebug("ATTEMPT - setting: " + gname + ", value: " + gvalue);
    API = GetAPI();

    if (API != null) {
        var ret;
        var code;
        var diag;
        success = API.LMSSetValue(gname, gvalue);
        if (gname == "cmi.core.lesson_location") {
            prevLessonLocation = gvalue;
        }
        if (gname == "cmi.core.score.raw") {}
        timeCtr = 0;

    }
    return success;
};

//function to get the values of the variables from the LMS
function get_val(gname) {
    fnDebug("ATTEMPT - getting: " + gname);
    API = GetAPI();
    if (API != null) {
        var ret1, ret2;
        var code;
        var diag;

        ret1 = API.LMSGetValue(gname);
        if (gname == "cmi.core.lesson_location") {
            prevLessonLocation = ret1;
        }
        fnDebug("STATUS - getting: " + gname + ", result: " + ret1);
        return ret1;
    }

};

//function to update the values of the variables in the LMS
function commit() {
    fnDebug("ATTEMPT - commit");
    var success = false;
    API = GetAPI();
    if (API != null) {
        var ret = "";
        var code;
        var diag;
        success = API.LMSCommit("");
    }
    if (window.opener && window.opener.closed) {
        //if(String(success)=="false" || (window.opener && window.opener.closed)){
        alert("The course communication window that tracks your progress has been closed. Further course progress will be lost. Please close the course window and relaunch to continue and track your progress.");
    }
    fnDebug("STATUS - commit, result:" + success);
    return success;
};

//function to finish the LMS communication
function finish() {
    var success = false;
    API = GetAPI();

    if (API != null) {
        sTime = String(stopclock());
        set_val("cmi.core.session_time", sTime);
        success = API.LMSFinish("");
    }
    if (window.opener && (typeof(window.opener.closeMainWindow) === "function")) {
        window.opener.closeMainWindow();
    };
    return success;
};

//this function is to retrieve the bookmark stored in the LMS
function fnGetBookMark() {
    fnDebug("course_status" + course_status);
    return course_status
}



//function to set the bookmark, set the course status and score
function set_score(score) {
    fnDebug("set_score" + score);
    set_val("cmi.core.score.raw", score);


}

//this function is to stop calculating the session time
function stopclock() {
    if (timerRunning) {
        clearTimeout(timerID)
        timerRunning = false
        fnDebug("Total Time" + timeValue);
        return timeValue
    }

}
//-----------------------------------------------------------------------
//this function is to start calculating the session time
function startclock() {
    startDate = new Date()
    startSecs = (startDate.getHours() * 60 * 60) + (startDate.getMinutes() * 60) + startDate.getSeconds()
    showtime();
}
//-----------------------------------------------------------------------
//this function is used to calculate the time
function showtime() {


    var now = new Date()
    var nowSecs = (now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds()
    var elapsedSecs = nowSecs - startSecs;

    var hours = Math.floor(elapsedSecs / 3600)
    elapsedSecs = elapsedSecs - (hours * 3600)

    var minutes = Math.floor(elapsedSecs / 60)
    elapsedSecs = elapsedSecs - (minutes * 60)

    var seconds = elapsedSecs

    timeValue = "" + hours
    if (hours < 10) {
        timeValue = "0" + hours
    }
    timeValue += ((minutes < 10) ? ":0" : ":") + minutes
    timeValue += ((seconds < 10) ? ":0" : ":") + seconds

    // Update display

    timerID = setTimeout("showtime()", 1000)
    timerRunning = true
}

function fnGetStudentName() {
    var studentName_lms = get_val("cmi.core.student_name");
    fnDebug("Get Student Name" + studentName_lms);
    return studentName_lms;
}


function fnGetStudentId() {
    var studentName_lms = get_val("cmi.core.student_id");
    fnDebug("Get Student id" + studentName_lms);
    return studentName_lms;
}