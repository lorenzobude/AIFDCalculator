const display = document.querySelector(”#display”);
const keys = document.querySelector(”.calculator__keys”);

// Calculator state
let displayValue = “0”;
let firstNumber = null;
let selectedOperator = null;
let waitingForSecondNumber = false;
let resultDisplayed = false;

// Basic mathematical functions
function add(a, b) {
return a + b;
}

function subtract(a, b) {
return a - b;
}

function multiply(a, b) {
return a * b;
}

function divide(a, b) {
if (b === 0) {
return null;
}

return a / b;

}

// Select and execute the mathematical operation
function operate(operator, a, b) {
switch (operator) {
case “+”:
return add(a, b);
case “-”:
return subtract(a, b);
case “*”:
return multiply(a, b);
case “/”:
return divide(a, b);
default:
return null;
}
}

// Update the display
function updateDisplay() {
display.textContent = displayValue;
}

// Reset the calculator
function clearCalculator() {
displayValue = “0”;
firstNumber = null;
selectedOperator = null;
waitingForSecondNumber = false;
resultDisplayed = false;

updateDisplay();

}

// Handle number buttons
function inputDigit(digit) {
// Start a fresh calculation after an error or completed result
if (
displayValue === “Cannot divide by zero!” ||
displayValue === “Invalid result”
) {
clearCalculator();
}

if (waitingForSecondNumber || resultDisplayed) {
    displayValue = digit;
    waitingForSecondNumber = false;
    resultDisplayed = false;
} else if (displayValue === "0") {
    displayValue = digit;
} else {
    displayValue += digit;
}
updateDisplay();

}

// Handle decimal input
function inputDecimal() {
if (
displayValue === “Cannot divide by zero!” ||
displayValue === “Invalid result”
) {
clearCalculator();
}

if (waitingForSecondNumber || resultDisplayed) {
    displayValue = "0.";
    waitingForSecondNumber = false;
    resultDisplayed = false;
} else if (!displayValue.includes(".")) {
    displayValue += ".";
}
updateDisplay();

}

// Calculate the result
function calculate() {
// Ignore incomplete calculations
if (
selectedOperator === null ||
waitingForSecondNumber ||
firstNumber === null
) {
return false;
}

const secondNumber = Number(displayValue);
const result = operate(
    selectedOperator,
    firstNumber,
    secondNumber
);
// Handle division by zero and invalid results
if (result === null || !Number.isFinite(result)) {
    displayValue =
        selectedOperator === "/" && secondNumber === 0
            ? "Cannot divide by zero!"
            : "Invalid result";
    updateDisplay();
    firstNumber = null;
    selectedOperator = null;
    waitingForSecondNumber = true;
    resultDisplayed = true;
    return false;
}
// Format long decimal results
displayValue = String(Number(result.toPrecision(12)));
updateDisplay();
firstNumber = result;
selectedOperator = null;
waitingForSecondNumber = true;
resultDisplayed = true;
return true;

}

// Handle operator buttons and chained operations
function selectOperator(operator) {
if (
displayValue === “Cannot divide by zero!” ||
displayValue === “Invalid result”
) {
return;
}

// Allow changing the operator before entering the second number
if (selectedOperator !== null && waitingForSecondNumber) {
    selectedOperator = operator;
    return;
}
// Evaluate the previous operation before continuing
if (selectedOperator !== null) {
    const calculationSucceeded = calculate();
    if (!calculationSucceeded) {
        return;
    }
}
firstNumber = Number(displayValue);
selectedOperator = operator;
waitingForSecondNumber = true;
resultDisplayed = false;

}

// Handle backspace
function backspace() {
if (
displayValue === “Cannot divide by zero!” ||
displayValue === “Invalid result” ||
resultDisplayed
) {
clearCalculator();
return;
}

if (waitingForSecondNumber) {
    return;
}
displayValue = displayValue.slice(0, -1);
if (displayValue === "" || displayValue === "-") {
    displayValue = "0";
}
updateDisplay();

}

// Handle button clicks
function handleKeyClick(event) {
const key = event.target.closest(“button”);

if (!key || !keys.contains(key)) {
    return;
}
if (key.dataset.digit !== undefined) {
    inputDigit(key.dataset.digit);
} else if (key.dataset.operator === "=") {
    calculate();
} else if (key.dataset.operator !== undefined) {
    selectOperator(key.dataset.operator);
} else if (
    key.dataset.action === "clear" ||
    key.dataset.action === "all-clear"
) {
    clearCalculator();
} else if (key.dataset.action === "decimal") {
    inputDecimal();
} else if (key.dataset.action === "backspace") {
    backspace();
}

}

// Keyboard support
document.addEventListener(“keydown”, function (event) {
if (/^[0-9]$/.test(event.key)) {
inputDigit(event.key);
} else if (event.key === “.”) {
inputDecimal();
} else if (event.key === “+”) {
selectOperator(”+”);
} else if (event.key === “-”) {
selectOperator(”-”);
} else if (event.key === “”) {
selectOperator(””);
} else if (event.key === “/”) {
event.preventDefault();
selectOperator(”/”);
} else if (event.key === “Enter” || event.key === “=”) {
event.preventDefault();
calculate();
} else if (event.key === “Escape”) {
clearCalculator();
} else if (event.key === “Backspace”) {
backspace();
}
});

// Attach the click listener
if (keys && display) {
keys.addEventListener(“click”, handleKeyClick);
}
