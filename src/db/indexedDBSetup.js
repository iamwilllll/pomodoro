// Import custom errors
import { DataBaseError } from '../scripts/error_handling.js';

// Database class
class DB {
    // Create global variables in this scope using .this
    constructor() {
        this.DB_NAME = 'taskList';
        this.DB_VERSION = 1;
    }

    // Method to create the IndexedDB database
    create() {
        return new Promise((resolve, reject) => {
            const db = window.indexedDB.open(this.DB_NAME, this.DB_VERSION);

            // Define database structure
            db.onupgradeneeded = event => {
                // Note: This code runs only once, so it's good practice to define the structure here
                const dbResult = event.target.result;

                dbResult.createObjectStore(this.DB_NAME, { keyPath: 'id', autoIncrement: true });
            };

            // If successful, resolve the promise
            db.onsuccess = event => resolve(event.target.result);

            // If error occurs, reject the promise
            db.onerror = () => reject(new DataBaseError('Error opening the database'));
        });
    }
}

// Instantiate and export class
export const DBManager = new DB();