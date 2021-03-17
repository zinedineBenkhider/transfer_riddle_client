//Display all steps at once without a time interval
function displayAllAtOnce(steps) {
    createSolutionHeader(false);
    var firstStep = { "tankOneContent": 0, "tankTwoContent": 0 };
    steps.unshift(firstStep);
    for (var i = 0; i < steps.length; i++) {
        createStepContent(steps[i], i + 1);
    }
    var tankDivSelector;
    if (steps[steps.length - 1].tankOneContent == expectedQuantity) {
        tankDivSelector = "#tankA-step-" + (steps.length);
    }
    else {
        tankDivSelector = "#tankB-step-" + (steps.length);
    }
    makeGreenTank(tankDivSelector, steps.length);
}

//show step by step solution with time interval
function displayStepByStep(steps) {
    createSolutionHeader(true);
    //add step 0
    var firstStep = { "tankOneContent": 0, "tankTwoContent": 0 };
    steps.unshift(firstStep);
    var k = 1;
    if (k == steps.length) {
        createStepContent(firstStep, 0);
        makeGreenTank("#tankA-step-0", 0);
        makeGreenTank("#tankB-step-0", 0);
    }
    else {
        createStepContent(firstStep, 1);
    }
    while (k < steps.length) {
        displayNextStepTimeOut(steps, k);
        k++;
    }
}

//show step with an interval
function displayNextStepTimeOut(steps, index) {
    var nextStapeTimeOutId = setTimeout(function () {
        getNextStep(steps[index - 1], steps[index], index);
    }, (index - 1) * stepIntervalTime);
    timeouts.push(nextStapeTimeOutId);
}

//fill tank and empty other tank, or fill tank from tap
function getNextStep(currentTank, nextTank, currentStepNb) {
    var stepNbSpan = $("#solution-content p span");
    stepNbSpan.text(currentStepNb);
    var tankAState = $("#solution-content").children().eq(1).children().eq(0);
    tankAState.text(nextTank.tankOneContent + "/" + tankASize);
    var tankBState = $("#solution-content").children().eq(1).children().eq(1);
    tankBState.text(nextTank.tankTwoContent + "/" + tankBSize);
    var tankADivSelector = "#tankA-step-1";
    var tankBDivSelector = "#tankB-step-1";
    var isTransfer = currentTank.tankOneContent - nextTank.tankOneContent == nextTank.tankTwoContent - currentTank.tankTwoContent;//chack if the step is transfer and not fill or empty
    fillOrEmptyfTank(tankADivSelector, currentTank.tankOneContent, nextTank.tankOneContent, tankASize, isTransfer);//fill or empty tank A
    fillOrEmptyfTank(tankBDivSelector, currentTank.tankTwoContent, nextTank.tankTwoContent, tankBSize, isTransfer);//fill or empty tank B
}

//fill or empty tank
function fillOrEmptyfTank(tankDivSelector, currentStepTankContent, nextStepTankContent, tankSize, isTransfer) {
    if (nextStepTankContent == expectedQuantity) {//this tank contain the expected quantity
        makeGreenTankTimeOut(tankDivSelector);
    }
    var isFillFromTap = !isTransfer && currentStepTankContent == 0;
    var isEmpty = !isTransfer && !isFillFromTap;
    if (currentStepTankContent < nextStepTankContent) {//fill action
        var beg = currentStepTankContent;
        var end = nextStepTankContent - 1;
        var nbLiterToAdd = nextStepTankContent - currentStepTankContent;
        for (var i = 0; i < tankSize; i++) {//all litters added after stepIntervalTime - 1500
            if (i <= end && i >= beg) {
                var addLitterInterval = ((stepIntervalTime - 1500) / nbLiterToAdd) * (i - currentStepTankContent + 1);
                if (addLitterInterval < 0) {
                    addLitterInterval = 0;
                }
                addRemoveLiterTimeOut(tankDivSelector, waterColor, i, addLitterInterval, isFillFromTap, isEmpty);
            }
        }
    }
    else if (currentStepTankContent > nextStepTankContent) {//Empty action
        var beg = nextStepTankContent;
        var end = currentStepTankContent - 1;
        var nbLiterToSustract = currentStepTankContent - nextStepTankContent;
        for (var i = 0; i < tankSize; i++) {//all litters removed after stepIntervalTime - 1500
            if (i <= end && i >= beg) {
                var removeLitterInterval = ((stepIntervalTime - 1500) / nbLiterToSustract) * (currentStepTankContent - i);
                if (removeLitterInterval < 0) {
                    removeLitterInterval = 0;
                }
                addRemoveLiterTimeOut(tankDivSelector, emptyTankColor, i, removeLitterInterval, isFillFromTap, isEmpty)
            }
        }
        var direction;
        if ((tankDivSelector == "#tankA-step-1" && isTransfer) || (tankDivSelector == "#tankB-step-1" && !isTransfer)) {//transfer tank A to tank B or empty tank B
            direction = "right";
        }
        else { //transfer tank B to tank A or empty tank A
            direction = "left";
        }
        transferAnimation(tankDivSelector, direction);
    }
}

