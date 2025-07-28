import { UIThemeManager } from './change-theme.js';
import { UITaskManager } from './toggle-task-section.js';
import { fromHandleManager } from './form_handling.js';
import { taskManage } from './task_handling.js';
import { IndexedDBCRUDManager } from '../db/indexedDBCRUD.js';

/* Wait to DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    UIThemeManager.applyTheme();
    UITaskManager.show();

    document.querySelector('#toggle-task-section').addEventListener('click', () => UITaskManager.toggle());

    // Add a click event listener to the toggle-theme button
    // Call changeTheme function, passing the button element as an argument
    document.querySelector('#toggle-theme').addEventListener('click', () => UIThemeManager.changeTheme());

    document.querySelector('#task__form').addEventListener('submit', event => {
        event.preventDefault();

        const task = fromHandleManager.getTask();

        task.then(taskValue => {
            taskManage.create(taskValue);
            IndexedDBCRUDManager.readTasks();
        }).catch(err => console.error(err));
    });

    IndexedDBCRUDManager.readTasks();
});
