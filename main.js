//First I want to change window when I click on a tab. I will need to add a listener to each id and change the background color of the button accordingly

let homepageButton = document.getElementById("homepage");
let customiseButton = document.getElementById("customise");
let runningButton = document.getElementById("running");
let listButton = document.getElementById("listactive");
//let windowTabs = document.getElementsByClassName("button"); //returns an array

function clickedHomepage() { 
    var activeWindowElement = document.getElementsByClassName("clickedButton")[0];
    if (activeWindowElement.id != "homepage") {
        activeWindowElement.className = "button";
        homepageButton.className = "clickedButton";
    }
    else {
        return;
    }
}

function clickedCustomise() {
    var activeWindowElement = document.getElementsByClassName("clickedButton")[0];
    if (activeWindowElement.id != "customise") {
        activeWindowElement.className = "button";
        customiseButton.className = "clickedButton";
    }
    else {
        return;
    }
}

function clickedRunning() {
    var activeWindowElement = document.getElementsByClassName("clickedButton")[0];
    if (activeWindowElement.id != "running") {
        activeWindowElement.className = "button";
        runningButton.className = "clickedButton";
    }
    else {
        return;
    }
}

function clickedListActive() {
    var activeWindowElement = document.getElementsByClassName("clickedButton")[0];
    if (activeWindowElement.id != "listactive") {
        activeWindowElement.className = "button";
        listButton.className = "clickedButton";
    }
    else {
        return;
    }
}

homepageButton.addEventListener("click", clickedHomepage);
customiseButton.addEventListener("click", clickedCustomise);
runningButton.addEventListener("click", clickedRunning);
listButton.addEventListener("click", clickedListActive);
