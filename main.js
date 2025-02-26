//First I want to change window when I click on a tab. I will need to add a listener to each id and change the background color of the button accordingly


let slider = document.getElementById("myslider");
let sliderValue = document.getElementById("sliderValue");
let durationValue = document.getElementById("durationValue");
let runningIndicator = document.getElementById("runningtext")
let activeTimerArray = new Array();
let runningTimerArray = new Array();

let windowTabPairs = [
    [document.getElementById("homepageButton"), document.getElementById("homepage")],
    [document.getElementById("customiseButton"), document.getElementById("customise")],
    [document.getElementById("runningButton"), document.getElementById("running")],
    [document.getElementById("listactiveButton"), document.getElementById("listactive")]]

let sidebarTabPairs = [
    [document.getElementById("exampletimerButton"), document.getElementById("example"), document.getElementsByClassName("exampleFieldValues")],
    [document.getElementById("exampletimerButton2"), document.getElementById("example2")]]

const windowTabNumber = windowTabPairs.length;

let currentClickedWindowPair = 0; //can be used for validation of the current window
let currentClickedSidebarPair = 0;

const updateRunningDuration = (newDuration) => {
    durationValue.innerHTML = newDuration;
}

class Timer {
    constructor(name, duration, runstate) {
        this.name = name;
        this.duration = duration;
        this.runstate = runstate;
    }

    decrementDuration() {
        let p = Number(this.duration);
        if (p > 0) {
            p += -1;
            this.duration = p;
            updateRunningDuration(this.duration);
        }
    }
}


const clickedButton = (arrayPairIndex) => { //new arrow function - the arrayPairIndex parameter is the arrayPairs index corresponding to the button that has been clicked
    var classnameClicked = "clickedButton";
    var classnameButton = "button";
    var arrayPairs = windowTabPairs; //this creates a reference of the array
    var originalArrayPairIndex = arrayPairIndex;
    if (arrayPairIndex >= windowTabNumber) {
        classnameClicked = "clickedSidebarButton";
        classnameButton = "sidebarButton";
        arrayPairIndex = arrayPairIndex - windowTabNumber;
        arrayPairs = sidebarTabPairs;
    }
    var activeWindowElement = document.getElementsByClassName(classnameClicked)[0];
    if (activeWindowElement.id != arrayPairs[arrayPairIndex][0].id) {
        activeWindowElement.className = classnameButton;
        arrayPairs[arrayPairIndex][0].className = classnameClicked;
        arrayPairs[arrayPairIndex][1].style.display = "block";
        if (originalArrayPairIndex >= windowTabNumber) {
            arrayPairs[currentClickedSidebarPair][1].style.display = "none";
            currentClickedSidebarPair = arrayPairIndex;
        }
        else {
            arrayPairs[currentClickedWindowPair][1].style.display = "none"; //I set the corresponding window for the previously clicked button to display = none.
            currentClickedWindowPair = arrayPairIndex;
        }
    }
    else {
        return;
    }
    return;
}

const timerToActiveArray = () => {
    var valueArray = sidebarTabPairs[currentClickedSidebarPair][2];
    let name = "%default%";
    let duration = 0;
    let runstate = "run_now";
    for (let i = 0; i < valueArray.length; i++) { //we parse the array for the values we need into the appropriate object. 
        if (valueArray[i].parentElement.className == "durationSlider") {
            duration = valueArray[i].value;
        }
        else if (valueArray[i].parentElement.className == "nameInput") {
            name = valueArray[i].value;
        }
        else if (valueArray[i].parentElement.className == "radioButton") {
            if (valueArray[i].checked == "checked") {
                runstate = "run_now";
            }
            else {
                runstate = "start_time";
            }
        }
    }
    runstate = "run_now"; //temporary line to make sure arrays don't get filled with unusable objects
    var newTimerObject = new Timer(name, duration, runstate);
    activeTimerArray.push(newTimerObject);
    activeToRunningArray();
}

const activeToRunningArray = () => {
    if (runningTimerArray.length > 0) {
        return;
    }
    else if (activeTimerArray.length == 0) {
        return;
    }
    activeTimerArray.forEach(timer => {
        handleTimerRunstate(timer);
    });
}

const handleTimerRunstate = (timer) => {
    if (runningTimerArray.length > 0) {
        return;
    }
    if (timer.runstate == "run_now") {
        runningTimerArray.push(timer);
        var ind = activeTimerArray.indexOf(timer);
        activeTimerArray.splice(ind, 1);
    }
}

const setRunningIndicator = (bool) => {
    if (bool) {
        runningIndicator.innerText = "Yes";
        runningIndicator.style.color = "green";
    }
    else {
        runningIndicator.innerText = "No";
        runningIndicator.style.color = "red";
    }
}


document.addEventListener("click", (e) => { //pass the event as a parameter to the inline event handler function. 
    if (e.target.id == "homepageButton") {
        clickedButton(0);
    }
    else if (e.target.id == "customiseButton") {
        clickedButton(1);
    }
    else if (e.target.id == "runningButton") {
        clickedButton(2);
    }
    else if (e.target.id == "listactiveButton") {
        clickedButton(3);
    }
    else if (e.target.id == "exampletimerButton" || e.target.parentElement.id == "exampletimerButton") {
        clickedButton(4);
    }
    else if (e.target.id == "exampletimerButton2" || e.target.parentElement.id == "exampletimerButton2") {
        clickedButton(5);
    }
    else if (e.target.className == "applyButton") {
        timerToActiveArray();
    }
});

sliderValue.innerHTML = slider.value;
slider.oninput = () => { //we define an event handler for the oninput event listener of the slider element
    sliderValue.innerHTML = slider.value;
}


setInterval(() => {
    if (runningTimerArray.length > 0) {
        runningTimerArray[0].decrementDuration();
        setRunningIndicator(true);
    }
    else {
        setRunningIndicator(false);
        return;
    }
    if (Number(runningTimerArray[0].duration) == 0) {
        runningTimerArray.pop();
        activeToRunningArray();
    }
    return;
}, 1000);