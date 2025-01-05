document.addEventListener('DOMContentLoaded', function() {
    // Load the wallet modal component
    fetch('/components/wallet-modal.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('walletModalContainer').innerHTML = html;
            walletModal = new bootstrap.Modal(document.getElementById('walletModal'));
            
            // Add event listeners for network filtering
            document.querySelectorAll('.btn-network-filter').forEach(btn => {
                btn.addEventListener('click', function() {
                    const network = this.dataset.network;
                    filterWallets(network);
                });
            });
            
            // Add search functionality
            const searchInput = document.querySelector('.wallet-search input');
            if (searchInput) {
                searchInput.addEventListener('input', function(e) {
                    searchWallets(e.target.value);
                });
            }
        });
});

function openWalletModal() {
    if (walletModal) {
        walletModal.show();
    }
}

// Add search and filter functions
function searchWallets(query) {
    const wallets = document.querySelectorAll('.wallet-option');
    query = query.toLowerCase();
    
    wallets.forEach(wallet => {
        const name = wallet.querySelector('h6').textContent.toLowerCase();
        const desc = wallet.querySelector('p').textContent.toLowerCase();
        if (name.includes(query) || desc.includes(query)) {
            wallet.style.display = 'block';
        } else {
            wallet.style.display = 'none';
        }
    });
}

function filterWallets(network) {
    const wallets = document.querySelectorAll('.wallet-option');
    if (network === 'all') {
        wallets.forEach(wallet => wallet.style.display = 'block');
        return;
    }
    
    wallets.forEach(wallet => {
        const badge = wallet.querySelector('.badge:last-child');
        const walletNetwork = badge.textContent;
        if (walletNetwork.includes(network)) {
            wallet.style.display = 'block';
        } else {
            wallet.style.display = 'none';
        }
    });
}

async function connectPhantom() {
    try {
        if (!window.solana || !window.solana.isPhantom) {
            window.open('https://phantom.app/', '_blank');
            return;
        }
        
        const resp = await window.solana.connect();
        const address = resp.publicKey.toString();
        updateWalletUI(address);
        walletModal.hide();
    } catch (err) {
        console.error('Phantom connection error:', err);
    }
}

async function connectMetaMask() {
    try {
        if (!window.ethereum || !window.ethereum.isMetaMask) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        updateWalletUI(accounts[0]);
        walletModal.hide();
    } catch (err) {
        console.error('MetaMask connection error:', err);
    }
}

async function connectBinanceWallet() {
    try {
        if (!window.BinanceChain) {
            window.open('https://www.bnbchain.org/en/wallet', '_blank');
            return;
        }

        const accounts = await window.BinanceChain.request({ 
            method: 'eth_requestAccounts' 
        });
        updateWalletUI(accounts[0]);
        walletModal.hide();
    } catch (err) {
        console.error('Binance Wallet connection error:', err);
    }
}

async function connectXverse() {
    try {
        if (!window.BitcoinProvider) {
            window.open('https://www.xverse.app/', '_blank');
            return;
        }

        const accounts = await window.BitcoinProvider.connect();
        updateWalletUI(accounts[0]);
        walletModal.hide();
    } catch (err) {
        console.error('Xverse connection error:', err);
    }
}

async function connectTrustWallet() {
    try {
        if (!window.trustwallet) {
            window.open('https://trustwallet.com/download', '_blank');
            return;
        }

        const accounts = await window.trustwallet.request({ 
            method: 'eth_requestAccounts' 
        });
        updateWalletUI(accounts[0]);
        walletModal.hide();
    } catch (err) {
        console.error('Trust Wallet connection error:', err);
    }
}

async function connectHandCash() {
    try {
        if (!window.handCash) {
            window.open('https://handcash.io/#download', '_blank');
            return;
        }

        const authToken = await window.handCash.connect();
        const account = await window.handCash.getProfile();
        updateWalletUI(account.handle);
        walletModal.hide();
    } catch (err) {
        console.error('HandCash connection error:', err);
    }
}

function updateWalletUI(account) {
    document.querySelectorAll('.wallet-connect-btn').forEach(btn => {
        // Format account string based on length
        const displayAccount = account.length > 20 
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : account;

        btn.innerHTML = `
            <i class="fas fa-wallet me-2"></i>
            ${displayAccount}
        `;
        btn.classList.remove('btn-primary', 'btn-outline-primary');
        btn.classList.add('btn-success');
    });
}

// Add other wallet connection functions here 