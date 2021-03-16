//Send request to the web service
function sendRequest(url, tankASize, tankBSize, expectedQuantity, listener) {
    var req = new XMLHttpRequest();
    var endPoint = "https://riddle-zinedine-benkhider.herokuapp.com/";
    endPoint += url + "?tankASize=" + tankASize + "&tankBSize=" + tankBSize + "&t=" + expectedQuantity;
    req.addEventListener("load", listener);
    req.addEventListener('error', reqErrorListener);
    req.open("GET", endPoint);
    req.send();
}

//Check the existence of solution, and get it from web service if it exist
function reqSolExistListener() {
    var solutionExist = JSON.parse(this.response);
    if (solutionExist == true) {
        sendRequest("solution", tankASize, tankBSize, expectedQuantity, reqSolutionStepsListener);
    }
    else {
        executionTimeEnd = performance.now();
        displayAlertMsg("There is no solution for this configuration. Server response: " + (executionTimeEnd - executionTimeBeg) + " microseconds", "alert-danger");
        $("#clearBtn").show();
        $(".spinner").hide();
    }
}

//Solution listner
function reqSolutionStepsListener() {
    var solutionSteps = JSON.parse(this.response);
    executionTimeEnd = performance.now();
    displayAlertMsg("The optimal solution in " + solutionSteps.length + " step(s). Server response: " + (executionTimeEnd - executionTimeBeg) + " microseconds", "alert-success");
    var displayMode = $("form input[type='radio']:checked").val();
    if (displayMode == "allSteps") {
        displayAllAtOnce(solutionSteps);
    }
    else {
        displayStepByStep(solutionSteps);
    }
    $("#clearBtn").show();
    $(".spinner").hide();
}


//display error message when the server handel error
function reqErrorListener() {
    $(".spinner").hide();
    displayAlertMsg("Server Error, please check that the server is running", "alert-danger");
}
