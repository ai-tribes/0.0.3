document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) return;

    // Determine which navbar to load
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    const navbarPath = isHomepage ? '/components/shared/navbar-home.html' : '/components/shared/navbar.html';

    // Load navbar content
    fetch(navbarPath)
        .then(response => response.text())
        .then(html => {
            navbarPlaceholder.innerHTML = html;
            initializeNavbar();
        })
        .catch(error => console.error('Error loading navbar:', error));
});

function initializeNavbar() {
    // Add active state to current page
    const currentPath = window.location.pathname;
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Initialize theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
} 