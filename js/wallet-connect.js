class WalletConnector {
    constructor() {
        this.modal = null;
        this.walletData = {
            phantom: {
                name: 'Phantom',
                downloadUrl: 'https://phantom.app/',
                checkInstalled: () => window.solana && window.solana.isPhantom
            },
            metamask: {
                name: 'MetaMask',
                downloadUrl: 'https://metamask.io/',
                checkInstalled: () => window.ethereum && window.ethereum.isMetaMask
            },
            handcash: {
                name: 'HandCash',
                downloadUrl: 'https://handcash.io/',
                checkInstalled: () => window.handcash
            },
            trust: {
                name: 'Trust Wallet',
                downloadUrl: 'https://trustwallet.com/',
                checkInstalled: () => window.trustwallet
            },
            binance: {
                name: 'Binance Wallet',
                downloadUrl: 'https://www.bnbchain.org/en/wallet',
                checkInstalled: () => window.BinanceChain
            },
            coinbase: {
                name: 'Coinbase Wallet',
                downloadUrl: 'https://www.coinbase.com/wallet',
                checkInstalled: () => window.coinbaseWallet
            },
            xverse: {
                name: 'Xverse',
                downloadUrl: 'https://www.xverse.app/',
                checkInstalled: () => window.xverse
            }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Chain filter functionality
        document.querySelectorAll('.chain-filters button').forEach(button => {
            button.addEventListener('click', (e) => {
                const chain = e.target.textContent;
                this.filterByChain(chain);
            });
        });

        // Search functionality
        const searchInput = document.querySelector('.modal-body input[type="text"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterBySearch(e.target.value);
            });
        }
    }

    async connectWallet(type) {
        const wallet = this.walletData[type];
        if (!wallet) return;

        try {
            if (!wallet.checkInstalled()) {
                window.open(wallet.downloadUrl, '_blank');
                return;
            }

            switch (type) {
                case 'phantom':
                    const resp = await window.solana.connect();
                    console.log('Connected to Phantom:', resp.publicKey.toString());
                    this.onSuccess('Phantom');
                    break;

                case 'metamask':
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to MetaMask:', accounts[0]);
                    this.onSuccess('MetaMask');
                    break;

                case 'handcash':
                    const handcashAuth = await window.handcash.connect();
                    console.log('Connected to HandCash:', handcashAuth);
                    this.onSuccess('HandCash');
                    break;

                case 'trust':
                    const trustAuth = await window.trustwallet.connect();
                    console.log('Connected to Trust Wallet:', trustAuth);
                    this.onSuccess('Trust Wallet');
                    break;

                case 'binance':
                    const bnbAccounts = await window.BinanceChain.request({ method: 'eth_requestAccounts' });
                    console.log('Connected to Binance Wallet:', bnbAccounts[0]);
                    this.onSuccess('Binance Wallet');
                    break;

                case 'coinbase':
                    const cbAccounts = await window.coinbaseWallet.connect();
                    console.log('Connected to Coinbase Wallet:', cbAccounts[0]);
                    this.onSuccess('Coinbase Wallet');
                    break;

                case 'xverse':
                    const xverseAuth = await window.xverse.connect();
                    console.log('Connected to Xverse:', xverseAuth);
                    this.onSuccess('Xverse');
                    break;
            }
        } catch (error) {
            console.error(`Error connecting to ${wallet.name}:`, error);
            this.onError(wallet.name, error);
        }
    }

    filterByChain(chain) {
        const walletOptions = document.querySelectorAll('.wallet-option');
        walletOptions.forEach(option => {
            if (chain === 'All' || option.dataset.chain === chain) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    filterBySearch(query) {
        const walletOptions = document.querySelectorAll('.wallet-option');
        walletOptions.forEach(option => {
            const walletName = option.querySelector('h6').textContent.toLowerCase();
            if (walletName.includes(query.toLowerCase())) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    }

    onSuccess(walletName) {
        // Update UI to show connected state
        const connectButton = document.querySelector('[data-action="connect-wallet"]');
        if (connectButton) {
            connectButton.innerHTML = `<i class="fas fa-check-circle me-2"></i>Connected to ${walletName}`;
            connectButton.classList.remove('btn-primary');
            connectButton.classList.add('btn-success');
        }
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('walletModal'));
        if (modal) modal.hide();

        // Dispatch event for other parts of the app
        window.dispatchEvent(new CustomEvent('walletConnected', {
            detail: { wallet: walletName }
        }));
    }

    onError(walletName, error) {
        // Show error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3';
        errorDiv.textContent = `Error connecting to ${walletName}: ${error.message}`;
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.appendChild(errorDiv);

        // Remove error after 3 seconds
        setTimeout(() => errorDiv.remove(), 3000);
    }
}

// Initialize wallet connector
const walletConnector = new WalletConnector();

// Export for use in other files
window.walletConnector = walletConnector; 