let slider = document.getElementById("myslider");
let sliderValue = document.getElementById("sliderValue");
let durationValue = document.getElementById("durationValue");
let toggleTimerInfo = document.getElementById("timerInfo");
let runningName = document.getElementById("timername");
let runningPreset = document.getElementById("timerpreset");
let runningIndicator = document.getElementById("runningtext");
let pageTitle = document.getElementById("alertInTitleBlock");
let timerList = document.getElementById("activeListOfTimers");
let activeTimerArray = new Array();
let runningTimerArray = new Array();
let alertsBuffer = new Array();
let listActiveElementsArray = new Array();
let timerRunningSwitch = false;

//6 digit numbers for timer ids
const listingIdUpper = 999999;
const listingIdLower = 100000;

let windowTabPairs = [
    [document.getElementById("homepageButton"), document.getElementById("homepage")],
    [document.getElementById("customiseButton"), document.getElementById("customise")],
    [document.getElementById("runningButton"), document.getElementById("running")],
    [document.getElementById("listactiveButton"), document.getElementById("listactive")]];

let sidebarTabPairs = [
    [document.getElementById("countdownTimerButton"), document.getElementById("countdownTimer"), document.getElementsByClassName("countdownFieldValues"), document.getElementsByClassName("countdownToggleDisable")],
    [document.getElementById("exampletimerButton2"), document.getElementById("example2"), document.getElementById("placeholder1"), document.getElementById("placeholder2")]];

const windowTabNumber = windowTabPairs.length;

let currentClickedWindowPair = 0; //can be used for validation of the current window
let currentClickedSidebarPair = 0;

Date.prototype.getWeekDay = function() { //extend the Date object to include a new method called getWeekDay 
    var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[this.getDay()];
}

Date.prototype.getCurrentTime = function() { //extend the Date object to include a new method called getCurrentTime
    return [this.getHours(), this.getMinutes(), this.getSeconds()];
}

const convertTimeArrayToString = (array) => {
    let hr = array[0].toString();
    let min = array[1].toString();
    let sec = array[2].toString();
    hr = 10 > hr ? "0" + hr : hr;
    min = 10 > min ? "0" + min : min;
    sec = 10 > sec ? "0" + sec : sec;
    timeMsg = `${hr}:${min}:${sec}`;
    return timeMsg;
}

const updateRunningDuration = (newDuration) => {
    durationValue.innerHTML = newDuration;
}

const getTimerListingInnerHtml = (timer) => {
    let timeMsg = "";
    let dayMsg = "";
    let runMsg = "";
    if (timer.runstate != "run_now") {
        timeMsg = convertTimeArrayToString(timer.startTime);
        dayMsg = timer.daysArray.toString();
        runMsg = "Waiting";
    } 
    else if (timer.persistence) {
        timeMsg = convertTimeArrayToString(timer.startTime);
        dayMsg = timer.daysArray.toString();
        runMsg = "Running";
    }
    else {
        timeMsg = "In Queue";
        dayMsg = "In Queue";
        runMsg = "Running";
    }
    let closebuttonString = `<span class="closeButton">×</span>`;
    let nameString = `<p>Name: <span class="nameTextColour">${timer.name}</span></p>`;
    let presetString = `<p>Preset: <span class="presetTextColour">${timer.preset}</span></p>`;
    let runstateString = `<p>Runstate: <span class="${runMsg}">${runMsg}</span></p>`;
    let persistenceString = `<p>Persistent: <span class="persistenceTextColour${timer.persistence.toString()}">${timer.persistence.toString()}</span></p>`;
    let starttimeString = `<p>Start Time: <span class="startTimeTextColour">${timeMsg}</span></p>`;
    let daysString = `<p>Days: <span class="weekDaysTextColour">${dayMsg}</span></p>`;
    return `${closebuttonString}${nameString}${presetString}${runstateString}${persistenceString}${starttimeString}${daysString}`;
}

//This is for creating a listing/box in the listactive window. Elements should be added to an array and managed in order.
const createTimerListing = (timer) => {
    const timerListing = document.createElement("div");
    timerListing.classList.add("timerBox");
    timerListing.id = `${timer.preset}${timer.listingId}`;
    timerListing.innerHTML = getTimerListingInnerHtml(timer);
    listActiveElementsArray.push(timerListing);
    
    //appendChild to a div in the listActive window
    timerList.appendChild(timerListing);
    timerListing.querySelector(".closeButton").addEventListener("click", () => {
        removeTimer(timer);
    });
}

