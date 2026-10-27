const display = document.querySelector("#display")
const keys = document.querySelector(".calculator__keys")

let displayValue = "0"

keys.addEventListener("click", (event) => {

    const key = event.target.closest("[data-digit]")
    if (!key) return

    const digit = key.dataset.digit
    displayValue = displayValue === "0" ? digit : displayValue + digit
    display.textContent = displayValue

})