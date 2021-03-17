var tankASize;
var tankBSize;
var expectedQuantity;
var stepIntervalTime;

var executionTimeBeg;
var executionTimeEnd;
var timeouts = [];

var emptyTankColor = "#E8E6E6";
var waterColor = "#99E2FF";
var solutionColor = "#28a745";

window.onload = (event) => {
    $("#clearBtn").hide();
    $(".spinner").hide();
    //show or hide the field intervalTime according to the chosen mode
    $("form input[type='radio'][name='gridRadios'").change(function () {
        var displayMode = $("form input[type='radio']:checked").val();
        if (displayMode == "allSteps") {
            $(".intervalTimeField").hide();
        }
        else {
            $(".intervalTimeField").show();
            $("#intervalTime").val(3);
        }
    });
    $("form").on('submit', function (event) {
        event.preventDefault();//disable submit event

        solution();
    });
};

//Called when the button Solution is clicked
function solution() {
    $(".spinner").show();
    clearResult();
    executionTimeBeg = performance.now();
    tankASize = $("#tankASize").val();
    tankBSize = $("#tankBSize").val();
    expectedQuantity = $("#expectedQuantity").val();
    stepIntervalTime = $("#intervalTime").val() * 1000;
    if (stepIntervalTime == 0) {
        $("#intervalTime").val(3);
        stepIntervalTime = 3000;
    }
    sendRequest("solution/exist", tankASize, tankBSize, expectedQuantity, reqSolExistListener);
}

//Called when the bouton clear clicked
//clear solution, all timeouts, and form fields values
function clearAll() {
    $("#tankASize").val('');
    $("#tankBSize").val('');
    $("#expectedQuantity").val('');
    $("#intervalTime").val(3);
    clearResult();
}


//Called when the button Random is clicked
function randomConfig() {
    $("#spinner").show();
    var max = 300;
    $("#tankASize").val(getRandomInt(max));
    $("#tankBSize").val(getRandomInt(max));
    max = Math.max($("#tankASize").val(), $("#tankBSize").val());
    $("#expectedQuantity").val(getRandomInt(max));
    solution();
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}





