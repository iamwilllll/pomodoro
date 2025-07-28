import { IndexedDBCRUDManager } from '../db/indexedDBCRUD.js';

class UI {
    constructor() {
        this.taskContainer = document.querySelector('#tasks__container');
    }

    renderAllTasks(taskObj) {
        const { task__id, task__description, task__edited, task__edited__date } = taskObj;
        // Create the HTML structure for the task
        const taskHTML = this.createDOMTask(task__id, task__description, task__edited, task__edited__date);

        // Append the task element to the DOM
        this.appendTask(taskHTML);
    }

    createDOMTask(task__id, task__description, task__edited, task__edited__date) {
        // Create the task container element
        const container = document.createElement('LI');
        container.classList.add('task'); // Add class for CSS styling
        container.dataset.id = task__id; // Store the task ID as a data attribute

        // Create the element to display the task description
        const taskDescription = document.createElement('SPAN');
        taskDescription.textContent = task__description;

        // Create the delete button
        const taskDelete = document.createElement('BUTTON');
        taskDelete.textContent = 'Delete';

        // Create the edit button
        const taskEdit = document.createElement('BUTTON');
        taskEdit.textContent = 'Edit';

        // Append description and buttons to the task container
        container.append(taskDescription, taskDelete, taskEdit);

        // Add click event to the edit button to load the task into the form for editing
        taskEdit.addEventListener('click', () => IndexedDBCRUDManager.editTask(task__id));

        // Add click event to the delete button to remove the task from the database
        taskDelete.addEventListener('click', () => {
            IndexedDBCRUDManager.deleteTask(task__id);
            IndexedDBCRUDManager.readTasks();
        });

        // Return the complete task element
        return container;
    }

    // Method to append the task to the container, avoiding duplicates
    appendTask(container) {
        const id = container.dataset.id;

        // Check if a task with the same ID already exists in the DOM
        const exists = this.taskContainer.querySelector(`[data-id="${id}"]`);

        if (exists) return; // If it exists, don't add it again

        // Append the task to the task list container
        this.taskContainer.appendChild(container);
    }

    // Method to clear all tasks from the DOM
    clearTasks() {
        this.taskContainer.innerHTML = '';
    }

    clearInput() {
        document.querySelector('#task__input').value = '';
    }
}

export const UIManager = new UI();
