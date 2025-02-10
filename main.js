//First I want to change window when I click on a tab. I will need to add a listener to each id and change the background color of the button accordingly

let homepageButton = document.getElementById("homepageButton");
let customiseButton = document.getElementById("customiseButton");
let runningButton = document.getElementById("runningButton");
let listButton = document.getElementById("listactiveButton");
let homepage = document.getElementById("homepage");
let customise = document.getElementById("customise");
let running = document.getElementById("running");
let listActive = document.getElementById("listactive");
let arrayPairs = [[homepageButton, homepage], [customiseButton, customise], [runningButton, running], [listButton, listActive]]
let currentClickedArrayPair = 0; //can be used for validation of the current window


const clickedButton = (arrayPairIndex) => { //new arrow function - the arrayPairIndex parameter is the arrayPairs index corresponding to the button that has been clicked
    var activeWindowElement = document.getElementsByClassName("clickedButton")[0];
    if (activeWindowElement.id != arrayPairs[arrayPairIndex][0].id) {
        activeWindowElement.className = "button";
        arrayPairs[currentClickedArrayPair][1].style.display = "none"; //I set the corresponding window for the previously clicked button to display = none.
        arrayPairs[arrayPairIndex][0].className = "clickedButton";
        arrayPairs[arrayPairIndex][1].style.display = "block";
        currentClickedArrayPair = arrayPairIndex;
    }
    else {
        return;
    }
    return;
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
    });
