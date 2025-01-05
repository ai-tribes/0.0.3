function copyToClipboard(addressType) {
    const addresses = {
        'sol-address': 'Aa1xZ...7Ypq9',
        'eth-address': '0x742...F9b2',
        'bsv-address': 'Bsv8x...K2p4'
    };

    const text = addresses[addressType];
    navigator.clipboard.writeText(text).then(() => {
        showToast('Address copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy address', 'error');
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.innerHTML = `
        <div class="toast-header">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <strong class="me-auto">${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
} 