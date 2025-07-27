import { UIThemeManager } from './change-theme.js';
import { UITaskManager } from './toggle-task-section.js';

/* Wait to DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    UIThemeManager.applyTheme();
    UITaskManager.show();

    document.querySelector('#toggle-task-section').addEventListener('click', () => UITaskManager.toggle());

    // Add a click event listener to the toggle-theme button
    // Call changeTheme function, passing the button element as an argument
    document.querySelector('#toggle-theme').addEventListener('click', () => UIThemeManager.changeTheme());
});

/* 
const newTask = {
    id: Date.now(),
    task_decription: 'learnig indexedDB'
};

const editedTask = {
    id: 1753657978306,
    task_decription: 'Edited asdasd',
    new_id: Date.now()
};

// IndexedDBCRUDManager.createTask(newTask);
// IndexedDBCRUDManager.readTask();

IndexedDBCRUDManager.editTask(editedTask);
// IndexedDBCRUDManager.deleteTask(1753501956460);
 */
