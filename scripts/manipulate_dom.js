
//Create message to inform if the solution exists
function displayAlertMsg(msg, type) {
    var resDiv = $("#solution");
    resDiv.text('');
    var newDiv = $("<div></div>");
    newDiv.attr("role", "alerte");
    newDiv.addClass("alert " + type);
    newDiv.text(msg);
    resDiv.append(newDiv);
}

//clear solution and all timeouts
function clearResult() {
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    var resDiv = $("#solution");
    resDiv.text('');
    $("#clearBtn").hide();
}

//Create header of solution for the modes : Step By Step, All At Once
function createSolutionHeader(isStepByStepMode) {
    var resDiv = $("#solution");
    var resultContentDiv = $("<div id='solution-content'></div>");
    var tanksHeader = $("<div id='result-header' class='mb-3 row d-flex justify-content-center'></div>");
    tanksHeader.css("height", "45px");
    var tankATitle = $("<div><i class='fas fa-water water-icon pr-1' ></i> Water Tank A</div>");
    tankATitle.addClass("col-4 d-flex justify-content-center font-weight-bold text-primary");
    var tankBTitle = $("<div><i class='fas fa-water water-icon pr-1'></i>Water Tank B</div>");
    tankBTitle.addClass("col-4 d-flex justify-content-center font-weight-bold text-danger");
    tanksHeader.append(tankATitle);
    tanksHeader.append(tankBTitle);
    if (isStepByStepMode) {//add taps and drops to solution header
        $("<div id='tap-left' class='col-2 d-flex flex-column'></div>");
        var tapLeftDiv = $("<div id='tap-left' class='col-2  d-flex align-items-end flex-column'></div>");
        var tapImgLeft = $("<img src='images/tap-left.png' width='30' height='30'></img>");
        var dropLeft = $("<img id='drop-fill-left' class='pl-1' src='images/drop.png' width='15' height='15'></img>");
        dropLeft.hide();
        tapLeftDiv.append(tapImgLeft, dropLeft);
        tanksHeader.append(tapLeftDiv, tankATitle, tankBTitle);
        var tapRighttDiv = $("<div id='tap-right' class='col-2 d-flex flex-column'></div>");
        var tapImgRight = $("<img src='images/tap-right.png' width='30' height='30'></img>");
        var dropRight = $("<img id='drop-fill-right' class='pr-1' src='images/drop.png' width='15' height='15'></img>");
        dropRight.hide();
        tapRighttDiv.append(tapImgRight, dropRight);
        tanksHeader.append(tapRighttDiv);
    }
    resDiv.append(tanksHeader, resultContentDiv);
}

//Create html element that contain tanks and theire states
function createStepContent(step, stepnb) {
    var literHeight = 200 / Math.max(tankASize, tankBSize);
    var tankAHeight = tankASize * literHeight + "px";
    var tankBHeight = tankBSize * literHeight + "px";
    var resDiv = $("#solution-content");
    var stepNumber = $("<p class='font-weight-bold row d-flex justify-content-center'>Step n° <span>" + stepnb + "</span></p>");
    resDiv.append(stepNumber);
    var tanksState = $("<div id='tanks-state-" + stepnb + "' class='row d-flex align-items-end justify-content-center'></div>");
    var tankAState = $("<div id='tankA-state-" + stepnb + "'>" + step.tankOneContent + "/" + tankASize + "</div>");
    tankAState.addClass("col-4 mb-3 mr-3 d-flex justify-content-center font-weight-bold text-primary");
    var tankBState = $("<div id='tankB-state-" + stepnb + "'>" + step.tankTwoContent + "/" + tankBSize + "</div>");
    tankBState.addClass("col-4 mb-3 d-flex justify-content-center font-weight-bold text-danger");
    tanksState.append(tankAState, tankBState);
    resDiv.append(tanksState);
    var tanksDiv = $("<div id='step-" + stepnb + "'></div>");
    tanksDiv.addClass("row d-flex align-items-end justify-content-center mb-5");

    //drop left that will be displayed when emptying Tank A
    var dropLeftDiv = $("<div class='col-1 d-flex justify-content-center'></div>");
    var dropLeftImg = $("<img id='drop-empty-left'  src='images/drop.png' width='15' height='15'></img>");
    dropLeftImg.hide();
    dropLeftDiv.append(dropLeftImg);
    tanksDiv.append(dropLeftDiv);

    //create tank A div
    var tankADiv = $("<div id='tankA-step-" + stepnb + "'></div>");
    tankADiv.addClass("col-4 d-flex flex-column-reverse border border-3 rounded-bottom border-top-0 border-primary mr-3 ml-3 p-0");
    tankADiv.css({ "backgroundColor": emptyTankColor, "height": tankAHeight });
    //create children of tank A div that represent tank liters
    for (var i = 0; i < tankASize; i++) {
        var tankADivChild = $("<div></div>");
        tankADivChild.css({ "height": literHeight + "px", "width": "100%" });
        if (i < step.tankOneContent) {
            tankADivChild.css("background-color", waterColor);
        }
        tankADiv.append(tankADivChild);
    }
    tanksDiv.append(tankADiv);
    //create tank B div
    var tankBDiv = $("<div id='tankB-step-" + stepnb + "'></div>");
    tankBDiv.addClass("col-4 d-flex flex-column-reverse border-3 border rounded-bottom border-top-0 border-danger  ml-3 p-0");
    tankBDiv.css({ "backgroundColor": emptyTankColor, "height": tankBHeight });
    //create children of tank B div that represent tank liters 
    for (var i = 0; i < tankBSize; i++) {
        var tankBDivChild = $("<div></div>");
        tankBDivChild.css({ "height": literHeight + "px", "width": "100%" });
        if (i < step.tankTwoContent) {
            tankBDivChild.css("background-color", waterColor);
        }
        tankBDiv.append(tankBDivChild);
    }

    tanksDiv.append(tankBDiv);
    //drop left that will be displayed when emptying Tank B
    var dropRightDiv = $("<div class='col-1 d-flex justify-content-center'></div>");
    var dropRightImg = $("<img id='drop-empty-right'  src='images/drop.png' width='15' height='15'></img>");
    dropRightImg.hide();
    dropRightDiv.append(dropRightImg);
    tanksDiv.append(dropRightDiv);
    resDiv.append(tanksDiv);
}

