// Token Templates
const TOKEN_TEMPLATES = {
    dao: {
        type: 'governance',
        distribution: 'fair',
        utilities: ['utilityGovernance', 'utilityStaking'],
        features: ['featureVesting', 'featureMultisig'],
        network: 'polygon',
        economics: 'fixed'
    },
    community: {
        type: 'reward',
        distribution: 'mining',
        utilities: ['utilityRewards', 'utilityStaking'],
        features: ['featureBurning'],
        network: 'polygon',
        economics: 'dynamic'
    },
    membership: {
        type: 'utility',
        distribution: 'sale',
        utilities: ['utilityAccess', 'utilityRewards'],
        features: ['featureUpgradeable'],
        network: 'polygon',
        economics: 'fixed'
    },
    bsvRewards: {
        type: 'reward',
        distribution: 'mining',
        utilities: ['utilityRewards', 'utilityAccess'],
        features: ['featureMicropayments', 'featureDataStorage'],
        network: 'bsv',
        wallet: 'handcash'
    },
    bsvContent: {
        type: 'utility',
        distribution: 'fair',
        utilities: ['utilityAccess', 'utilityRewards', 'utilityContent'],
        features: ['featureMicropayments', 'featureMetadata'],
        network: 'bsv',
        wallet: 'handcash'
    }
};

// Toggle token configuration visibility
function toggleTokenOptions(value) {
    const configSection = document.getElementById('tokenConfig');
    if (value && value !== 'no') {
        configSection.classList.remove('d-none');
        // Animate the section entrance
        configSection.style.opacity = '0';
        configSection.style.transition = 'opacity 0.3s ease';
        setTimeout(() => configSection.style.opacity = '1', 10);
    } else {
        configSection.classList.add('d-none');
    }
    updateTokenPreview();
}

// Apply template settings
function applyTokenTemplate(templateName) {
    if (!templateName || templateName === 'custom') return;

    const template = TOKEN_TEMPLATES[templateName];
    if (!template) return;

    // Apply template settings
    document.getElementById('tokenType').value = template.type;
    document.getElementById('tokenDistribution').value = template.distribution;
    document.getElementById('tokenNetwork').value = template.network;
    document.getElementById('tokenEconomics').value = template.economics;

    // Reset all checkboxes first
    document.querySelectorAll('.token-powers input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.advanced-features input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Apply template utilities
    template.utilities.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = true;
    });

    // Apply template features
    template.features.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = true;
    });

    // Show a success message
    showStatus(`Applied ${templateName.charAt(0).toUpperCase() + templateName.slice(1)} template`, 'success');
    updateTokenPreview();
}

// Toggle advanced options
function toggleAdvancedTokenOptions() {
    const advancedSection = document.getElementById('advancedTokenOptions');
    const button = event.target;
    
    if (advancedSection.classList.contains('d-none')) {
        advancedSection.classList.remove('d-none');
        button.textContent = '- Hide Advanced Options';
        // Animate entrance
        advancedSection.style.maxHeight = '0';
        advancedSection.style.transition = 'max-height 0.3s ease';
        setTimeout(() => advancedSection.style.maxHeight = advancedSection.scrollHeight + 'px', 10);
    } else {
        advancedSection.style.maxHeight = '0';
        setTimeout(() => {
            advancedSection.classList.add('d-none');
            button.textContent = '+ Show Advanced Options';
        }, 300);
    }
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    // Add event listeners for live preview updates
    const tokenInputs = document.querySelectorAll('#tokenConfig select, #tokenConfig input');
    tokenInputs.forEach(input => {
        input.addEventListener('change', updateTokenPreview);
    });
});