const deleteTimerListing = (timer) => {
    //Loop through the listActiveElementsArray until the timer.listingId is equal to the id of the listing element. Then remove that element and the timer from the active array.
    let IDstring = `${timer.preset}${timer.listingId}`;
    for (var i=0; i < listActiveElementsArray.length; i++) {
        if (listActiveElementsArray[i].id == IDstring) {
            listActiveElementsArray[i].remove();
            listActiveElementsArray.splice(i, 1);
            return;
        }
    }
}

const updateTimerListing = (timer) => {
    let IDstring = `${timer.preset}${timer.listingId}`;
    for (var i=0; i < listActiveElementsArray.length; i++) {
        if (listActiveElementsArray[i].id == IDstring) {
            listActiveElementsArray[i].innerHTML = getTimerListingInnerHtml(timer);
            listActiveElementsArray[i].querySelector(".closeButton").addEventListener("click", () => { //need to add another event listener when the innerhtml is updated
                removeTimer(timer);
            });
        }
    }
}

const customAlert = (message, colour) => {
    const alert = document.createElement("span");
    alert.classList.add("alertPosition");
    alert.innerHTML = `<p style="color: ${colour}; display: inline;">${message}</p><button>OK</button>`;
    if (alertsBuffer.length !== 0) {
        alertsBuffer.push(alert);
        return;
    }
    else {
        alertsBuffer.push(alert);
        bufferAlertsRecursion(alert);
    }
}

const bufferAlertsRecursion = (alert) => { //this function and the alertBuffer array makes sure that multiple alerts are not displayed at the same time
    pageTitle.appendChild(alert);
    alert.querySelector("button").addEventListener("click", () => {
        alert.remove();
        alertsBuffer.splice(0, 1);
        if (alertsBuffer.length === 0) {
            return;
        }
        else {
            bufferAlertsRecursion(alertsBuffer[0]);
        }
    });
}


class Timer { 
    constructor(name, duration, runstate, endNotify, daysArray, startTime, startNotify, persist) {
        this.name = name;
        this.originalDuration = duration;
        this.duration = duration;
        this.runstate = runstate;
        this.endNotification = endNotify;
        this.startNotification = startNotify; 
        this.preset = "Countdown";
        this.listingId = Math.floor(Math.random() * (listingIdUpper - listingIdLower + 1) + listingIdLower).toString();
        this.persistence = persist; //whenever the timer moves from active to running array, it will not be removed from the active array if this value is true(in handleTimerRunstate)
        if (this.runstate == "start_time") {
            this.daysArray = daysArray;
            this.startTime = startTime;
        }
    }

    decrementDuration() {
        let p = Number(this.duration);
        if (p > 0) {
            p += -1;
        }
        this.duration = p;
        updateRunningDuration(this.duration);
    }
    
    displayEndNotification() {
        let message = `A ${this.preset} timer has ended with the name ${this.name.toString()} after ${this.originalDuration} seconds`;
        customAlert(message, "red");
        //alert(message); //this can break everything easily if you include attributes wrong, it also pauses all scripts.
    }
    
