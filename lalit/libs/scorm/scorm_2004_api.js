//SCORM 2004 working
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
var timeOutLoop = 30; //loops
var prevLessonLocation = "";
var startDate;
var blnLMSIntialized = false;
var timerRunning = false;
var nextInt = 0;
var debugerMode = false;

function onTimeOut() {
    timeCtr++;
    if (timeCtr > timeOutLoop) {
        //Send dummy data to LMS to keep session active
        timeCtr = 0;
        set_val("cmi.location", prevLessonLocation);
        commit();
    }
    setTimeout("onTimeOut()", 10000);
}

setTimeout("onTimeOut()", 10000);

function fnDebug(msg) {
    //document.getElementById("shell").toas(msg);
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
    while ((win.API_1484_11 == null) && (win.parent != null) && (win.parent != win)) {
        findAPITries++;
        // Note: 7 is an arbitrary number, but should be more than sufficient
        if (findAPITries > 7) {
            parent.status = "Error finding API -- too deeply nested.";
            return null;
        }

        win = win.parent;
    }
    return win.API_1484_11;
}

//function to get the fpi
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


//function to initialise the sco
function initSco() {
    var success = false
    API = GetAPI();

    if (API != null) {
        window.status = "API Found";
        var ret;
        var code;
        var diag;
        success = API.Initialize("");

        //start calculating the session time
        startclock();

        return true;
    } else {
        window.status = "Unable to find an API Adapter...";
        return false;
    }

}


function getCode() {
    code = API.GetLastError();
    return code;
}

function getInfo(code) {
    ret = API.GetErrorString(code);
    return ret;
}

function getDiagnosticInfo() {
    diag = API.GetDiagnostic("");
    return diag;
}

function convertNumToString(iNum) {
    if (iNum < 10) {
        return ("0" + iNum);
    } else {
        return ("" + iNum);
    }
}

function getTimeStamp() {
    var now = new Date();

    var yy = now.getUTCFullYear();
    var mm = now.getUTCMonth() + 1;
    var dd = now.getUTCDate();
    var hh = now.getUTCHours();
    var mn = now.getUTCMinutes();
    var ss = now.getUTCSeconds();

    return yy + "-" + convertNumToString(mm) + "-" + convertNumToString(dd) + "T" + convertNumToString(hh) + ":" + convertNumToString(mn) + ":" + convertNumToString(ss) + ".0Z";
}

//function to set the values of the variables in the LMS
function set_interaction_data(strInteractionId, strInteractionType, strCurrTime, strLatency, strWeightage, strPattern, strStudentResponse, strInteractionResult, iCurrQuestionNum, iTotalQuestions) {

    fnDebug("ATTEMPT - set_interaction_data");
	
    var tempStr;
	
    API = GetAPI();

    if (API != null) {
        try {
            if (strInteractionId) {
                var _count = parseInt(API.GetValue('cmi.interactions._count'), 10);
                if (isNaN(_count) || (_count == 0)) {
                    var _courseId = strInteractionId.split('_KC')[0];
                    var _maxQues = 6;
                    for (var _iID = 0; _iID < _maxQues; _iID++) {
                        var _iCMI = 'cmi.interactions.' + _iID;
                        var _qID = _courseId + "_KC" + (_iID + 1);
                        API.SetValue(_iCMI + '.id', _qID)
                    }
                }
            }
        } catch (err) {
            console.error(err)
        }


        var _iCMI = 'cmi.interactions.' + (parseInt(iCurrQuestionNum - 1));

        if (strInteractionId) {
           // API.SetValue(_iCMI + '.id', strInteractionId)
		   
            if (strCurrTime) {
                API.SetValue(_iCMI + '.timestamp', getTimeStamp());
            }

            if (strInteractionType){
                API.SetValue(_iCMI + '.type', strInteractionType)
			}

            if (strWeightage){
                API.SetValue(_iCMI + '.weighting', strWeightage)
			}

            if (strStudentResponse){
                API.SetValue(_iCMI + '.learner_response', strStudentResponse)
			}

            if (strInteractionResult) {
                if (strInteractionResult == "wrong") {
                    strInteractionResult = "incorrect";
                }
                API.SetValue(_iCMI + '.result', strInteractionResult)
            }

            if (strLatency){
                tempStr = strLatency.split(":");
                API.SetValue(root + '.latency', "PT" + tempStr[0] + "H" + tempStr[1] + "M" + tempStr[2] + "S")
            }

            if (strPattern){
                API.SetValue(root + '.correct_responses.0.pattern', strPattern)
			}

            commit();
        }

    }
};


