// Import the CRUD manager for handling IndexedDB operations
import { IndexedDBCRUDManager } from '../db/indexedDBCRUD.js';
// Import the UI manager for manipulating the interface
import { UIManager } from './UI.js';

// Define a class responsible for creating task objects
class Task {
    constructor() {
        // This is the base template for a task object
        this.taskTemplate = {
            task__id: '', // Unique ID for the task
            task__description: '', // Task description (user input)
            task__edited: false, // Boolean to track if the task was edited
            task__edited__date: '' // Date of the last edit (if any)
        };
    }

    // Method to create a new task
    create(taskValue) {
        // Generate a unique ID using timestamp and random number
        const ID = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

        // Assign the ID to the task template
        this.taskTemplate.id = ID; // This field seems redundant unless used elsewhere
        this.taskTemplate.task__id = ID;

        // Assign the input value as the task description
        this.taskTemplate.task__description = taskValue;

        // Save the task to the IndexedDB via the CRUD manager
        IndexedDBCRUDManager.createTask(this.taskTemplate);

        // Clear the task input field in the UI
        UIManager.clearInput();
    }
}

// Export a single instance of the Task class to be used throughout the app
export const taskManage = new Task();
