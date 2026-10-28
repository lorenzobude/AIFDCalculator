const display = document.querySelector("#display");
const keys = document.querySelector(".calculator__keys");

// Calculator state
let displayValue = "0";
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
        case "+":
            return add(a, b);
        case "-":
            return subtract(a, b);
        case "*":
            return multiply(a, b);
        case "/":
            return divide(a, b);
        default:
            return null;
    }
}

//  Update the display
function updateDisplay() {
    display.textContent = displayValue;
}

// Handle number buttons
function inputDigit(digit) {
    if (waitingForSecondNumber) {
        displayValue = digit;
        waitingForSecondNumber = false;
    } else if (displayValue === "0") {
        displayValue = digit;
    } else {
        displayValue = displayValue + digit;
    }

    updateDisplay();
}

// Calculate the result
function calculate() {
    if (selectedOperator === null || waitingForSecondNumber) {
        return false;
    }

    const secondNumber = Number(displayValue);
    const result = operate(selectedOperator, firstNumber, secondNumber);

    if (result === null) {
        displayValue = "Cannot divide by zero!";
        updateDisplay();

        firstNumber = null;
        selectedOperator = null;
        waitingForSecondNumber = true;

        return false;
    }

    displayValue = String(Number(result.toPrecision(12)));
    updateDisplay();

    firstNumber = result;
    selectedOperator = null;
    waitingForSecondNumber = true;

    return true;
}

// Handle operator buttons
function selectOperator(operator) {
    if (selectedOperator !== null && !calculate()) {
        return;
    }

    firstNumber = Number(displayValue);
    selectedOperator = operator;
    waitingForSecondNumber = true;
}

// Handle button clicks
function handleKeyClick(event) {
    const key = event.target.closest("button");

    if (!key)
        return;

    if (key.dataset.digit !== undefined) {
        inputDigit(key.dataset.digit);
    } else if (key.dataset.operator === "=") {
        calculate();
    } else if (key.dataset.operator !== undefined) {
        selectOperator(key.dataset.operator);
    }
}


keys.addEventListener("click", handleKeyClick);
