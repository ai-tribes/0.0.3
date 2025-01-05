// Wallet connection state
let connectedWallet = null;

// Show the wallet connection modal
function showWalletModal() {
    const walletModal = new bootstrap.Modal(document.getElementById('walletModal'));
    walletModal.show();
}

// Filter wallets by search term
function filterWallets(searchTerm) {
    const wallets = document.querySelectorAll('.wallet-item');
    wallets.forEach(wallet => {
        const name = wallet.querySelector('.wallet-name').textContent.toLowerCase();
        wallet.style.display = name.includes(searchTerm.toLowerCase()) ? 'flex' : 'none';
    });
}

// Filter wallets by network
function filterByNetwork(network) {
    const wallets = document.querySelectorAll('.wallet-item');
    const categories = document.querySelectorAll('.wallet-category');
    
    categories.forEach(cat => cat.classList.remove('active'));
    event.target.classList.add('active');
    
    wallets.forEach(wallet => {
        if (network === 'all' || wallet.dataset.network === network) {
            wallet.style.display = 'flex';
        } else {
            wallet.style.display = 'none';
        }
    });
}

// Connect wallet
async function connectWallet(walletName) {
    try {
        let wallet;
        switch(walletName) {
            case 'phantom':
                wallet = await connectPhantom();
                break;
            case 'metamask':
                wallet = await connectMetamask();
                break;
            // Add other wallet connections
        }

        if (wallet) {
            connectedWallet = wallet;
            updateWalletUI(wallet);
            bootstrap.Modal.getInstance(document.getElementById('walletModal')).hide();
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        showError('Failed to connect wallet. Please try again.');
    }
}

// Connect Phantom wallet
async function connectPhantom() {
    if (!window.solana || !window.solana.isPhantom) {
        window.open('https://phantom.app/', '_blank');
        return null;
    }

    try {
        const resp = await window.solana.connect();
        return {
            name: 'Phantom',
            address: resp.publicKey.toString(),
            network: 'sol'
        };
    } catch (err) {
        console.error('Phantom connection error:', err);
        return null;
    }
}

// Update UI after wallet connection
function updateWalletUI(wallet) {
    const connectButtons = document.querySelectorAll('[onclick="showWalletModal()"]');
    connectButtons.forEach(button => {
        button.innerHTML = `
            <i class="fas fa-wallet me-2"></i>
            ${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}
        `;
        button.classList.add('wallet-connected');
    });

    // Show success message
    showToast('Wallet Connected', 'Successfully connected to ' + wallet.name, 'success');
}

// Show error message
function showError(message) {
    showToast('Error', message, 'error');
}

// Show toast notification
function showToast(title, message, type = 'info') {
    // Implementation depends on your toast library
    console.log(`${type}: ${title} - ${message}`);
} 