// Add this function to handle token preview updates
function updateTokenPreview() {
    const tokenType = document.getElementById('tokenType')?.value;
    if (!tokenType || tokenType === 'no') {
        hideTokenPreview();
        return;
    }

    const tokenData = {
        type: tokenType,
        distribution: document.getElementById('tokenDistribution')?.value,
        economics: document.getElementById('tokenEconomics')?.value,
        network: document.getElementById('tokenNetwork')?.value,
        utilities: getTokenUtilities(),
        features: getAdvancedFeatures()
    };

    const previewPanel = document.getElementById('previewPanel');
    const tokenSection = document.createElement('div');
    tokenSection.className = 'token-preview mt-3';
    tokenSection.innerHTML = `
        <div class="token-details border rounded p-3">
            <div class="d-flex align-items-center mb-2">
                <i class="fas fa-coins me-2"></i>
                <h6 class="mb-0">Token System</h6>
            </div>
            
            <div class="token-info small">
                <div class="mb-2">
                    <span class="badge bg-primary">${tokenData.type} Token</span>
                    <span class="badge bg-secondary">${tokenData.network}</span>
                </div>
                
                <div class="mb-2">
                    <strong>Distribution:</strong> ${tokenData.distribution}
                </div>
                
                <div class="mb-2">
                    <strong>Economic Model:</strong> ${tokenData.economics}
                </div>
                
                ${tokenData.utilities.length ? `
                    <div class="mb-2">
                        <strong>Utilities:</strong>
                        <div class="ms-2">
                            ${tokenData.utilities.map(u => 
                                `<span class="badge bg-info me-1">${u}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${tokenData.features.length ? `
                    <div>
                        <strong>Features:</strong>
                        <div class="ms-2">
                            ${tokenData.features.map(f => 
                                `<span class="badge bg-success me-1">${f}</span>`
                            ).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Update the preview
    const existingToken = previewPanel.querySelector('.token-preview');
    if (existingToken) {
        existingToken.replaceWith(tokenSection);
    } else {
        previewPanel.appendChild(tokenSection);
    }

    const walletType = document.getElementById('tokenWallet')?.value;
    if (walletType) {
        tokenSection.querySelector('.token-info').innerHTML += `
            <div class="mt-2">
                <strong>Wallet:</strong> 
                <span class="badge bg-info">${walletType.toUpperCase()}</span>
            </div>
        `;
    }

    // Add BSV-specific features display
    if (tokenData.network === 'bsv') {
        tokenSection.querySelector('.token-info').innerHTML += `
            <div class="mt-3">
                <strong>BSV Features:</strong>
                <div class="ms-2">
                    <span class="badge bg-success">Micropayments</span>
                    <span class="badge bg-success">Data Storage</span>
                    <span class="badge bg-success">Metadata</span>
                </div>
            </div>
        `;
    }
}

// Add these helper functions if they're missing
function getTokenUtilities() {
    const utilities = [
        { id: 'utilityAccess', label: 'Access Control' },
        { id: 'utilityGovernance', label: 'Governance' },
        { id: 'utilityRewards', label: 'Rewards' },
        { id: 'utilityStaking', label: 'Staking' }
    ];
    return utilities
        .filter(util => document.getElementById(util.id)?.checked)
        .map(util => util.label);
}

function getAdvancedFeatures() {
    const features = [
        { id: 'featureVesting', label: 'Vesting' },
        { id: 'featureMultisig', label: 'MultiSig' },
        { id: 'featureUpgradeable', label: 'Upgradeable' }
    ];
    return features
        .filter(feat => document.getElementById(feat.id)?.checked)
        .map(feat => feat.label);
}

function hideTokenPreview() {
    const previewPanel = document.getElementById('previewPanel');
    const tokenSection = previewPanel.querySelector('.token-preview');
    if (tokenSection) {
        tokenSection.remove();
    }
}

// Add this function to handle network changes
function handleNetworkChange(network) {
    const bsvFeatures = document.getElementById('bsvFeatures');
    const micropaymentConfig = document.getElementById('micropaymentConfig');
    const walletSelect = document.getElementById('tokenWallet');
    
    if (network === 'bsv') {
        // Show BSV-specific features
        bsvFeatures.classList.remove('d-none');
        // Pre-select HandCash if no wallet is selected
        if (!walletSelect.value) {
            walletSelect.value = 'handcash';
            handleWalletSelection('handcash');
        }
    } else {
        // Hide BSV-specific features
        bsvFeatures.classList.add('d-none');
        micropaymentConfig.classList.add('d-none');
        // Clear BSV wallet selection if switching networks
        if (walletSelect.value === 'handcash' || walletSelect.value === 'yours') {
            walletSelect.value = '';
        }
    }
    
    updateTokenPreview();
}

// Update the existing handleWalletSelection function
async function handleWalletSelection(walletType) {
    const networkSelect = document.getElementById('tokenNetwork');
    
    try {
        if (walletType === 'handcash' || walletType === 'yours') {
            // Auto-select BSV network for BSV wallets
            networkSelect.value = 'bsv';
            handleNetworkChange('bsv');
            
            if (walletType === 'handcash') {
                await bsvWallet.connectHandCash();
            } else {
                // Handle Yours wallet connection
            }
        }
        
        updateTokenPreview();
    } catch (error) {
        showStatus(error.message, 'error');
    }
}

// Add BSV wallet connection handling
async function connectBSVWallet(walletType) {
    try {
        if (walletType === 'handcash') {
            showStatus('Connecting to HandCash...', 'info');
            // HandCash Connect SDK integration would go here
            const authToken = await requestHandCashAuth();
            showStatus('Connected to HandCash!', 'success');
        } else if (walletType === 'yours') {
            showStatus('Connecting to Yours Wallet...', 'info');
            // Yours Wallet integration would go here
            const walletResponse = await connectYoursWallet();
            showStatus('Connected to Yours Wallet!', 'success');
        }
    } catch (error) {
        showStatus('Failed to connect wallet: ' + error.message, 'error');
    }
}

// Add BSV-specific validation
function validateBSVConfig(tokenData) {
    const warnings = [];
    const errors = [];

    if (tokenData.network === 'bsv') {
        if (!tokenData.wallet) {
            errors.push('Please select a BSV wallet');
        }
        if (tokenData.features.includes('featureUpgradeable')) {
            warnings.push('Note: BSV tokens are immutable by design');
        }
    }

    return { warnings, errors };
} 