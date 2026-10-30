const display = document.querySelector("#display");
const keys = document.querySelector(".calculator__keys");
const decimalKey = document.querySelector('[data-action="decimal"]');
const divideByZeroMessage = "Nope, zero division!";
const invalidResultMessage = "Invalid result";
let displayValue = "0";
let firstNumber = null;
let selectedOperator = null;
let waitingForSecondNumber = false;
let resultDisplayed = false;

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

function updateDisplay() {
    display.textContent = displayValue;
    decimalKey.disabled =
        !waitingForSecondNumber &&
        !resultDisplayed &&
        displayValue.includes(".");
}

function clearCalculator() {
    displayValue = "0";
    firstNumber = null;
    selectedOperator = null;
    waitingForSecondNumber = false;
    resultDisplayed = false;
    updateDisplay();
}

function inputDigit(digit) {
    if (
        displayValue === divideByZeroMessage ||
        displayValue === invalidResultMessage
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

function inputDecimal() {
    if (
        displayValue === divideByZeroMessage ||
        displayValue === invalidResultMessage
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

function calculate() {
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
    if (result === null || !Number.isFinite(result)) {
        displayValue =
            selectedOperator === "/" && secondNumber === 0
                ? divideByZeroMessage
                : invalidResultMessage;
        updateDisplay();
        firstNumber = null;
        selectedOperator = null;
        waitingForSecondNumber = true;
        resultDisplayed = true;
        return false;
    }
    displayValue = String(Number(result.toPrecision(12)));
    firstNumber = result;
    selectedOperator = null;
    waitingForSecondNumber = true;
    resultDisplayed = true;
    updateDisplay();
    return true;
}

function selectOperator(operator) {
    if (
        displayValue === divideByZeroMessage ||
        displayValue === invalidResultMessage
    ) {
        return;
    }
    if (selectedOperator !== null && waitingForSecondNumber) {
        selectedOperator = operator;
        return;
    }
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
    updateDisplay();
}

function backspace() {
    if (
        displayValue === divideByZeroMessage ||
        displayValue === invalidResultMessage ||
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

function handleKeyClick(event) {
    const key = event.target.closest("button");
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

document.addEventListener("keydown", function (event) {
    if (/^[0-9]$/.test(event.key)) {
        inputDigit(event.key);
    } else if (event.key === ".") {
        inputDecimal();
    } else if (event.key === "+") {
        selectOperator("+");
    } else if (event.key === "-") {
        selectOperator("-");
    } else if (event.key === "*") {
        selectOperator("*");
    } else if (event.key === "/") {
        event.preventDefault();
        selectOperator("/");
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    } else if (event.key === "Escape") {
        clearCalculator();
    } else if (event.key === "Backspace") {
        backspace();
    }
});

if (keys && display) {
    keys.addEventListener("click", handleKeyClick);
}