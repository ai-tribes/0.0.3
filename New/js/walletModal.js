// Initialize modal when document loads
let walletModal;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Bootstrap modal
    walletModal = new bootstrap.Modal(document.getElementById('connectWalletModal'));
    
    // Add click handler for connect wallet button
    document.querySelector('[data-action="connect-wallet"]').addEventListener('click', () => {
        console.log('Opening wallet modal');
        walletModal.show();
    });

    // Add click handlers for wallets in the modal
    const phantomWalletItem = document.querySelector('.wallet-item.featured');
    console.log('Phantom wallet element:', phantomWalletItem);
    if (phantomWalletItem) {
        phantomWalletItem.addEventListener('click', async () => {
            console.log('Phantom wallet clicked');
            await connectPhantomWallet();
            walletModal.hide();
        });
    }

    // Add click handler for MetaMask
    const metamaskWalletItem = document.querySelector('.wallet-item:has(img[alt="MetaMask"])');
    console.log('MetaMask wallet element:', metamaskWalletItem);
    if (metamaskWalletItem) {
        metamaskWalletItem.addEventListener('click', async () => {
            console.log('MetaMask wallet clicked');
            await connectMetaMask();
            walletModal.hide();
        });
    }

    // Add click handler for Coinbase Wallet
    const coinbaseWalletItem = document.querySelector('.wallet-item:has(img[alt="Coinbase Wallet"])');
    console.log('Coinbase wallet element:', coinbaseWalletItem);
    if (coinbaseWalletItem) {
        coinbaseWalletItem.addEventListener('click', async () => {
            console.log('Coinbase wallet clicked');
            await connectCoinbaseWallet();
            walletModal.hide();
        });
    }
});

// MetaMask Connection
async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            updateConnectButton(accounts[0], 'ETH');
            setupMetaMaskListeners();
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            if (error.code === 4001) {
                alert("Please accept the connection request to continue");
            }
        }
    } else {
        window.open('https://metamask.io/download/', '_blank');
    }
}

// Setup MetaMask Event Listeners
function setupMetaMaskListeners() {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                updateConnectButton(accounts[0], 'ETH');
            } else {
                updateConnectButton(null);
            }
        });

        window.ethereum.on('chainChanged', (_chainId) => {
            // Handle chain change if needed
            window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
            updateConnectButton(null);
        });
    }
}

// Phantom Connection (existing code)
const getPhantomProvider = () => {
    if ('phantom' in window) {
        const provider = window.phantom?.solana;

        if (provider?.isPhantom) {
            return provider;
        }
    }

    window.open('https://phantom.app/', '_blank');
    return null;
};

async function connectPhantomWallet() {
    try {
        const provider = getPhantomProvider();
        if (!provider) return;
        
        const resp = await provider.connect();
        updateConnectButton(resp.publicKey.toString(), 'SOL');
        setupPhantomListeners(provider);
    } catch (err) {
        console.error("Error connecting to Phantom:", err);
        if (err.code === 4001) {
            alert("Please accept the connection request to continue");
        }
    }
}

// Updated button text function to handle different chains
function updateConnectButton(address, chain = '') {
    const button = document.querySelector('[data-action="connect-wallet"]');
    if (address) {
        const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
        const chainBadge = chain ? `<span class="chain-badge ${chain.toLowerCase()}">${chain}</span>` : '';
        button.innerHTML = `<i class="fas fa-wallet me-2"></i>${shortAddress} ${chainBadge}`;
    } else {
        button.innerHTML = `<i class="fas fa-wallet me-2"></i>Connect Wallet`;
    }
}

// Phantom event listeners
function setupPhantomListeners(provider) {
    provider.on('connect', (publicKey) => {
        console.log('Connected to Phantom:', publicKey.toString());
        updateConnectButton(publicKey.toString(), 'SOL');
    });

    provider.on('disconnect', () => {
        console.log('Disconnected from Phantom');
        updateConnectButton(null);
    });

    provider.on('accountChanged', (publicKey) => {
        if (publicKey) {
            console.log('Switched Phantom account:', publicKey.toString());
            updateConnectButton(publicKey.toString(), 'SOL');
        } else {
            provider.connect().catch(console.error);
        }
    });
}

