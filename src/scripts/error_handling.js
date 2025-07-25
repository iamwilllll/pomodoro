// Function to create custom errors
export default function errorHandle(name) {
    return class extends Error {
        constructor(message) {
            super(message);
            this.name = name;
            this.stack = '';
        }
    };
}

// Error for the databases
export const DataBaseError = errorHandle('dataBaseError');
export const FormError = errorHandle('FormError');

/* 
This function generates custom error classes using the name passed as a parameter.
It is used to create different types of reusable errors in the application, such as 'DataBaseError' or 'AuthError'.
By extending the native Error class, it maintains compatibility with standard error handling mechanisms.
This allows better identification of errors in the console and keeps the codebase more organized.

Basic usage example:
    const DataBaseError = errorHandle('DataBaseError');
    throw new DataBaseError('Could not open the database');

--------------------------------------------
Example of use in this project:

** In "error_handling.js" **
The constant is exported to be reused in other modules:
    export const DataBaseError = errorHandle('DataBaseError');

** In another file **
Import the custom error:
    import { DataBaseError } from './error_handling.js';

Use it like any standard error:
    throw new DataBaseError('There was an error while trying to create the database');
--------------------------------------------
*/
