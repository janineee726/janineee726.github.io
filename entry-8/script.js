let screenSquare = document.getElementById("screen");
let colorInput = document.getElementById("color-input");
let textInput = document.getElementById("text-input");
let rangeInput = document.getElementById("range-input");

// STEP 2: INPUT THAT CHANGES THE BACKGROUND
function changeColor() {
  screenSquare.style.backgroundColor = colorInput.value;
  // console.log(colorInput.value);
}

// STEP 3: INPUT THAT CHANGES THE TEXT
function changeText() {
  screenSquare.innerHTML = "Hello, " + textInput.value + ".";
}


// STEP 4: INPUT THAT CHANGES THE SQUARE SIZE
function changeSize() {
  screenSquare.style.width = rangeInput.value + "px";
  screenSquare.style.height = rangeInput.value + "px";
}


// STEP 5: INPUT THAT TOGGLES A CLASS
function changeClass() {
  screenSquare.classList.toggle("funBox");
}