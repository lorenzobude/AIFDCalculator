// Select the calculator display and the container holding all buttons.
const display = document.querySelector("#display");
const keys = document.querySelector(".calculator__keys");
// Store the calculator's current state.
let displayValue = "0";              // Value currently shown on the display.
let firstNumber = null;              // First number in the calculation.
let selectedOperator = null;         // Currently selected mathematical operator.
let waitingForSecondNumber = false;  // True when waiting for the next number.
let resultDisplayed = false;         // True when a calculation result is displayed.
// ---------------- BASIC MATHEMATICAL FUNCTIONS ----------------
// Add two numbers and return the result.
function add(a, b) {
    return a + b;
}
// Subtract the second number from the first.
function subtract(a, b) {
    return a - b;
}
// Multiply two numbers.
function multiply(a, b) {
    return a * b;
}
// Divide two numbers, preventing division by zero.
function divide(a, b) {
    if (b === 0) {
        return null;
    }
    return a / b;
}
// Select the appropriate mathematical function.
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
// ---------------- DISPLAY AND RESET ----------------
// Update the text shown on the calculator display.
function updateDisplay() {
    display.textContent = displayValue;
}
// Reset the calculator to its initial state.
function clearCalculator() {
    displayValue = "0";
    firstNumber = null;
    selectedOperator = null;
    waitingForSecondNumber = false;
    resultDisplayed = false;
    updateDisplay();
}
// ---------------- NUMBER INPUT ----------------
// Handle a digit button press.
function inputDigit(digit) {
    // Clear an error message before accepting a new number.
    if (
        displayValue === "Cannot divide by zero!" ||
        displayValue === "Invalid result"
    ) {
        clearCalculator();
    }
    // Start a new number after selecting an operator or showing a result.
    if (waitingForSecondNumber || resultDisplayed) {
        displayValue = digit;
        waitingForSecondNumber = false;
        resultDisplayed = false;
    } else if (displayValue === "0") {
        // Replace the initial zero instead of adding another digit.
        displayValue = digit;
    } else {
        // Append the digit to the current number.
        displayValue += digit;
    }
    updateDisplay();
}
// ---------------- DECIMAL INPUT ----------------
// Add a decimal point to the current number.
function inputDecimal() {
    // Clear any error before starting a new number.
    if (
        displayValue === "Cannot divide by zero!" ||
        displayValue === "Invalid result"
    ) {
        clearCalculator();
    }
    if (waitingForSecondNumber || resultDisplayed) {
        // Start a new decimal number.
        displayValue = "0.";
        waitingForSecondNumber = false;
        resultDisplayed = false;
    } else if (!displayValue.includes(".")) {
        // Add a decimal point only if one does not already exist.
        displayValue += ".";
    }
    updateDisplay();
}
// ---------------- CALCULATION LOGIC ----------------
// Calculate the result using the selected operator.
function calculate() {
    // Ignore incomplete calculations such as pressing + and then =.
    if (
        selectedOperator === null ||
        waitingForSecondNumber ||
        firstNumber === null
    ) {
        return false;
    }
    // Convert the displayed second number from text to a number.
    const secondNumber = Number(displayValue);
    // Perform the selected mathematical operation.
    const result = operate(
        selectedOperator,
        firstNumber,
        secondNumber
    );
    // Handle division by zero and other invalid results.
    if (result === null || !Number.isFinite(result)) {
        displayValue =
            selectedOperator === "/" && secondNumber === 0
                ? "Cannot divide by zero!"
                : "Invalid result";
        updateDisplay();
        // Reset the calculation state after an error.
        firstNumber = null;
        selectedOperator = null;
        waitingForSecondNumber = true;
        resultDisplayed = true;
        return false;
    }
    // Limit unnecessary decimal digits and remove trailing zeros.
    displayValue = String(Number(result.toPrecision(12)));
    updateDisplay();
    // Store the result and prepare for the next operation.
    firstNumber = result;
    selectedOperator = null;
    waitingForSecondNumber = true;
    resultDisplayed = true;
    return true;
}
// ---------------- OPERATOR SELECTION ----------------
// Handle an operator button and chained calculations.
function selectOperator(operator) {
    // Do not start an operation while an error is displayed.
    if (
        displayValue === "Cannot divide by zero!" ||
        displayValue === "Invalid result"
    ) {
        return;
    }
    // Allow the user to change the operator before entering
    // the second number.
    if (selectedOperator !== null && waitingForSecondNumber) {
        selectedOperator = operator;
        return;
    }
    // Evaluate the previous operation before starting another.
    if (selectedOperator !== null) {
        const calculationSucceeded = calculate();
        if (!calculationSucceeded) {
            return;
        }
    }
    // Store the current display value as the first number.
    firstNumber = Number(displayValue);
    // Remember the selected operator.
    selectedOperator = operator;
    // Wait for the next number.
    waitingForSecondNumber = true;
    resultDisplayed = false;
}
// ---------------- BACKSPACE ----------------
// Remove the last digit from the displayed number.
function backspace() {
    // Reset if an error or completed result is displayed.
    if (
        displayValue === "Cannot divide by zero!" ||
        displayValue === "Invalid result" ||
        resultDisplayed
    ) {
        clearCalculator();
        return;
    }
    // Do nothing while waiting for the second number.
    if (waitingForSecondNumber) {
        return;
    }
    // Remove the last character.
    displayValue = displayValue.slice(0, -1);
    // Display zero if no digits remain.
    if (displayValue === "" || displayValue === "-") {
        displayValue = "0";
    }
    updateDisplay();
}
// ---------------- BUTTON CLICK HANDLING ----------------
// Identify the pressed button and call its corresponding function.
function handleKeyClick(event) {
    // Find the button that was clicked.
    const key = event.target.closest("button");
    // Ignore clicks that are not on calculator buttons.
    if (!key || !keys.contains(key)) {
        return;
    }
    // Handle number buttons.
    if (key.dataset.digit !== undefined) {
        inputDigit(key.dataset.digit);
    // Handle the equals button.
    } else if (key.dataset.operator === "=") {
        calculate();
    // Handle mathematical operator buttons.
    } else if (key.dataset.operator !== undefined) {
        selectOperator(key.dataset.operator);
    // Handle the clear button.
    } else if (
        key.dataset.action === "clear" ||
        key.dataset.action === "all-clear"
    ) {
        clearCalculator();
    // Handle the decimal button.
    } else if (key.dataset.action === "decimal") {
        inputDecimal();
    // Handle the backspace button.
    } else if (key.dataset.action === "backspace") {
        backspace();
    }
}
// ---------------- KEYBOARD SUPPORT ----------------
// Allow calculations using the physical keyboard.
document.addEventListener("keydown", function (event) {
    // Enter a digit from 0 to 9.
    if (/^[0-9]$/.test(event.key)) {
        inputDigit(event.key);
    // Enter a decimal point.
    } else if (event.key === ".") {
        inputDecimal();
    // Handle addition.
    } else if (event.key === "+") {
        selectOperator("+");
    // Handle subtraction.
    } else if (event.key === "-") {
        selectOperator("-");
    // Handle multiplication.
    } else if (event.key === "*") {
        selectOperator("*");
    // Handle division.
    } else if (event.key === "/") {
        event.preventDefault();
        selectOperator("/");
    // Calculate using Enter or =.
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        calculate();
    // Clear the calculator using Escape.
    } else if (event.key === "Escape") {
        clearCalculator();
    // Delete the last digit using Backspace.
    } else if (event.key === "Backspace") {
        backspace();
    }
});
// ---------------- EVENT LISTENER ----------------
// Connect the calculator buttons to the click handler.
if (keys && display) {
    keys.addEventListener("click", handleKeyClick);
}
