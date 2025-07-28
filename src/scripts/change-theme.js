// Create a class to manage the UI theme behavior (dark/light mode)
class UITheme {
    applyTheme() {
        // Look for the saved theme in localStorage; if none is found, default to 'dark'
        const savedTheme = localStorage.getItem('theme') || 'dark';

        // Apply the saved theme to the root <html> element using the 'data-theme' attribute
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update the icon to match the applied theme
        UIThemeManager.changeIcon(savedTheme);
    }

    changeTheme() {
        // Get the current theme from the 'data-theme' attribute
        let currentTheme = document.documentElement.getAttribute('data-theme');

        // Toggle the theme: if it's 'dark', switch to 'light'; otherwise, switch to 'dark'
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Apply the new theme to the <html> element
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Save the new theme in localStorage to persist between sessions
        localStorage.setItem('theme', currentTheme);

        // Update the theme icon to reflect the current theme
        UIThemeManager.changeIcon(currentTheme);
    }

    changeIcon(theme) {
        // Select the theme toggle button container
        const toggleThemeHTML = document.querySelector('#toggle-theme');

        // Remove the previous icon, if it exists
        const toggleThemeIconHTML = document.querySelector('#change-theme-icon');

        // Create a new <svg> element using the SVG namespace
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('icon', 'toolbar__icon');
        svg.id = 'change-theme-icon';

        // Create a <use> element to reference the correct icon
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');

        // Set the appropriate icon depending on the theme:
        // - Sun icon for dark theme (to indicate you can switch to light)
        // - Moon icon for light theme (to indicate you can switch to dark)

        const hrefValue = theme === 'dark' ? '../images/svg/sprite.svg#sun-icon' : '../images/svg/sprite.svg#moon-icon';

        // Set the href attribute using the xlink namespace
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', hrefValue);

        // Append the <use> element to the SVG
        svg.appendChild(use);

        // Remove the old icon if it exists
        if (toggleThemeIconHTML) toggleThemeIconHTML.remove();

        // Append the new icon to the toggle button
        toggleThemeHTML.appendChild(svg);
    }
}

// Instantiate the class and export it to be used throughout the app
export const UIThemeManager = new UITheme();