// Coinbase Wallet Connection
async function connectCoinbaseWallet() {
    // Check if Coinbase Wallet extension is installed
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet) {
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            updateConnectButton(accounts[0], 'CB');
            setupCoinbaseListeners();
        } catch (error) {
            console.error("Error connecting to Coinbase Wallet:", error);
            if (error.code === 4001) {
                alert("Please accept the connection request to continue");
            }
        }
    } else {
        // Redirect to Coinbase Wallet download if not installed
        window.open('https://www.coinbase.com/wallet/downloads', '_blank');
    }
}

// Setup Coinbase Wallet Event Listeners
function setupCoinbaseListeners() {
    if (window.ethereum && window.ethereum.isCoinbaseWallet) {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
                updateConnectButton(accounts[0], 'CB');
            } else {
                updateConnectButton(null);
            }
        });

        window.ethereum.on('chainChanged', (_chainId) => {
            // Handle chain change if needed
            window.location.reload();
        });

        window.ethereum.on('disconnect', () => {
            updateConnectButton(null);
        });
    }
}

// Handle disconnection for both wallets
async function disconnectWallet() {
    if (window.ethereum) {
        if (window.ethereum.isCoinbaseWallet) {
            try {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{ eth_accounts: {} }]
                });
                updateConnectButton(null);
            } catch (err) {
                console.error("Error disconnecting from Coinbase Wallet:", err);
            }
        } else if (window.ethereum.isMetaMask) {
            try {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{ eth_accounts: {} }]
                });
                updateConnectButton(null);
            } catch (err) {
                console.error("Error disconnecting from MetaMask:", err);
            }
        }
    }

    const phantomProvider = getPhantomProvider();
    if (phantomProvider) {
        try {
            await phantomProvider.disconnect();
            updateConnectButton(null);
        } catch (err) {
            console.error("Error disconnecting from Phantom:", err);
        }
    }
}

function openWalletModal(button) {
    const planType = button.getAttribute('data-plan-type');
    const planPrice = button.getAttribute('data-plan-price');
    
    // Store selected plan info
    localStorage.setItem('selectedPlan', JSON.stringify({
        type: planType,
        price: planPrice
    }));
    
    // Open the wallet modal
    const walletModal = new bootstrap.Modal(document.getElementById('connectWalletModal'));
    walletModal.show();
}

// Add event listener for wallet selection
document.querySelectorAll('.wallet-item').forEach(wallet => {
    wallet.addEventListener('click', function() {
        const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
        const walletName = this.querySelector('.wallet-name').textContent;
        
        // Here you would typically initiate the actual payment process
        console.log(`Initiating payment for ${selectedPlan.type} plan ($${selectedPlan.price}) using ${walletName}`);
        
        // Close the modal
        const walletModal = bootstrap.Modal.getInstance(document.getElementById('connectWalletModal'));
        walletModal.hide();
        
        // Show success message or redirect to payment processing
        showPaymentProcessing(walletName, selectedPlan);
    });
});

function showPaymentProcessing(wallet, plan) {
    // Add a toast or notification to show payment is being processed
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '11';
    
    // Format the price with commas for better readability
    const formattedPrice = Number(plan.price).toLocaleString();
    
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header">
                <i class="fas fa-coins me-2 text-warning"></i>
                <strong class="me-auto">Processing Payment</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                Connecting to ${wallet} for ${plan.type.toUpperCase()} plan ($${formattedPrice})...
            </div>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
    
    // Here you would typically handle the actual payment processing
    // For example, redirecting to a payment gateway or initiating a web3 transaction
    console.log(`Processing ${plan.type} plan payment of $${plan.price} with ${wallet}`);
} 