/* This file is only used on mobile to slide the task section upward */

/* Create the UITask class to manage the task section visibility and icon */
class UITask {
    toggle() {
        // Select the task section container
        const taskContainerHTML = document.querySelector('#tasks');

        // Toggle visibility classes: show or hide the task section
        taskContainerHTML.classList.toggle('show');
        taskContainerHTML.classList.toggle('hidden');

        // Update the task toggle icon based on visibility
        this.show();
    }

    show() {
        let hrefValue;

        // Get the current task container element
        const taskContainerHTML = document.querySelector('#tasks');

        // Check if the task section is currently hidden
        const visibility = taskContainerHTML.classList.contains('hidden');

        // Get the button that toggles the task section
        const toggleTaskHTML = document.querySelector('#toggle-task-section');

        // Get the current SVG icon (if any)
        const toggleTaskIconHTML = document.querySelector('#change-task-icon');

        // Create a new SVG element to display the appropriate icon
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon', 'toolbar__icon');
        svg.id = 'change-task-icon';

        // Create a <use> element to reference the SVG symbol
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

        // Determine which icon to show based on visibility
        if (visibility) hrefValue = '../images/svg/sprite.svg#task-open-icon';
        if (!visibility) hrefValue = '../images/svg/sprite.svg#task-close-icon';

        // Set the href for the <use> element to the correct icon
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', hrefValue);

        // Append the <use> element to the SVG
        svg.appendChild(use);

        // Remove the previous icon, if it exists
        if (toggleTaskIconHTML) toggleTaskIconHTML.remove();

        // Append the new icon to the toggle button
        toggleTaskHTML.appendChild(svg);
    }
}

/* Instantiate the UITask class and export it to be used in other parts of the application */
export const UITaskManager = new UITask();
