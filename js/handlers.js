// Tribe naming handler
function handleNameTribeSubmit(event) {
    event.preventDefault();
    
    // Get essential details
    const tribeName = document.getElementById('tribeName').value;
    const description = document.getElementById('tribeDescription').value;
    
    // Get optional details
    const category = document.getElementById('tribeCategory')?.value;
    const longDesc = document.getElementById('tribeLongDescription')?.value;
    const tags = document.getElementById('tribeTags')?.value;
    const membershipType = document.getElementById('membershipType')?.value;
    const governanceModel = document.getElementById('governanceModel')?.value;
    const privacyLevel = document.getElementById('privacyLevel')?.value;

    // Get enabled features
    const enabledFeatures = [
        { id: 'enableTokens', label: 'Tokens' },
        { id: 'enableNFTs', label: 'NFTs' },
        { id: 'enableTreasury', label: 'Treasury' },
        { id: 'enableVoting', label: 'Voting' },
        { id: 'enableAI', label: 'AI' }
    ].filter(feature => document.getElementById(feature.id)?.checked)
     .map(feature => feature.label);

    // Update the preview panel
    const previewPanel = document.getElementById('previewPanel');
    previewPanel.innerHTML = `
        <div class="tribe-preview">
            <div class="tribe-header d-flex align-items-center mb-3">
                <img src="${data.logo}" class="tribe-logo me-2" alt="Tribe Logo">
                <div>
                    <h6 class="mb-1">${data.name}</h6>
                    <span class="badge bg-${data.privacyLevel === 'private' ? 'danger' : 'success'}">
                        ${data.privacyLevel}
                    </span>
                </div>
            </div>
            
            <div class="tribe-details">
                <p class="small mb-2">${data.description}</p>
                <div class="features-grid">
                    <div class="feature">
                        <i class="fas fa-users"></i>
                        <span>${data.membershipType}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-robot"></i>
                        <span>${data.aiIntegration}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-coins"></i>
                        <span>${data.revenueModel}</span>
                    </div>
                </div>
            </div>

            <div class="tribe-stats mt-3">
                <div class="stat">
                    <label>Culture</label>
                    <span>${data.culture}</span>
                </div>
                <div class="stat">
                    <label>Governance</label>
                    <span>${data.governanceModel}</span>
                </div>
            </div>
        </div>
    `;

    // Store the complete tribe data
    window.tribeData = {
        name: tribeName,
        description: description,
        category: category,
        longDescription: longDesc,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        settings: {
            membershipType,
            governanceModel,
            privacyLevel
        },
        features: enabledFeatures,
        createdAt: new Date().toISOString()
    };

    // Show success message
    showStatus('Tribe details saved!', 'success');
}

function toggleMoreDetails() {
    const moreDetails = document.getElementById('moreDetails');
    const button = event.target;
    
    if (moreDetails.classList.contains('d-none')) {
        moreDetails.classList.remove('d-none');
        button.textContent = '- Less details';
    } else {
        moreDetails.classList.add('d-none');
        button.textContent = '+ Add more details (optional)';
    }
}

function showStatus(message, type = 'info') {
    const statusDiv = document.getElementById('nameStatus');
    if (!statusDiv) return;
    
    statusDiv.textContent = message;
    statusDiv.className = `alert alert-${type} mt-3`;
    statusDiv.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

// Add real-time preview as users type their prompt
function updateLogoPromptPreview() {
    const prompt = document.getElementById('logoPrompt').value;
    const style = document.getElementById('stylePreset').value;
    const previewText = document.getElementById('promptPreview');
    
    // Show how the AI will interpret their prompt
    const enhancedPrompt = `${STYLE_PRESETS[style]} ${prompt}`;
    previewText.textContent = `AI will generate: "${enhancedPrompt}"`;
}

// Add style preview thumbnails
function showStylePreview(style) {
    const previewImg = document.createElement('img');
    previewImg.src = `assets/style-previews/${style}.png`;
    previewImg.className = 'style-preview-thumbnail';
    return previewImg;
}

function updatePreviewPanel(data) {
    const previewPanel = document.getElementById('previewPanel');
    previewPanel.innerHTML = `
        <div class="tribe-preview">
            <div class="tribe-header d-flex align-items-center mb-3">
                <img src="${data.logo}" class="tribe-logo me-2" alt="Tribe Logo">
                <div>
                    <h6 class="mb-1">${data.name}</h6>
                    <span class="badge bg-${data.privacyLevel === 'private' ? 'danger' : 'success'}">
                        ${data.privacyLevel}
                    </span>
                </div>
            </div>
            
            <div class="tribe-details">
                <p class="small mb-2">${data.description}</p>
                <div class="features-grid">
                    <div class="feature">
                        <i class="fas fa-users"></i>
                        <span>${data.membershipType}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-robot"></i>
                        <span>${data.aiIntegration}</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-coins"></i>
                        <span>${data.revenueModel}</span>
                    </div>
                </div>
            </div>

            <div class="tribe-stats mt-3">
                <div class="stat">
                    <label>Culture</label>
                    <span>${data.culture}</span>
                </div>
                <div class="stat">
                    <label>Governance</label>
                    <span>${data.governanceModel}</span>
                </div>
            </div>
        </div>
    `;
}

// Token-specific helper functions
function getTokenUtilities() {
    const utilities = [
        { id: 'utilityAccess', label: 'Access Control' },
        { id: 'utilityGovernance', label: 'Governance' },
        { id: 'utilityRewards', label: 'Rewards' },
        { id: 'utilityStaking', label: 'Staking' },
        { id: 'utilityReputation', label: 'Reputation' }
    ];
    
    return utilities
        .filter(util => document.getElementById(util.id)?.checked)
        .map(util => util.label);
}

function getAdvancedFeatures() {
    const features = [
        { id: 'featureVesting', label: 'Vesting' },
        { id: 'featureLocking', label: 'Time-Lock' },
        { id: 'featureBurning', label: 'Burning' },
        { id: 'featureMultisig', label: 'MultiSig' },
        { id: 'featureUpgradeable', label: 'Upgradeable' }
    ];
    
    return features
        .filter(feat => document.getElementById(feat.id)?.checked)
        .map(feat => feat.label);
}

// Update preview when token options change
function updateTokenPreview() {
    const tokenType = document.getElementById('tokenType').value;
    if (!tokenType) {
        hideTokenPreview();
        return;
    }

    const tokenData = {
        type: tokenType,
        distribution: document.getElementById('tokenDistribution').value,
        economics: document.getElementById('tokenEconomics').value,
        network: document.getElementById('tokenNetwork').value,
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
}

function hideTokenPreview() {
    const previewPanel = document.getElementById('previewPanel');
    const tokenSection = previewPanel.querySelector('.token-preview');
    if (tokenSection) {
        tokenSection.remove();
    }
}

// Add event listeners for token options
document.addEventListener('DOMContentLoaded', function() {
    // Token type change
    const tokenType = document.getElementById('tokenType');
    if (tokenType) {
        tokenType.addEventListener('change', updateTokenPreview);
    }

    // Add listeners to all token-related inputs
    const tokenInputs = [
        'tokenDistribution',
        'tokenEconomics',
        'tokenNetwork',
        'utilityAccess',
        'utilityGovernance',
        'utilityRewards',
        'utilityStaking',
        'utilityReputation',
        'featureVesting',
        'featureLocking',
        'featureBurning',
        'featureMultisig',
        'featureUpgradeable'
    ];

    tokenInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', updateTokenPreview);
        }
    });
}); 