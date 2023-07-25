// Calculator class
class Calculator {
    constructor(previousOpTextElement, currentOpTextElement) {
        this.previousOpTextElement = previousOpTextElement;
        this.currentOpTextElement = currentOpTextElement;
        this.clear();
    }

    // Clear calculator values
    clear() {
        this.currentOp = "";
        this.previousOp = "";
        this.operation = undefined;
    }

    // Delete the last character from the current op
    delete() {
        this.currentOp = this.currentOp.toString().slice(0, -1);
    }

    // Append a number to the current op
    appendNumber(number) {
        if (number === "." && this.currentOp.includes("."))
            return;
        this.currentOp = this.currentOp.toString() + number.toString();
    }

    // Choose an operation & calculate
    chooseOperation(operator) {
        if (this.currentOp === "")
            return;
        if (this.previousOp !== "") {
            this.compute();
        }
        // Feature
        if (operator === "÷" && parseFloat(this.currentOp) === 0) {
            this.displayErrorMessage("Nice try! But you can't divide by zero.");
            return;
        }
        this.operation = operator;
        this.previousOp = this.currentOp;
        this.currentOp = "";
    }

    // Function to display error message
    displayErrorMessage(message) {
        const errorMessageElement = document.createElement('div');
        errorMessageElement.className = 'error-message';
        errorMessageElement.innerText = message;

        const displayContainer = document.querySelector('.display');
        displayContainer.appendChild(errorMessageElement);

        setTimeout(function () {
            errorMessageElement.remove();
        }, 2500); // Remove the error message after 2.5 seconds
    }

    // Compute the result of the operation
    compute() {
        let computation;
        const prev = parseFloat(this.previousOp);
        const curr = parseFloat(this.currentOp);
        
        if (isNaN(prev) || isNaN(curr))
            return;
        switch (this.operation) {
            case "+":
                computation = prev + curr;
                break;
            case "-":
                computation = prev - curr;
                break;
            case "*":
                computation = prev * curr;
                break;
            case "÷":
                if (curr === 0) { //Feature 
                    this.displayErrorMessage("You broke math! Dividing by zero leads to infinity.");
                    return;
                }
                computation = prev / curr;
                break;
            default:
                return;
        }

        if (!isFinite(computation)) {
            this.displayErrorMessage("Infinity! You're trying to break the universe.");
            return;
        }

        this.currentOp = computation;
        this.operation = undefined;
        this.previousOp = "";
    }

    // Format the number for output
    getOutputNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];
        let integerOutput;
        if (isNaN(integerDigits)) {
            integerOutput = "";
        } else {
            integerOutput = integerDigits.toLocaleString("en", { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerOutput}.${decimalDigits}`;
        } else {
            return integerOutput;
        }
    }

    // Update the output with current & previous ops
    updateOutput() {
        this.currentOpTextElement.innerText = this.getOutputNumber(this.currentOp);
        if (this.operation != null) {
            this.previousOpTextElement.innerText = `${this.getOutputNumber(this.previousOp)} ${this.operation}`;
        } else {
            this.previousOpTextElement.innerText = "";
        }
    }
}

const calculator = new Calculator(
    document.querySelector("[data-previous-op]"),
    document.querySelector("[data-current-op]")
);

// Function to handle button clicks
function handleClick(button) {
    const buttonValue = button.innerText;
    if (buttonValue === "DEL") {
        calculator.delete();
    } else if (buttonValue === "AC") {
        calculator.clear();
    } else if (buttonValue === "=") {
        calculator.compute();
    } else if (buttonValue === ".") {
        calculator.appendNumber(".");
    } else if (buttonValue === "+" || buttonValue === "-" || buttonValue === "*" || buttonValue === "÷") {
        calculator.chooseOperation(buttonValue);
    } else {
        calculator.appendNumber(buttonValue);
    }
    calculator.updateOutput();
}

const buttons = document.querySelectorAll("button");

// Add click event listeners to the buttons
buttons.forEach(button => {
    button.addEventListener("click", () => {
        handleClick(button);
    });
});