//Make green liters of tank that contain expected quantity
//Used in all at once mode
function makeGreenTank(tankDivSelector, nbStep) {
    var tankDiv = $(tankDivSelector);
    for (i = 0; i < expectedQuantity; i++) {
        tankDiv.children().eq(i).css("background-color", solutionColor);
    }
    var tankName = tankDivSelector == "#tankA-step-" + nbStep ? "A" : "B";
    var tankState = $("#tank" + tankName + "-state-" + nbStep);
    if (tankName == "B") {
        tankState.removeClass("text-danger");
    }
    tankState.addClass("text-success");
}

//Make green liters of tank that contain expected quantity
//Used in step by step mode
function makeGreenTankTimeOut(tankDivSelector) {
    var changeColorTimeOutId = setTimeout(function () {
        makeGreenTank(tankDivSelector, 1)
    }, stepIntervalTime);
    timeouts.push(changeColorTimeOutId);
}

//Add or remove litter from tank with an interval time
function addRemoveLiterTimeOut(tankDivSelector, color, index, addRemoveLitterInterval, isFill, isEmpty) {
    var changeColorTimeOutId = setTimeout(function () {
        var tankDiv = $(tankDivSelector);
        tankDiv.children().eq(index).css("background-color", color);//add liter
        //show and hide the drop when it is filling from the tap
        var dropImg = tankDivSelector == "#tankA-step-1" ? $("#drop-fill-left") : $("#drop-fill-right");
        if (isFill && dropImg.is(":hidden")) {
            dropImg.show();
        }
        else {
            dropImg.hide();
        }
        //show and hide the drop when emptying tank
        var dropEmptyImg = tankDivSelector == "#tankA-step-1" ? $("#drop-empty-left") : $("#drop-empty-right");
        if (isEmpty && dropEmptyImg.is(":hidden")) {
            dropEmptyImg.show();
        }
        else {
            dropEmptyImg.hide();
        }
        if (addRemoveLitterInterval + 1500 == stepIntervalTime) {//all liters added 
            dropImg.hide();
            dropEmptyImg.hide();
        }
    }, addRemoveLitterInterval);
    timeouts.push(changeColorTimeOutId);
}

//transfer animation
function transferAnimation(tankDivSelector, direction) {
    var duration = stepIntervalTime - 1500;
    if (duration > 0) {
        var deg = direction == "right" ? 42 : -42;
        var translateX = direction == "right" ? 200 : -200;
        var translateY = -1200;
        if ((tankDivSelector == "#tankA-step-1" && tankBSize > tankASize) || (tankDivSelector == "#tankB-step-1" && tankASize > tankBSize)) {//the current tank is the smallest
            translateY += -400;
        }
        var rotateAction = [
            { transform: "rotate(" + deg + "deg)" },
        ];
        var translateAction = [
            { transform: "translate(" + translateX + "px," + translateY + "px)" },
        ];
        var timing = {
            duration: duration,
            iterations: 1
        };
        document.getElementById(tankDivSelector.substring(1)).animate(
            translateAction,
            timing
        );
        document.getElementById(tankDivSelector.substring(1)).animate(
            rotateAction,
            timing
        );
    }

}
