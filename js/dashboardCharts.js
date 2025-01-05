document.addEventListener('DOMContentLoaded', function() {
    // Token Price Chart
    const priceCtx = document.querySelector('.token-chart').getContext('2d');
    new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Token Price',
                data: [0.015, 0.018, 0.022, 0.019, 0.021, 0.0234],
                borderColor: '#0d6efd',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    // Token Distribution Chart
    const distributionCtx = document.querySelector('.distribution-chart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Community', 'Treasury', 'Team', 'Marketing'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#0dcaf0',
                    '#ffc107'
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: '70%'
        }
    });
}); 