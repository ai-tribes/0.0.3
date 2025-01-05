// HandCash Connect Configuration
const handCashConnect = new HandCashConnect({
    appId: 'YOUR_HANDCASH_APP_ID',
    appSecret: 'YOUR_HANDCASH_APP_SECRET'
});

// BSV Wallet Integration
class BSVWalletManager {
    constructor() {
        this.handCashAccount = null;
        this.yoursWalletAccount = null;
    }

    async connectHandCash() {
        try {
            const authToken = await handCashConnect.getAuthToken();
            const account = await handCashConnect.profile.getCurrentProfile();
            
            this.handCashAccount = {
                handle: account.handle,
                publicKey: account.publicKey,
                balance: await this.getHandCashBalance()
            };

            // Update UI
            this.updateWalletUI('handcash');
            return this.handCashAccount;

        } catch (error) {
            console.error('HandCash connection error:', error);
            throw new Error('Failed to connect HandCash wallet');
        }
    }

    async getHandCashBalance() {
        try {
            const balance = await handCashConnect.wallet.getBalance();
            return {
                bsv: balance.bsv,
                usd: balance.usd
            };
        } catch (error) {
            console.error('Error getting HandCash balance:', error);
            return null;
        }
    }

    updateWalletUI(walletType) {
        const walletInfo = document.createElement('div');
        walletInfo.className = 'wallet-info mt-3';
        
        if (walletType === 'handcash' && this.handCashAccount) {
            walletInfo.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="mb-2">
                            <img src="assets/handcash-logo.png" alt="HandCash" height="20">
                            HandCash Connected
                        </h6>
                        <div class="small">
                            <div>Handle: ${this.handCashAccount.handle}</div>
                            <div>Balance: ${this.handCashAccount.balance?.bsv} BSV</div>
                            <div class="text-muted">≈ $${this.handCashAccount.balance?.usd}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        const existingInfo = document.querySelector('.wallet-info');
        if (existingInfo) {
            existingInfo.replaceWith(walletInfo);
        } else {
            document.getElementById('tokenConfig').appendChild(walletInfo);
        }
    }

    // BSV Token Creation
    async createBSVToken(tokenConfig) {
        try {
            // Validate configuration
            const validation = validateBSVConfig(tokenConfig);
            if (validation.errors.length > 0) {
                throw new Error(validation.errors.join('\n'));
            }

            // Show warnings if any
            validation.warnings.forEach(warning => {
                showStatus(warning, 'warning');
            });

            // Create token based on type
            switch (tokenConfig.type) {
                case 'reward':
                    return await this.createRewardToken(tokenConfig);
                case 'utility':
                    return await this.createUtilityToken(tokenConfig);
                default:
                    throw new Error('Unsupported token type for BSV');
            }
        } catch (error) {
            console.error('Token creation error:', error);
            throw error;
        }
    }

    async createRewardToken(config) {
        // Implementation for reward token creation
        // This would interact with your BSV token creation backend
    }

    async createUtilityToken(config) {
        // Implementation for utility token creation
        // This would interact with your BSV token creation backend
    }
}

// Initialize BSV Wallet Manager
const bsvWallet = new BSVWalletManager();

// Update the existing handleWalletSelection function
async function handleWalletSelection(walletType) {
    try {
        if (walletType === 'handcash') {
            showStatus('Connecting to HandCash...', 'info');
            await bsvWallet.connectHandCash();
            showStatus('Connected to HandCash!', 'success');
        }
        // Add other wallet handlers here
        
        updateTokenPreview();
    } catch (error) {
        showStatus(error.message, 'error');
    }
}

// Add BSV-specific token templates
const BSV_TOKEN_TEMPLATES = {
    contentCreator: {
        type: 'utility',
        distribution: 'mining',
        features: ['featureMicropayments', 'featureMetadata'],
        micropaymentConfig: {
            minAmount: 0.00001,
            autoPayment: true
        }
    },
    socialToken: {
        type: 'reward',
        distribution: 'fair',
        features: ['featureMicropayments', 'featureDataStorage'],
        micropaymentConfig: {
            minAmount: 0.00005,
            tipsEnabled: true
        }
    },
    gameToken: {
        type: 'utility',
        distribution: 'mining',
        features: ['featureMicropayments', 'featureMetadata', 'featureDataStorage'],
        micropaymentConfig: {
            minAmount: 0.00001,
            autoPayment: true,
            gameRewards: true
        }
    },
    daoToken: {
        type: 'governance',
        distribution: 'fair',
        features: ['featureDataStorage', 'featureMetadata'],
        votingConfig: {
            weightedVoting: true,
            delegationEnabled: true
        }
    }
};

// Add micropayment configuration UI
function addMicropaymentConfig() {
    const configSection = document.createElement('div');
    configSection.className = 'micropayment-config mt-3';
    configSection.innerHTML = `
        <h6>Micropayment Settings</h6>
        <div class="mb-3">
            <label class="form-label">Minimum Payment (BSV)</label>
            <input type="number" class="form-control" id="minPayment" 
                   step="0.00001" min="0.00001" value="0.00001">
            <div class="form-text">Minimum amount for micropayments</div>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="autoPayment">
            <label class="form-check-label" for="autoPayment">
                Enable Auto-Payments
            </label>
        </div>
        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="tipsEnabled">
            <label class="form-check-label" for="tipsEnabled">
                Enable Tipping
            </label>
        </div>
    `;
    return configSection;
}

// Add BSV-specific token creation options
class BSVTokenCreator {
    constructor() {
        this.tokenConfig = {};
    }

    async createToken(config) {
        try {
            // Set up Run instance (BSV token creation library)
            const run = new Run({
                network: 'main',
                purse: this.handCashAccount.publicKey,
                owner: this.handCashAccount.publicKey,
            });

            // Create token class
            const TokenClass = await run.deploy(`
                class Token extends Jig {
                    init(supply, owner, metadata) {
                        this.supply = supply
                        this.owner = owner
                        this.metadata = metadata
                    }

                    send(to, amount) {
                        if (this.owner !== caller) throw new Error('Not authorized')
                        if (amount > this.supply) throw new Error('Insufficient balance')
                        
                        const newToken = new Token(amount, to, this.metadata)
                        this.supply -= amount
                        return newToken
                    }
                }
            `);

            // Create initial token supply
            const token = new TokenClass(
                config.initialSupply,
                this.handCashAccount.publicKey,
                {
                    name: config.name,
                    symbol: config.symbol,
                    features: config.features,
                    micropaymentConfig: config.micropaymentConfig
                }
            );

            await run.sync();
            return token;

        } catch (error) {
            console.error('Token creation error:', error);
            throw new Error('Failed to create BSV token');
        }
    }
}

// Add HandCash payment handling
class HandCashPaymentManager {
    constructor(handCashConnect) {
        this.handCashConnect = handCashConnect;
    }

    async sendPayment(to, amount, currency = 'BSV') {
        try {
            const payment = await this.handCashConnect.wallet.pay({
                payments: [{
                    destination: to,
                    amount: amount,
                    currencyCode: currency
                }],
                description: 'Token Transaction'
            });
            return payment;
        } catch (error) {
            console.error('Payment error:', error);
            throw new Error('Failed to send payment');
        }
    }

    async setupAutoPay(config) {
        // Implementation for automatic micropayments
        // This would integrate with your backend service
    }
}

// Initialize managers
const bsvTokenCreator = new BSVTokenCreator();
const handCashPayments = new HandCashPaymentManager(handCashConnect); 