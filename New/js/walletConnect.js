function connectWallet(type) {
    const statusEl = document.getElementById('walletStatus');
    statusEl.classList.remove('d-none', 'alert-success', 'alert-danger');
    
    try {
        // Simulate wallet connection
        setTimeout(() => {
            statusEl.classList.add('alert-success');
            statusEl.textContent = `Successfully connected to ${type} wallet!`;
            
            // Update connect button state
            const connectBtn = document.querySelector('.connect-wallet-btn');
            connectBtn.classList.add('connected');
            connectBtn.textContent = 'Wallet Connected';
            
            // Close modal after delay
            setTimeout(() => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('connectWalletModal'));
                modal.hide();
            }, 1500);
        }, 1000);
    } catch (error) {
        statusEl.classList.add('alert-danger');
        statusEl.textContent = 'Failed to connect wallet. Please try again.';
    }
}

// Update the Connect Wallet button to open modal
document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.querySelector('.connect-wallet-btn');
    if (connectBtn) {
        connectBtn.setAttribute('data-bs-toggle', 'modal');
        connectBtn.setAttribute('data-bs-target', '#connectWalletModal');
    }
}); 