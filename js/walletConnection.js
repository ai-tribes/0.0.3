// Wallet connection state
let walletConnected = false;
let connectedWallet = null;

// Show wallet modal on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!walletConnected) {
            showWalletModal();
        }
    }, 1000); // Small delay for better UX
});

// Handle wallet connection
async function connectWallet(walletType) {
    try {
        // Existing wallet connection logic...
        const connected = await connectToWallet(walletType);
        
        if (connected) {
            walletConnected = true;
            connectedWallet = walletType;
            
            // Update UI
            updateWalletUI();
            
            // Close modal
            const walletModal = bootstrap.Modal.getInstance(document.getElementById('walletModal'));
            walletModal.hide();
            
            // Show success message
            showToast('Wallet Connected', `Successfully connected ${walletType} wallet!`, 'success');
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        showToast('Connection Error', 'Failed to connect wallet. Please try again.', 'error');
    }
}

// Update UI after wallet connection
function updateWalletUI() {
    const walletBtn = document.getElementById('walletButton');
    const createTribeBtn = document.getElementById('createTribeBtn');
    
    // Update wallet button
    walletBtn.innerHTML = `
        <i class="fas fa-wallet"></i>
        Connected
        <span class="badge bg-success ms-2">
            ${shortenAddress(connectedWallet.address)}
        </span>
    `;
    walletBtn.classList.remove('btn-custom');
    walletBtn.classList.add('btn-success');
    
    // Enable create tribe button
    createTribeBtn.disabled = false;
    createTribeBtn.title = 'Create your AI tribe';
}

// Navigate to setup page
function goToSetup() {
    if (!walletConnected) {
        showWalletModal();
        return;
    }
    window.location.href = 'setup.html';
}

// Helper function to show toast notifications
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${title}</strong><br>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

// Helper to shorten wallet addresses
function shortenAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
} 