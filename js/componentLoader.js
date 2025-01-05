// Add this to your existing component loading logic
function loadPricingComponent() {
    const pricingContainer = document.getElementById('pricing-container');
    if (pricingContainer) {
        fetch('components/shared/pricing.html')
            .then(response => response.text())
            .then(html => {
                pricingContainer.innerHTML = html;
            })
            .catch(error => console.error('Error loading pricing component:', error));
    }
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPricingComponent();
    // ... other component loading calls
}); 