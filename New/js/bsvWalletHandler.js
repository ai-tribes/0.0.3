// BSV Wallet Configuration
const BSV_CONFIG = {
    handcash: {
        appId: '5f5faa8f32d7f3d2c1e0b0a0',
        appSecret: 'YOUR_HANDCASH_APP_SECRET'
    }
};

// BSV Wallet Handler
class BSVWalletHandler {
    constructor() {
        this.handCashConnect = null;
        this.connectedWallet = null;
        this.walletModal = null;
        this.init();
    }

    init() {
        // Initialize HandCash Connect
        this.handCashConnect = new HandCashConnect({
            appId: BSV_CONFIG.handcash.appId
        });
        
        // Initialize Bootstrap modal
        this.walletModal = new bootstrap.Modal(document.getElementById('walletModal'));
    }

    async connectHandCash() {
        try {
            const authToken = await this.handCashConnect.getAuthToken();
            const profile = await this.handCashConnect.profile.getCurrentProfile();
            
            this.connectedWallet = {
                type: 'handcash',
                handle: profile.handle,
                publicKey: profile.publicKey
            };

            // Get balance
            const balance = await this.handCashConnect.wallet.getBalance();
            this.connectedWallet.balance = balance;

            this.updateWalletUI();
            return this.connectedWallet;

        } catch (error) {
            console.error('HandCash connection error:', error);
            throw new Error('Failed to connect HandCash wallet');
        }
    }

    async connectYoursWallet() {
        // Implement Yours Wallet connection
        throw new Error('Yours Wallet integration coming soon');
    }

    async sendBSV(to, amount, note = '') {
        try {
            if (!this.connectedWallet) {
                throw new Error('No wallet connected');
            }

            const payment = await this.handCashConnect.wallet.pay({
                payments: [{
                    destination: to,
                    amount: amount,
                    currencyCode: 'BSV'
                }],
                description: note
            });

            this.showStatus(`Sent ${amount} BSV to ${to}`, 'success');
            return payment;
        } catch (error) {
            console.error('Payment error:', error);
            throw new Error('Failed to send BSV');
        }
    }

    async getTransactionHistory() {
        try {
            if (!this.connectedWallet) {
                throw new Error('No wallet connected');
            }

            const transactions = await this.handCashConnect.wallet.getTransactionHistory();
            return transactions;
        } catch (error) {
            console.error('Transaction history error:', error);
            throw new Error('Failed to get transaction history');
        }
    }

    updateWalletUI() {
        // Update navigation button
        const connectButton = document.getElementById('connectWalletButton');
        
        if (this.connectedWallet) {
            if (this.connectedWallet.type === 'handcash') {
                connectButton.innerHTML = `
                    <img src="assets/handcash-logo.png" height="16" class="me-1">
                    ${this.connectedWallet.handle}
                    <span class="badge bg-success ms-1">${this.connectedWallet.balance?.bsv} BSV</span>
                `;
                connectButton.classList.add('connected');
            }
            
            // Enhanced preview panel
            const previewPanel = document.getElementById('previewPanel');
            const walletInfo = document.createElement('div');
            walletInfo.className = 'wallet-info card mb-3';
            walletInfo.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">BSV Wallet Connected</h6>
                        <span class="badge bsv-badge">${this.connectedWallet.type}</span>
                    </div>
                    <div class="small">
                        <div class="mb-1">
                            <i class="fas fa-user me-1"></i> ${this.connectedWallet.handle}
                        </div>
                        <div class="mb-1">
                            <i class="fas fa-coins me-1"></i> ${this.connectedWallet.balance?.bsv} BSV
                        </div>
                        <div class="text-muted">
                            <i class="fas fa-dollar-sign me-1"></i> $${this.connectedWallet.balance?.usd}
                        </div>
                    </div>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="showTransactionHistory()">
                            <i class="fas fa-history"></i> History
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="showSendBSV()">
                            <i class="fas fa-paper-plane"></i> Send
                        </button>
                    </div>
                </div>
            `;

            const existingInfo = previewPanel.querySelector('.wallet-info');
            if (existingInfo) {
                existingInfo.replaceWith(walletInfo);
            } else {
                previewPanel.insertBefore(walletInfo, previewPanel.firstChild);
            }
        }
    }

    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('walletStatus');
        statusDiv.className = `alert alert-${type}`;
        statusDiv.textContent = message;
        statusDiv.classList.remove('d-none');
    }
}

// Initialize BSV Wallet Handler
const bsvWallet = new BSVWalletHandler();

// Wallet Selection Handler
async function handleBSVWalletSelection(walletType) {
    try {
        if (!walletType) return;

        bsvWallet.showStatus('Connecting to wallet...', 'info');

        switch (walletType) {
            case 'handcash':
                await bsvWallet.connectHandCash();
                bsvWallet.showStatus('Connected to HandCash!', 'success');
                setTimeout(() => bsvWallet.walletModal.hide(), 1500);
                break;
            case 'yours':
                await bsvWallet.connectYoursWallet();
                break;
            default:
                throw new Error('Unsupported wallet type');
        }
    } catch (error) {
        bsvWallet.showStatus(error.message, 'danger');
    }
}

// Show wallet modal
function showWalletModal() {
    bsvWallet.walletModal.show();
}

// Add transaction history modal
function showTransactionHistory() {
    bsvWallet.getTransactionHistory().then(transactions => {
        const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
        const transactionList = document.getElementById('transactionList');
        
        transactionList.innerHTML = transactions.map(tx => `
            <div class="transaction-item border-bottom p-2">
                <div class="d-flex justify-content-between">
                    <span>${tx.type === 'send' ? 'Sent' : 'Received'}</span>
                    <span class="${tx.type === 'send' ? 'text-danger' : 'text-success'}">
                        ${tx.type === 'send' ? '-' : '+'} ${tx.amount} BSV
                    </span>
                </div>
                <div class="small text-muted">${new Date(tx.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
        
        modal.show();
    }).catch(error => {
        bsvWallet.showStatus(error.message, 'danger');
    });
}

// Add send BSV modal
function showSendBSV() {
    const modal = new bootstrap.Modal(document.getElementById('sendBSVModal'));
    modal.show();
} 