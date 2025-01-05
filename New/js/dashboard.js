// Track current active dashboard
let currentDashboard = null;

function loadTribeDashboard(tribeId) {
    const dashboardContainer = document.getElementById('tribe-dashboard-container');
    
    // First, clear any existing dashboard
    dashboardContainer.innerHTML = '';
    
    // Show loading state
    dashboardContainer.innerHTML = '<div class="loading">Loading dashboard...</div>';
    dashboardContainer.style.display = 'block';

    // Load specific dashboard based on tribe ID
    switch(tribeId) {
        case 'neuralai':
            fetch('components/dashboards/neuralai.html')
                .then(response => response.text())
                .then(html => {
                    currentDashboard = 'neuralai';
                    dashboardContainer.innerHTML = html;
                });
            break;

        case 'meta-builders':
            fetch('components/dashboards/meta-builders.html')
                .then(response => response.text())
                .then(html => {
                    currentDashboard = 'meta-builders';
                    dashboardContainer.innerHTML = html;
                });
            break;

        case 'close':
            // Handle dashboard closing
            currentDashboard = null;
            dashboardContainer.style.display = 'none';
            dashboardContainer.innerHTML = '';
            break;

        default:
            console.error('Unknown dashboard:', tribeId);
            dashboardContainer.innerHTML = '<div class="alert alert-danger">Dashboard not found</div>';
    }
}

// Add close button to each dashboard
function addDashboardCloseButton() {
    const closeButton = document.createElement('button');
    closeButton.className = 'dashboard-close-btn btn btn-outline-secondary';
    closeButton.innerHTML = '<i class="fas fa-times"></i> Close Dashboard';
    closeButton.onclick = () => loadTribeDashboard('close');
    
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (dashboardHeader) {
        dashboardHeader.appendChild(closeButton);
    }
}

// Listen for dashboard content changes
const dashboardContainer = document.getElementById('tribe-dashboard-container');
const observer = new MutationObserver(() => {
    if (currentDashboard) {
        addDashboardCloseButton();
    }
});

observer.observe(dashboardContainer, { childList: true }); 