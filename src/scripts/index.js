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