//function to set the values of the variables in the LMS
function set_val(gname, gvalue) {
    var success;
    //alert("set_val "+gname+" , "+gvalue)
    API = GetAPI();
    if (API != null) {
        var ret;
        var code;
        var diag;
        if (gname == "cmi.location") {
            prevLessonLocation = gvalue;
            success = API.SetValue(gname, gvalue);
        } else if (gname == "cmi.score.raw") {
            success = API.SetValue(gname, gvalue);
        } else {
            success = API.SetValue(gname, gvalue);
        }
        timeCtr = 0;
        fnDebug("set_val " + gname + " , " + gvalue)

    }
    return success;
};

//function to get the values of the variables from the LMS
function get_val(gname) {
    //alert('get_val '+gname);
    API = GetAPI();
    if (API != null) {
        var ret1, ret2;
        var code;
        var diag;

        ret1 = API.GetValue(gname);
        if (gname == "cmi.location") {
            prevLessonLocation = ret1;
        }
        return ret1;
    }

};

//function to update the values of the variables in the LMS
function commit() {
    var success = false;
    API = GetAPI();
    if (API != null) {
        var ret = "";
        var code;
        var diag;
        success = API.Commit("");
    }
    if (String(success) == "false" || (window.opener && window.opener.closed)) {
        alert("The course communication window that tracks your progress has been closed. Further course progress will be lost. Please close the course window and relaunch to continue and track your progress.");
    }
    return success;
};

//function to finish the LMS communication
function finish() {
    var success = false;
    API = GetAPI();

    if (API != null) {
        //stop calculating the time 
        sTime = String(stopclock());
        //set the time taken in the current session to the LMS		
        set_val("cmi.session_time", sTime);
        set_val("cmi.exit", "suspend");
        success = API.Terminate("");

    }
    if (window.opener && (typeof(window.opener.closeMainWindow) === "function")) {
        window.opener.closeMainWindow();
    };
    return success;
};

//this function is to retrieve the bookmark stored in the LMS
function fnGetBookMark() {
    return course_status
}



//function to set the bookmark, set the course status and score
function set_score(score) {
    //alert('set_score score : '+score);
    set_val("cmi.score.raw", score);
}

//this function is to stop calculating the session time
function stopclock() {
    if (timerRunning) {
        clearTimeout(timerID)
        timerRunning = false
        return timeValue
    }

}
//-----------------------------------------------------------------------
//this function is to start calculating the session time
function startclock() {
    startDate = new Date()
    startSecs = (startDate.getHours() * 60 * 60) + (startDate.getMinutes() * 60) + startDate.getSeconds()
    showtime()


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

    timeValue = "PT" + hours
    if (hours < 10) {
        timeValue = "PT0" + hours
    }
    timeValue += "H"
    timeValue += ((minutes < 10) ? "0" : "") + minutes
    timeValue += "M"
    timeValue += ((seconds < 10) ? "0" : "") + seconds
    timeValue += "S"

    timerID = setTimeout("showtime()", 1000)
    timerRunning = true
}

function fnGetStudentName() {
    var studentName_lms = get_val("cmi.learner_name");
    return studentName_lms;
}


function fnGetStudentId() {
    var studentId_lms = get_val("cmi.learner_id");
    return studentId_lms;
}