    displayStartNotification() {
        let newDate = new Date();
        let currTime = newDate.getCurrentTime();
        let timeString = convertTimeArrayToString(currTime);
        let message = `A ${this.preset} timer has started with the name ${this.name.toString()} at ${timeString}`;
        customAlert(message, "#bdd524");
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

const timerToActiveArray = () => { //this function will only run when the apply button is pressed 
    var valueArray = sidebarTabPairs[currentClickedSidebarPair][2];
    let name = "%default%";
    let duration = 0;
    let runstate = "run_now";
    let endNotification = false;
    let startNotification = false;
    let timerPersistence = false;
    let daysArray = new Array();
    var startTime = false;
    var disabledArray = sidebarTabPairs[currentClickedSidebarPair][3];
    let timeDisabled = disabledArray[0].disabled;
    for (let i = 0; i < valueArray.length; i++) { //we parse the array for the values we need into the appropriate object. 
        if (valueArray[i].parentElement.className == "durationSlider") {
            duration = valueArray[i].value;
        }
        else if (valueArray[i].parentElement.className == "nameInput") {
            name = valueArray[i].value;
            if (name.trim().length === 0) {
                name = "None";
            }
        }
        else if (valueArray[i].parentElement.className == "runstateButton") {
            if (valueArray[i].checked) {
                runstate = "run_now";
            }
            else {
                runstate = "start_time";
            }
        }
        else if (valueArray[i].parentElement.className == "endNotificationCheckmark") {
            endNotification = valueArray[i].checked;
        }
        else if (valueArray[i].parentElement.parentElement.className == "weekDayOptions") { 
            if (valueArray[i].name == "monday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Monday");}
            else if (valueArray[i].name == "tuesday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Tuesday");}
            else if (valueArray[i].name == "wednesday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Wednesday");}
            else if (valueArray[i].name == "thursday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Thursday");}
            else if (valueArray[i].name == "friday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Friday");}
            else if (valueArray[i].name == "saturday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Saturday");}
            else if (valueArray[i].name == "sunday" && valueArray[i].checked && !timeDisabled) {daysArray.push("Sunday");}
        }
        else if (valueArray[i].parentElement.className == "startTimeInput" && !timeDisabled) {
            let stringTime = valueArray[i].value;
            if (stringTime.trim().length === 0) { //if no start time is entered, it should default to run_now runstate. Hours, Minutes and seconds need to be entered for the starttime value. 
                timeDisabled = true;
            }
            else { //create an array by specifying : as the delimiter for the string
                //convert the substrings to numbers before putting it into an array since getCurrentTime also returns an array of integers. 
                startTime = stringTime.split(':').map((element) => +element);
            } 
        }
        else if (valueArray[i].parentElement.className == "startNotificationCheckmark" && !timeDisabled) {
            startNotification = valueArray[i].checked;
        }
        else if (valueArray[i].parentElement.className == "persistentCheckmark" && !timeDisabled) {
            timerPersistence = valueArray[i].checked;
        }
    }
    if (timeDisabled) {
        runstate = "run_now";
        startNotification = isTimerRunning();
    }
    else if (daysArray.length === 0) { //by default if no days are selected then it will add the current day to the array 
        let dateOBJ = new Date();
        let today = dateOBJ.getWeekDay();
        daysArray.push(today);
    }
    var newTimerObject = new Timer(name, duration, runstate, endNotification, daysArray, startTime, startNotification, timerPersistence);
    activeTimerArray.push(newTimerObject);
    createTimerListing(newTimerObject);
    activeToRunningArray();
}

