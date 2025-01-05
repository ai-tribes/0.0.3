document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = themeToggle.querySelector('i');
    const logo = document.querySelector('.navbar-brand img');
    
    // Store initial logo src
    console.log('Initial logo src:', logo.src);
    const lightLogo = 'tribes_logo.png';
    const darkLogo = 'assets/logos/ai-tribes_logo_night.png';
    
    // Check for saved theme preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        enableDarkMode();
    }
    
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        moonIcon.classList.remove('fa-moon');
        moonIcon.classList.add('fa-sun');
        logo.src = darkLogo;
        console.log('Dark mode logo set to:', logo.src);
        localStorage.setItem('darkMode', 'enabled');
    }
    
    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        moonIcon.classList.remove('fa-sun');
        moonIcon.classList.add('fa-moon');
        logo.src = lightLogo;
        localStorage.setItem('darkMode', null);
    }
}); 