// Import custom form errors
import { FormError } from './error_handling.js';

// Create a class to handle the form
class FromHandle {
    constructor() {
        // Select the task input element
        this.taskInput = document.querySelector('#task__input');

        // Store the input value
        this.taskInputValue = null;
    }

    // Method to get the task input value
    getTask() {
        // Create and return a promise
        return new Promise((resolve, reject) => {
            // Call the method to get the trimmed input value
            const inputValue = this.getInputValue();

            // If the input has a value
            if (inputValue) {
                // Check if the input contains only valid characters
                const isValid = this.testValue(inputValue);

                // If the input is valid, resolve the promise
                // Otherwise, reject it with a custom error
                isValid ? resolve(isValid) : reject(new FormError('The form contains invalid characters'));
            }

            // If the input is empty, reject with a custom error
            if (!inputValue) reject(new FormError('Task input is empty'));
        });
    }

    // Method to retrieve and clean the input value
    getInputValue() {
        // Get and trim the input value
        this.taskInputValue = this.taskInput.value.trim();

        // If the value is empty, return undefined
        if (!this.taskInputValue) return;

        // Otherwise, return the cleaned input value
        return this.taskInputValue;
    }

    // Method to test if the input value contains only valid characters
    testValue(inputValue) {
        // Regex to allow letters, numbers, spaces, and common punctuation (length between 3 and 100)
        const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,:;!?()-]{3,100}$/;

        // Check if the input matches the pattern
        const isValid = regex.test(inputValue);

        // If valid, return the input value
        if (isValid) return inputValue;

        // If not valid, return false
        if (!isValid) return false;
    }
}

// Export an instance of the form handler
export const fromHandleManager = new FromHandle();