const activeToRunningArray = () => {
    if (isTimerRunning()) {
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
    if (isTimerRunning()) {
        return;
    }
    if (timer.runstate == "run_now") {
        runningTimerArray.push(timer);
        if (!timer.persistence) {
            var ind = activeTimerArray.indexOf(timer);
            activeTimerArray.splice(ind, 1);
            deleteTimerListing(timer);
        } 
        else {
            updateTimerListing(timer);
            timer.runstate = "start_time";
        }
        if (timer.startNotification) {
            timer.displayStartNotification();
        }
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

const updateRunningName = (newName) => {
    runningName.innerHTML = newName;
}

const updateRunningPreset = (newPreset) => {
    runningPreset.innerHTML = newPreset;
}

const isTimerRunning = () => {
    if (runningTimerArray.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

const removeTimerFromActive = (timer) => {
    let ind = activeTimerArray.indexOf(timer);
    if (ind !== -1) {
        activeTimerArray.splice(ind, 1);
    }
}

const removeTimerFromRunning = (timer) => {
    if (isTimerRunning() && runningTimerArray.includes(timer)) {
        runningTimerArray.pop();
    }
}

const removeTimer = (timer) => {
    deleteTimerListing(timer);
    removeTimerFromActive(timer);
    removeTimerFromRunning(timer);
}

const resetRunningDisplay = () => {
    setRunningIndicator(false);
    updateRunningName("None");
    updateRunningPreset("None");
    updateRunningDuration(0);
}

const stopTimer = () => {
    if (isTimerRunning()) {
        if (runningTimerArray[0].persistence) {updateTimerListing(runningTimerArray[0]);}
        runningTimerArray.pop();
        resetRunningDisplay();
        activeToRunningArray();
    }
}

const endTimer = () => { //refactor into class if needed
    if (runningTimerArray.length === 0) {return;}
    if (runningTimerArray[0].endNotification) {
        runningTimerArray[0].displayEndNotification();
    }
    if (runningTimerArray[0].persistence) {
        updateTimerListing(runningTimerArray[0]);
    }
    runningTimerArray.pop();
    activeToRunningArray();
}

const isMatchingTime = (arr1, arr2) => {
    if (arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] == arr2[2]) {
        return true;
    }
    else {
        return false;
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
    else if (e.target.id == "countdownTimerButton" || e.target.parentElement.id == "countdownTimerButton") {
        clickedButton(4);
    }
    else if (e.target.id == "exampletimerButton2" || e.target.parentElement.id == "exampletimerButton2") {
        clickedButton(5);
    }
    else if (e.target.className == "applyButton") {
        timerToActiveArray();
    }
    else if (e.target.className == "stopButton") {
        stopTimer();
    }
    else if (e.target.parentElement.className == "runstateButton") { 
        //use currentClickedSidebarPair to determine which preset window you are currently on
        let currentRunstateButtons = sidebarTabPairs[currentClickedSidebarPair][3];
        if (e.target.id == "start_time") {
            for (var i=0; i < currentRunstateButtons.length; i++) {
                currentRunstateButtons[i].disabled = false;
            }
        }
        else if (e.target.id == "run_now") {
            for (var i=0; i < currentRunstateButtons.length; i++) {
                currentRunstateButtons[i].disabled = true;
            }
        }
    }
});

sliderValue.innerHTML = slider.value;
slider.oninput = () => { //we define an event handler for the oninput event listener of the slider element
    sliderValue.innerHTML = slider.value;
}


setInterval(() => { 
    //For every second we want to check each Timer in the activeTimerArray and if their startTime and days is equal to the currentTime and day 
    //then turn their runstate to run_now and call the handleTimerRunstate function in the case where there's no timer running
    if (isTimerRunning()) {
        if (!timerRunningSwitch) {
            timerRunningSwitch = true;
            toggleTimerInfo.style.display = "inline";
            setRunningIndicator(true);
            updateRunningName(runningTimerArray[0].name);
            updateRunningPreset(runningTimerArray[0].preset);
        }
        runningTimerArray[0].decrementDuration();
        if (Number(runningTimerArray[0].duration) === 0) {
            endTimer();
        }
    }
    else {
        if (timerRunningSwitch) {
            timerRunningSwitch = false;
            toggleTimerInfo.style.display = "none";
            resetRunningDisplay();
        }
    }
    if (activeTimerArray.length > 0) {
        let time = new Date();
        let todaysDay = time.getWeekDay();
        let currentTime = time.getCurrentTime();
        activeTimerArray.forEach(timer => {
            if (timer.runstate == "run_now") {return;}
            else if (timer.daysArray.includes(todaysDay) && isMatchingTime(timer.startTime, currentTime)) { //endTimer function can be included if you want starttime timers to be a priority
                timer.runstate = "run_now";
                handleTimerRunstate(timer);
            }
        });
    }
    return;
}, 1000);


//WHEN I WAKE UP:  Add a close button to remove a timer listing. Add persistence and start notification options(greyed out when runnow is picked). Try and implement an alarm sound, play around with it. Start the next timer preset customisation page.
//Add currenttime which updates somewhere on the page. 


//TODAY I WANT TO GET DONE: Implement all javascript for the starttime customisation options such as weekday and time. Display the time and weekday settings in listactive, it can be very simple.  Try and implement an alarm sound, play around with it. Start the next timer preset customisation page. If possible research how you will implement export and import buttons.    
//In listactive I want to display: name, preset,  runstate, starttime, list of weekdays in this order(I can also add duration but its not a priority) it should be a similar implementation to customAlert.
//I should also add a persistence customisation option which will never delete the timer from the activeArray.

//TODO define the PRESET names that you will be including to meet the requirements. Such as countdown timers, stopwatch, pomodoro timer etc.. 
//TODO add more customisation options such as browser notification when timer ends, possibly an alarm sound, alarm volume and duration, start times(time of day and days of the week should be greyed out until the option is chosen)
//For audio use the Audio object in javascript such as new Audio(""); and .play();