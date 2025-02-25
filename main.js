//First I want to change window when I click on a tab. I will need to add a listener to each id and change the background color of the button accordingly

let homepageButton = document.getElementById("homepageButton");
let customiseButton = document.getElementById("customiseButton");
let runningButton = document.getElementById("runningButton");
let listButton = document.getElementById("listactiveButton");
let homepage = document.getElementById("homepage");
let customise = document.getElementById("customise");
let running = document.getElementById("running");
let listActive = document.getElementById("listactive");
let exampleButton = document.getElementById("exampletimerButton");
let example2Button = document.getElementById("exampletimerButton2");
let exampleTimer = document.getElementById("example");
let example2Timer = document.getElementById("example2");
let slider = document.getElementById("myslider");
let sliderValue = document.getElementById("sliderValue");
let arrayPairs = [[homepageButton, homepage], [customiseButton, customise], [runningButton, running], [listButton, listActive], [exampleButton, exampleTimer], [example2Button, example2Timer]]
const windowTabNumber = 4;
let currentClickedWindowPair = 0; //can be used for validation of the current window
let currentClickedSidebarPair = windowTabNumber;

const clickedButton = (arrayPairIndex) => { //new arrow function - the arrayPairIndex parameter is the arrayPairs index corresponding to the button that has been clicked
    var classnameClicked = "clickedButton";
    var classnameButton = "button";
    if (arrayPairIndex >= windowTabNumber) {
        classnameClicked = "clickedSidebarButton";
        classnameButton = "sidebarButton";
    }
    var activeWindowElement = document.getElementsByClassName(classnameClicked)[0];
    if (activeWindowElement.id != arrayPairs[arrayPairIndex][0].id) {
        activeWindowElement.className = classnameButton;
        arrayPairs[arrayPairIndex][0].className = classnameClicked;
        arrayPairs[arrayPairIndex][1].style.display = "block";
        if (arrayPairIndex >= windowTabNumber) {
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

//Create a event handler function that responds to a an apply button press, all values associated with the timer will be attributes of a timer object, this timer object is then pushed to an array of active timers.
//Create a function for evaluating the array of timer objects, if their attribute has 'Run now'(Or start time is matched) then remove it from the active array and add to the running array as long it is empty.
//Create a function that is the result of evaluating the running array to see if there is a timer object. Run this function if there is a timer object until its duration reaches 0 decrementing its attribute for each cycle. 

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
});

sliderValue.innerHTML = slider.value;
slider.oninput = () => { //we define an event handler for the oninput event listener of the slider element
    sliderValue.innerHTML = slider.value;
}