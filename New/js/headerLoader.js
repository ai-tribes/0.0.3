// Load header for index page only
function loadHeader() {
    const headerElement = document.getElementById('header');
    if (headerElement) {
        fetch('components/shared-header.html')
            .then(response => response.text())
            .then(html => {
                headerElement.innerHTML = html;
                // Initialize wallet modal after header is loaded
                initializeWalletModal();
            })
            .catch(error => console.error('Error loading header:', error));
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    const isSetupPage = window.location.pathname.includes('setup.html');
    
    // Load header only for index page
    if (!isSetupPage) {
        loadHeader();
    }
}); 