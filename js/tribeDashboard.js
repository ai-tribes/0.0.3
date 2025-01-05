document.addEventListener('DOMContentLoaded', function() {
    // View Dashboard button click handler
    document.querySelectorAll('.view-dashboard-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tribeCard = this.closest('.tribe-card');
            const tribeId = tribeCard.dataset.tribeId;
            showTribeDashboard(tribeId);
        });
    });

    // Handle tab navigation
    document.querySelectorAll('.nav-link').forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.getAttribute('href') === '#tribes') {
                document.querySelector('.tribes-list-view').style.display = 'block';
                document.querySelector('.tribe-dashboard-view').style.display = 'none';
            }
        });
    });

    function showTribeDashboard(tribeId) {
        // Hide tribes list
        document.querySelector('.tribes-list-view').style.display = 'none';
        // Show dashboard
        const dashboardView = document.querySelector('.tribe-dashboard-view');
        dashboardView.style.display = 'block';
        
        // Update dashboard content based on tribe
        updateDashboardContent(tribeId);
    }

    function updateDashboardContent(tribeId) {
        // Here we would load the specific tribe's data
        const dashboard = document.querySelector('.tribe-dashboard');
        // For now, just update the title
        const tribeName = document.querySelector(`[data-tribe-id="${tribeId}"] h5`).textContent;
        dashboard.querySelector('h2').textContent = tribeName;
    }
}); 