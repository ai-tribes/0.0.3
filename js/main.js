// Add at the start of the file
const totalSteps = 22; // Total number of setup steps
let completedSteps = 0;

// Add this near the top of your file
const API_URL = 'https://api.aitribes.com/v1'; // Replace with your actual API endpoint

function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const percentage = (completedSteps / totalSteps) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
}

function markStepCompleted(number) {
    // Get the button for this step
    const button = document.querySelector(`.btn-custom .number[textContent="${number}"]`)?.closest('.btn-custom');
    if (button) {
        if (!button.classList.contains('completed')) {
            button.classList.add('completed');
            completedSteps++;
            updateProgress();
        }
    }
}

// Store all tribe data
const tribeData = {};

document.addEventListener('DOMContentLoaded', function() {
    const contentArea = document.querySelector('.preview-panel .card-body');
    
    // Handle generate random tribe button
    const generateButton = document.querySelector('.generate-tribe-btn');
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            generateRandomTribe();
            document.querySelector('.preview-panel')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Handle section navigation buttons
    document.querySelectorAll('.btn-custom').forEach(button => {
        button.addEventListener('click', function() {
            const number = this.querySelector('.number')?.textContent.trim();
            if (!number) return;
            
            const sectionPath = `components/sections/${number}-${getSectionName(number)}.html`;
            
            fetch(sectionPath)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            throw new Error(`Section ${number} is not yet implemented`);
                        }
                        throw new Error(`Error loading section ${number}`);
                    }
                    return response.text();
                })
                .then(html => {
                    try {
                        contentArea.innerHTML = html;
                        setupSectionHandlers(number);
                        
                        document.querySelectorAll('.btn-custom').forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                    } catch (err) {
                        console.error('Template error:', err);
                        throw new Error(`This section's template is incomplete`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    contentArea.innerHTML = `
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${error.message}
                        </div>
                        <div class="text-muted small mt-2">
                            Please contact the development team if this error persists.
                        </div>
                    `;
                });
        });
    });

    // Connect wallet button handler
    document.querySelectorAll('[data-action="connect-wallet"]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modalEl = document.getElementById('connectWalletModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    });

    // Profile Image Upload
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');

    if (imageUpload && profileImage) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type and size
                if (!file.type.startsWith('image/')) {
                    showToast('error', 'Invalid File', 'Please upload an image file');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showToast('error', 'File Too Large', 'Please upload an image smaller than 5MB');
                    return;
                }

                // Preview image
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImage.src = e.target.result;
                    
                    // Save the profile data with the new image
                    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
                    savedProfile.profileImage = e.target.result;
                    localStorage.setItem('userProfile', JSON.stringify(savedProfile));
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Document Upload Handlers
    ['govId', 'proofAddress'].forEach(docType => {
        const input = document.getElementById(docType);
        const uploadBtn = document.getElementById(`upload${docType.charAt(0).toUpperCase() + docType.slice(1)}`);

        if (input && uploadBtn) {
            uploadBtn.addEventListener('click', async function() {
                const file = input.files[0];
                if (!file) {
                    showToast('error', 'No File Selected', 'Please select a file to upload');
                    return;
                }

                // Validate file type and size
                const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'];
                if (!validTypes.includes(file.type)) {
                    showToast('error', 'Invalid File', 'Please upload a PDF or image file');
                    return;
                }
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    showToast('error', 'File Too Large', 'Please upload a file smaller than 10MB');
                    return;
                }

                try {
                    // Show upload progress
                    uploadBtn.disabled = true;
                    uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                    // Generate document hash
                    const hash = await generateFileHash(file);

                    // Simulate upload (replace with actual upload logic)
                    await simulateUpload();

                    // Update UI to show success
                    uploadBtn.innerHTML = '<i class="fas fa-check"></i>';
                    uploadBtn.classList.remove('btn-outline-secondary');
                    uploadBtn.classList.add('btn-success');

                    // Store hash for later use in token issuance
                    window.documentHashes = window.documentHashes || {};
                    window.documentHashes[docType] = hash;

                    showToast('success', 'Upload Complete', 'Document uploaded and hashed successfully');
                } catch (error) {
                    console.error('Upload error:', error);
                    uploadBtn.innerHTML = '<i class="fas fa-upload"></i>';
                    uploadBtn.disabled = false;
                    showToast('error', 'Upload Failed', 'Please try again');
                }
            });
        }
    });

    // Helper function to generate file hash
    async function generateFileHash(file) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Simulate upload process (replace with actual upload logic)
    function simulateUpload() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Toast notification helper
    function showToast(type, title, message) {
        // You can implement this using your preferred toast library
        // For now, we'll just log to console
        console.log(`${type}: ${title} - ${message}`);
    }

    // Load saved profile data
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    // Populate form fields with saved data
    Object.keys(savedProfile).forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            if (field === 'profileImage') {
                element.src = savedProfile[field] || 'assets/default-avatar.png';
            } else {
                element.value = savedProfile[field] || '';
            }
        }
    });

    // Update the profile form handler
    function handleProfileForm() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Show saving state
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.disabled = true;
                submitButton.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Saving...
                `;
                
                try {
                    // Collect form data
                    const profileData = {
                        displayName: document.getElementById('displayName').value,
                        username: document.getElementById('username').value,
                        bio: document.getElementById('bio').value,
                        email: document.getElementById('email').value,
                        location: document.getElementById('location').value,
                        social: {
                            twitter: document.getElementById('twitter').value,
                            github: document.getElementById('github').value,
                            discord: document.getElementById('discord').value,
                            telegram: document.getElementById('telegram').value,
                        },
                        wallets: {
                            eth: document.getElementById('ethAddress').value,
                            sol: document.getElementById('solAddress').value,
                            handcash: document.getElementById('handcashHandle').value,
                        },
                        profileImage: document.getElementById('profileImage').src
                    };

                    // For now, save to localStorage
                    localStorage.setItem('userProfile', JSON.stringify(profileData));

                    // TODO: Replace with actual API call when ready
                    // const response = await fetch(`${API_URL}/profile`, {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type': 'application/json',
                    //         'Authorization': `Bearer ${getUserToken()}`
                    //     },
                    //     body: JSON.stringify(profileData)
                    // });
                    
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    // Show success message
                    showToast('success', 'Profile Updated', 'Your changes have been saved successfully');

                } catch (error) {
                    console.error('Save error:', error);
                    showToast('error', 'Save Failed', 'Please try again');
                } finally {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }
            });
        }
    }

    // Call this in your DOMContentLoaded event
    handleProfileForm();

    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const profileData = {
                displayName: document.getElementById('displayName').value,
                username: document.getElementById('username').value,
                bio: document.getElementById('bio').value,
                email: document.getElementById('email').value,
                location: document.getElementById('location').value,
                twitter: document.getElementById('twitter').value,
                github: document.getElementById('github').value,
                discord: document.getElementById('discord').value,
                telegram: document.getElementById('telegram').value,
                ethAddress: document.getElementById('ethAddress').value,
                solAddress: document.getElementById('solAddress').value,
                handcashHandle: document.getElementById('handcashHandle').value,
                profileImage: document.getElementById('profileImage').src
            };
            
            // Save to localStorage
            localStorage.setItem('userProfile', JSON.stringify(profileData));
            
            // Show success message
            showToast('success', 'Profile Updated', 'Your changes have been saved successfully');
        });
    }
});

// Add after the DOMContentLoaded event listener
window.connectWallet = async function(provider) {
    const button = event.currentTarget;
    const originalHtml = button.innerHTML;
    
    // Show connecting state
    button.innerHTML = `
        <span class="d-flex align-items-center">
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Connecting...
        </span>
    `;
    button.disabled = true;

    try {
        // Simulate wallet connection
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update navbar button
        const navButton = document.querySelector('.nav-link[data-action="connect-wallet"]');
        navButton.innerHTML = '<i class="fas fa-wallet me-2"></i>0x1234...5678';
        navButton.classList.remove('btn-outline-primary');
        navButton.classList.add('btn-primary');

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('connectWalletModal')).hide();
        
        // Show success toast
        showToast('success', 'Wallet Connected', 'Your wallet has been successfully connected.');
    } catch (error) {
        // Reset button state
        button.innerHTML = originalHtml;
        button.disabled = false;
        
        // Show error toast
        showToast('error', 'Connection Failed', 'Failed to connect wallet. Please try again.');
    }
};

// Toast notification helper
function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="toast-header ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function setupSectionHandlers(number) {
    switch(number) {
        case '01':
            const createTribeForm = document.getElementById('createTribeForm');
            if (createTribeForm) {
                createTribeForm.onsubmit = function(e) {
                    e.preventDefault();
                    const formData = new FormData(this);
                    const data = {
                        basics: {
                            name: formData.get('tribeName'),
                            handle: formData.get('tribeHandle'),
                            description: formData.get('tribeDescription')
                        },
                        settings: {
                            category: formData.get('category'),
                            stage: formData.get('tribeType'),
                            accessType: formData.get('accessType'),
                            fundingStatus: formData.get('fundingStatus'),
                            language: formData.get('language'),
                            timezone: formData.get('timezone'),
                            aiFeatures: formData.get('aiFeatures') === 'on',
                            tokenomics: formData.get('tokenomics') === 'on'
                        }
                    };
                    tribeData.creation = data;
                    showPreview();
                    markStepCompleted('01');
                };
            }
            break;
            
        case '02':
            const purposeForm = document.getElementById('purposeForm');
            if (purposeForm) {
                purposeForm.onsubmit = function(e) {
                    e.preventDefault();
                    const data = {
                        purpose: this.tribePurpose.value,
                        goals: this.tribeGoals.value
                    };
                    tribeData.purpose = data;
                    showPreview();
                    markStepCompleted('02');
                };
            }
            break;
            
        case '03':  // Create Token
            // Handle multi-chain toggle
            document.getElementById('enableMultiChain')?.addEventListener('change', function() {
                const allocationInputs = document.querySelectorAll('[name$="Allocation"]');
                allocationInputs.forEach(input => {
                    input.addEventListener('input', validateAllocations);
                });
            });

            // Validate network allocations total 100%
            function validateAllocations() {
                const allocations = document.querySelectorAll('[name$="Allocation"]');
                let total = 0;
                allocations.forEach(input => {
                    total += Number(input.value) || 0;
                });
                
                const warning = document.getElementById('allocationWarning');
                warning.classList.toggle('d-none', total === 100);
                return total === 100;
            }

            // Handle tax toggle
            document.getElementById('enableTax')?.addEventListener('change', function() {
                const taxSettings = document.getElementById('taxSettings');
                taxSettings.classList.toggle('d-none', !this.checked);
            });

            // Handle supply type change
            document.querySelectorAll('input[name="supplyType"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    const conditionalRules = document.getElementById('conditionalRules');
                    conditionalRules.classList.toggle('d-none', this.value !== 'conditional');
                });
            });

            const tokenForm = document.getElementById('tokenForm');
            if (tokenForm) {
                tokenForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get network configurations
                    const networks = [];
                    ['bsv', 'eth', 'sol'].forEach(network => {
                        if (this[`${network}Enabled`]?.checked) {
                            networks.push({
                                network: network,
                                standard: this[`${network}Standard`].value,
                                allocation: this[`${network}Allocation`].value
                            });
                        }
                    });

                    // Get agent allocations
                    const agentAllocations = [];
                    document.querySelectorAll('#agentAllocationList .agent-allocation-item').forEach(item => {
                        agentAllocations.push({
                            name: item.querySelector('.agent-name').value,
                            allocation: item.querySelector('.agent-allocation').value,
                            wallet: item.querySelector('.agent-wallet').value
                        });
                    });

                    // Get token distribution
                    const distributions = [];
                    document.querySelectorAll('.allocation-item').forEach(item => {
                        distributions.push({
                            category: item.querySelector('input[type="text"]').value,
                            percentage: item.querySelector('.allocation-percent').value,
                            vesting: item.querySelector('select').value
                        });
                    });

                    const data = {
                        basics: {
                            name: this.tokenName.value,
                            symbol: this.tokenSymbol.value
                        },
                        networks: networks,
                        supply: {
                            type: this.supplyType.value,
                            initial: this.initialSupply.value,
                            conditions: this.supplyType.value === 'conditional' ? getConditions() : []
                        },
                        tax: {
                            enabled: this.enableTax.checked,
                            percentage: this.enableTax.checked ? this.taxPercentage.value : 0,
                            handling: this.enableTax.checked ? this.taxHandling.value : null
                        },
                        distribution: distributions,
                        agents: agentAllocations
                    };
                    
                    tribeData.token = data;
                    showPreview();
                    markStepCompleted('03');
                };
            }
            break;
            
        case '04':  // Upload Logo
            const logoForm = document.getElementById('logoForm');
            if (logoForm) {
                // Preview image before upload
                const fileInput = logoForm.querySelector('input[type="file"]');
                const preview = document.getElementById('logoPreview');
                
                fileInput.addEventListener('change', function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            preview.src = e.target.result;
                            preview.classList.remove('d-none');
                        };
                        reader.readAsDataURL(file);
                    }
                });

                logoForm.onsubmit = function(e) {
                    e.preventDefault();
                    const data = {
                        logoUrl: preview.src
                    };
                    tribeData.logo = data;
                    showPreview();
                    markStepCompleted('04');
                };
            }
            break;
            
        case '05':  // X Profile
            // Add agent profile function
            window.addAgentProfile = function() {
                const template = document.getElementById('agentProfileTemplate');
                const list = document.getElementById('agentProfilesList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove agent profile function
            window.removeAgentProfile = function(button) {
                button.closest('.agent-profile').remove();
            };

            // Verify profile function
            window.verifyXProfile = function(type) {
                const status = document.getElementById('verificationStatus');
                status.classList.remove('d-none');
                status.classList.remove('alert-success', 'alert-danger');
                status.classList.add('alert-info');
                status.textContent = `Verifying ${type} profile...`;
                
                setTimeout(() => {
                    status.classList.remove('alert-info');
                    status.classList.add('alert-success');
                    status.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} profile verified!`;
                }, 1500);
            };

            const xProfileForm = document.getElementById('xProfileForm');
            if (xProfileForm) {
                xProfileForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get agent profiles data
                    const agentProfiles = [];
                    document.querySelectorAll('.agent-profile').forEach(profile => {
                        agentProfiles.push({
                            name: profile.querySelector('.agent-name').value,
                            handle: profile.querySelector('.agent-handle').value,
                            autoReply: profile.querySelector('.form-check-input').checked
                        });
                    });

                    const data = {
                        tribe: {
                            handle: this.xHandle.value,
                            autoPost: this.autoPost.checked,
                            verified: false
                        },
                        agents: agentProfiles
                    };
                    
                    tribeData.xProfile = data;
                    showPreview();
                    markStepCompleted('05');
                };
            }
            break;
            
        case '06':  // GitHub Integration
            // Toggle PAT input based on auth type
            document.getElementById('authType')?.addEventListener('change', function() {
                const patInput = document.getElementById('patInput');
                patInput.classList.toggle('d-none', this.value === 'oauth');
            });

            // GitHub authentication function
            window.authenticateGitHub = function() {
                const authType = document.getElementById('authType').value;
                const status = document.getElementById('repoStatus');
                status.classList.remove('d-none');
                status.classList.remove('alert-success', 'alert-danger');
                status.classList.add('alert-info');
                status.textContent = 'Authenticating with GitHub...';

                if (authType === 'oauth') {
                    // Simulate OAuth flow
                    setTimeout(() => {
                        status.classList.remove('alert-info');
                        status.classList.add('alert-success');
                        status.textContent = 'Successfully authenticated with GitHub!';
                    }, 1500);
                } else {
                    const token = document.querySelector('input[name="githubToken"]').value;
                    if (!token) {
                        status.classList.remove('alert-info');
                        status.classList.add('alert-danger');
                        status.textContent = 'Please enter a Personal Access Token';
                        return;
                    }
                    // Simulate PAT verification
                    setTimeout(() => {
                        status.classList.remove('alert-info');
                        status.classList.add('alert-success');
                        status.textContent = 'Token verified successfully!';
                    }, 1500);
                }
            };

            // Add repo function
            window.addAgentRepo = function() {
                const template = document.getElementById('agentRepoTemplate');
                const list = document.getElementById('agentReposList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove repo function
            window.removeAgentRepo = function(button) {
                button.closest('.agent-repo').remove();
            };

            // Save agent repos function
            window.saveAgentRepos = function() {
                const currentData = tribeData.github || {};
                const agentRepos = [];
                
                document.querySelectorAll('.agent-repo').forEach(repo => {
                    agentRepos.push({
                        name: repo.querySelector('.agent-name').value || '',
                        repo: repo.querySelector('.agent-repo').value || '',
                        access: repo.querySelector('.agent-access').value || 'read',
                        permissions: {
                            directCommits: repo.querySelectorAll('.form-check-input')[0]?.checked || false,
                            pullRequests: repo.querySelectorAll('.form-check-input')[1]?.checked || false,
                            manageIssues: repo.querySelectorAll('.form-check-input')[2]?.checked || false
                        }
                    });
                });

                // Keep existing org and main data, update only agents
                tribeData.github = {
                    ...currentData,  // Keep all existing data
                    agents: agentRepos  // Update only agents
                };
                
                showPreview();
                markStepCompleted('06');
            };

            // Main form handler
            const githubForm = document.getElementById('githubForm');
            if (githubForm) {
                githubForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get agent repos data
                    const agentRepos = [];
                    document.querySelectorAll('.agent-repo').forEach(repo => {
                        agentRepos.push({
                            name: repo.querySelector('.agent-name').value || '',
                            repo: repo.querySelector('.agent-repo').value || '',
                            access: repo.querySelector('.agent-access').value || 'read',
                            permissions: {
                                directCommits: repo.querySelectorAll('.form-check-input')[0]?.checked || false,
                                pullRequests: repo.querySelectorAll('.form-check-input')[1]?.checked || false,
                                manageIssues: repo.querySelectorAll('.form-check-input')[2]?.checked || false
                            }
                        });
                    });

                    // Save all GitHub data at once
                    const data = {
                        organization: {
                            name: this.orgName.value || 'default-org',
                            authType: this.authType?.value || 'oauth',
                            token: this.githubToken?.value || null
                        },
                        main: {
                            repo: this.repoName.value || 'main-repo',
                            visibility: this.repoVisibility?.value || 'private',
                            features: {
                                autoCommit: this.autoCommit?.checked || false,
                                autoPR: this.autoPR?.checked || false,
                                autoIssues: this.autoIssues?.checked || false,
                                codeReview: this.codeReview?.checked || false
                            }
                        },
                        agents: agentRepos
                    };
                    
                    tribeData.github = data;
                    showPreview();
                    markStepCompleted('06');
                };
            }
            break;
            
        case '07':  // Wallet Configuration
            // Toggle MultiSig settings based on wallet type
            document.getElementById('walletType')?.addEventListener('change', function() {
                const multisigSettings = document.getElementById('multisigSettings');
                multisigSettings.classList.toggle('d-none', this.value !== 'multisig');
            });

            // Add agent wallet function
            window.addAgentWallet = function() {
                const template = document.getElementById('agentWalletTemplate');
                const list = document.getElementById('agentWalletsList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove agent wallet function
            window.removeAgentWallet = function(button) {
                button.closest('.agent-wallet').remove();
            };

            const walletForm = document.getElementById('walletForm');
            if (walletForm) {
                walletForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get agent wallets data
                    const agentWallets = [];
                    document.querySelectorAll('.agent-wallet').forEach(wallet => {
                        agentWallets.push({
                            name: wallet.querySelector('.agent-name').value || '',
                            type: wallet.querySelector('.agent-wallet-type').value || 'hot',
                            permissions: {
                                tokenTrading: wallet.querySelectorAll('.form-check-input')[0]?.checked || false,
                                nftTrading: wallet.querySelectorAll('.form-check-input')[1]?.checked || false,
                                defiOps: wallet.querySelectorAll('.form-check-input')[2]?.checked || false
                            },
                            dailyLimit: wallet.querySelector('.agent-daily-limit').value || '0'
                        });
                    });

                    const data = {
                        treasury: {
                            type: this.walletType.value,
                            network: this.network.value,
                            multisig: {
                                requiredSigs: this.requiredSigs?.value || '2',
                                timelock: this.enableTimelock?.checked || false
                            },
                            controls: {
                                budgets: this.enableBudgets?.checked || false,
                                limits: this.enableLimits?.checked || false,
                                audit: this.enableAudit?.checked || false
                            }
                        },
                        agents: agentWallets
                    };
                    
                    tribeData.wallet = data;
                    showPreview();
                    markStepCompleted('07');
                };
            }
            break;
            
        case '08':  // Google Cloud Integration
            // Add agent service function
            window.addAgentService = function() {
                const template = document.getElementById('agentServiceTemplate');
                const list = document.getElementById('agentServicesList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove agent service function
            window.removeAgentService = function(button) {
                button.closest('.agent-service').remove();
            };

            const googleCloudForm = document.getElementById('googleCloudForm');
            if (googleCloudForm) {
                googleCloudForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get enabled services
                    const enabledServices = [];
                    document.querySelectorAll('input[name="services[]"]:checked').forEach(checkbox => {
                        enabledServices.push(checkbox.value);
                    });

                    // Get agent service assignments
                    const agentServices = [];
                    document.querySelectorAll('.agent-service').forEach(agent => {
                        const services = [];
                        agent.querySelectorAll('.service-checkboxes input:checked').forEach(checkbox => {
                            services.push(checkbox.value);
                        });
                        
                        agentServices.push({
                            name: agent.querySelector('.agent-name').value || '',
                            services: services
                        });
                    });

                    const data = {
                        project: {
                            name: this.projectName.value,
                            region: this.region.value
                        },
                        services: enabledServices,
                        agents: agentServices
                    };
                    
                    tribeData.googleCloud = data;
                    showPreview();
                    markStepCompleted('08');
                };
            }
            break;
            
        case '09':  // Telegram Integration
            // Add agent access function
            window.addAgentAccess = function() {
                const template = document.getElementById('agentAccessTemplate');
                const list = document.getElementById('agentAccessList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove agent access function
            window.removeAgentAccess = function(button) {
                button.closest('.agent-access-item').remove();
            };

            const telegramForm = document.getElementById('telegramForm');
            if (telegramForm) {
                telegramForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get enabled features (optional)
                    const enabledFeatures = [];
                    document.querySelectorAll('input[name="features[]"]:checked').forEach(checkbox => {
                        enabledFeatures.push(checkbox.value);
                    });

                    // Get agent access configurations (optional)
                    const agentAccess = [];
                    document.querySelectorAll('.agent-access-item').forEach(agent => {
                        const permissions = [];
                        agent.querySelectorAll('.permission-checkboxes input:checked').forEach(checkbox => {
                            permissions.push(checkbox.value);
                        });
                        
                        agentAccess.push({
                            name: agent.querySelector('.agent-name').value || '',
                            permissions: permissions
                        });
                    });

                    // Create data object with optional fields
                    const data = {
                        community: {
                            channel: {
                                name: this.channelName.value || '',  // Make it optional
                                agentPosts: this.agentPosts?.checked || false
                            },
                            group: {
                                name: this.groupName.value || '',  // Make it optional
                                requireApproval: this.memberApproval?.checked || false,
                                agentInteractions: this.agentInteractions?.checked || false
                            }
                        },
                        agents: agentAccess,
                        features: enabledFeatures
                    };
                    
                    tribeData.telegram = data;
                    showPreview();
                    markStepCompleted('09');
                };
            }
            break;
            
        case '10':
            window.checkDomainAvailability = function() {
                const domain = document.getElementById('domainName').value;
                const ext = document.getElementById('domainExt').value;
                const fullDomain = domain + ext;

                // Show checking status
                const statusDiv = document.getElementById('domainStatus');
                statusDiv.classList.remove('d-none');
                statusDiv.querySelector('.alert').className = 'alert alert-info';
                statusDiv.querySelector('.alert').innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Checking availability...';

                // Simulate API check
                setTimeout(() => {
                    // For demo, pretend domain is available
                    statusDiv.querySelector('.alert').className = 'alert alert-success';
                    statusDiv.querySelector('.alert').innerHTML = '<i class="fas fa-check me-2"></i>Domain is available!';
                    
                    // Show DNS settings
                    document.getElementById('dnsSettings').classList.remove('d-none');
                    document.getElementById('dnsRecords').textContent = 
                        `A     your-tribe.${domain}     -> 123.45.67.89
CNAME www.your-tribe.${domain} -> your-tribe.${domain}`;
                    
                    // Enable submit button
                    document.getElementById('domainSubmitButton').disabled = false;
                }, 1500);
            };

            const domainForm = document.getElementById('domainForm');
            if (domainForm) {
                domainForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        domain: this.domainName.value + this.domainExt.value,
                        dnsConfigured: true
                    };
                    
                    // Save data
                    tribeData.domain = data;
                    
                    // Show preview
                    showPreview('domain', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Domain Configuration</h4>
                            <p><strong>Domain:</strong> ${data.domain}</p>
                            <p><strong>Status:</strong> Configured</p>
                        </div>
                    `);
                    markStepCompleted('10');
                };
            }
            break;
            
        case '11':  // AI APIs Integration
            // Add agent access function
            window.addAgentAccess = function() {
                const template = document.getElementById('agentAccessTemplate');
                const list = document.getElementById('agentAccessList');
                const clone = template.content.cloneNode(true);
                list.appendChild(clone);
            };

            // Remove agent access function
            window.removeAgentAccess = function(button) {
                button.closest('.agent-access-item').remove();
            };

            // Handle form submission
            const aiApisForm = document.getElementById('aiApisForm');
            if (aiApisForm) {
                aiApisForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get enabled providers and their configurations
                    const providers = {};
                    ['openai', 'xai', 'anthropic', 'gemini', 'stability', 'custom'].forEach(provider => {
                        if (this[`enable${provider.charAt(0).toUpperCase() + provider.slice(1)}`]?.checked) {
                            providers[provider] = {
                                enabled: true,
                                key: this[`${provider}Key`]?.value || '',
                                model: this[`${provider}Model`]?.value || '',
                                limit: this[`${provider}Limit`]?.value || '0'
                            };
                            
                            // Add custom API specific fields
                            if (provider === 'custom') {
                                providers[provider].endpoint = this.customEndpoint?.value || '';
                                providers[provider].authType = this.customAuth?.value || '';
                            }
                        }
                    });

                    // Get payment configuration
                    const payments = {
                        card: this.enableCard?.checked ? {
                            enabled: true,
                            // We don't store actual card details in preview
                            configured: Boolean(this.cardNumber?.value)
                        } : { enabled: false },
                        crypto: this.enableCrypto?.checked ? {
                            enabled: true,
                            currency: this.cryptoCurrency?.value,
                            network: this.cryptoNetwork?.value,
                            wallet: this.cryptoWallet?.value
                        } : { enabled: false },
                        autoRecharge: this.enableAutoRecharge?.checked ? {
                            enabled: true,
                            threshold: this.rechargeThreshold?.value || '50',
                            amount: this.rechargeAmount?.value || '100'
                        } : { enabled: false }
                    };

                    // Get agent access configurations
                    const agentAccess = [];
                    document.querySelectorAll('.agent-access-item').forEach(agent => {
                        const enabledApis = [];
                        agent.querySelectorAll('.api-checkboxes input:checked').forEach(checkbox => {
                            enabledApis.push(checkbox.value);
                        });
                        
                        agentAccess.push({
                            name: agent.querySelector('.agent-name').value || '',
                            apis: enabledApis,
                            budget: agent.querySelector('.agent-budget').value || '0'
                        });
                    });

                    const data = {
                        providers: providers,
                        payments: payments,
                        agents: agentAccess
                    };
                    
                    tribeData.aiApis = data;
                    showPreview();
                    markStepCompleted('11');
                };
            }
            break;
            
        case '12':  // PFP NFT Collection
            let selectedStyle = null;
            let selectedMethod = null;

            // Style selection handler
            window.selectStyle = function(style) {
                selectedStyle = style;
                
                // Update UI to show selected style
                document.querySelectorAll('.style-selectable').forEach(card => {
                    card.classList.remove('selected');
                });
                document.querySelector(`[onclick="selectStyle('${style}')"]`).classList.add('selected');
                
                // Show generation method options
                document.getElementById('generationMethod').classList.remove('d-none');
                
                // Scroll to generation method
                document.getElementById('generationMethod').scrollIntoView({ behavior: 'smooth' });
            };

            // Method selection handler
            window.selectMethod = function(method) {
                selectedMethod = method;
                
                // Update UI to show selected method
                document.querySelectorAll('.method-selectable').forEach(card => {
                    card.classList.remove('selected');
                });
                document.querySelector(`[onclick="selectMethod('${method}')"]`).classList.add('selected');
                
                // Show appropriate options based on method
                document.getElementById('aiOptions').classList.toggle('d-none', method !== 'ai');
                document.getElementById('layerOptions').classList.toggle('d-none', method !== 'manual');
                
                // Show collection settings
                document.getElementById('collectionSettings').classList.remove('d-none');
            };

            // Generate sample previews
            window.generateSamples = async function() {
                const previewSection = document.getElementById('previewSection');
                const previewGrid = previewSection.querySelector('.preview-grid');
                
                // Show loading state
                previewGrid.innerHTML = '<div class="col-12 text-center"><i class="fas fa-spinner fa-spin fa-3x"></i></div>';
                previewSection.classList.remove('d-none');
                
                try {
                    const traits = generateRandomTraits();
                    const samples = [];
                    
                    // Generate 4 variations
                    for (let i = 0; i < 4; i++) {
                        const image = await imageGenerator.generateNFT(selectedStyle, traits);
                        samples.push(image);
                    }
                    
                    // Display the results
                    previewGrid.innerHTML = samples.map(base64 => `
                        <div class="col-md-3">
                            <img src="data:image/png;base64,${base64}" 
                                 alt="Generated NFT" 
                                 class="img-fluid rounded">
                        </div>
                    `).join('');
                } catch (error) {
                    previewGrid.innerHTML = `
                        <div class="col-12 text-center text-danger">
                            <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                            <p>Failed to generate images. Please try again.</p>
                        </div>
                    `;
                }
            };

            // Refresh preview handler
            window.refreshPreview = function() {
                generateSamples();
            };

            // Form submission handler
            const pfpForm = document.getElementById('pfpForm');
            if (pfpForm) {
                pfpForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    // Get selected networks
                    const networks = [];
                    document.querySelectorAll('.network-options input:checked').forEach(checkbox => {
                        networks.push(checkbox.value);
                    });

                    const data = {
                        style: selectedStyle,
                        method: selectedMethod,
                        collection: {
                            name: this.collectionName.value,
                            size: this.collectionSize.value,
                            networks: networks
                        },
                        generation: {
                            type: selectedMethod,
                            prompt: document.querySelector('#aiOptions textarea')?.value || '',
                            sampleImage: document.querySelector('#aiOptions input[type="file"]')?.files[0]?.name || null
                        }
                    };
                    
                    tribeData.pfp = data;
                    showPreview();
                    markStepCompleted('12');
                };
            }
            break;
            
        case '13':
            let verifiedServer = false;
            let verifiedBot = false;

            window.verifyDiscordServer = function() {
                const serverId = document.getElementById('serverId').value;
                if (!serverId) return;

                const button = document.querySelector('button[onclick="verifyDiscordServer()"]');
                button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verifying...';
                button.disabled = true;

                // Simulate API verification
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check me-2"></i>Verified';
                    button.classList.remove('btn-outline-primary');
                    button.classList.add('btn-success');
                    verifiedServer = true;
                    checkEnableSubmit();
                }, 1500);
            };

            window.verifyDiscordBot = function() {
                const token = document.getElementById('botToken').value;
                if (!token) return;

                const button = document.querySelector('button[onclick="verifyDiscordBot()"]');
                button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verifying...';
                button.disabled = true;

                // Simulate API verification
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check me-2"></i>Verified';
                    button.classList.remove('btn-outline-primary');
                    button.classList.add('btn-success');
                    verifiedBot = true;
                    checkEnableSubmit();
                }, 1500);
            };

            function checkEnableSubmit() {
                if (verifiedServer && verifiedBot) {
                    document.getElementById('discordSubmitButton').disabled = false;
                }
            }

            const discordForm = document.getElementById('discordForm');
            if (discordForm) {
                discordForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        serverName: this.serverName.value,
                        serverId: this.serverId.value,
                        enableWelcome: this.enableWelcome.checked,
                        enableModeration: this.enableModeration.checked,
                        enableRoles: this.enableRoles.checked
                    };
                    
                    // Save data
                    tribeData.discord = data;
                    
                    // Show preview
                    showPreview('discord', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Discord Integration</h4>
                            <p><strong>Server:</strong> ${data.serverName}</p>
                            <p><strong>Features:</strong> 
                                ${data.enableWelcome ? 'Welcome Messages, ' : ''}
                                ${data.enableModeration ? 'Moderation, ' : ''}
                                ${data.enableRoles ? 'Auto Roles' : ''}
                            </p>
                        </div>
                    `);
                    markStepCompleted('13');
                };
            }
            break;
            
        case '14':
            // Handle custom analytics toggle
            document.getElementById('enableCustom')?.addEventListener('change', function() {
                const options = document.getElementById('customAnalyticsOptions');
                if (this.checked) {
                    options.classList.remove('d-none');
                } else {
                    options.classList.add('d-none');
                }
            });

            window.verifyAnalytics = function(platform) {
                if (platform === 'ga') {
                    const trackingId = document.getElementById('gaTrackingId').value;
                    if (!trackingId) return;

                    const button = document.querySelector('button[onclick="verifyAnalytics(\'ga\')"]');
                    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Verifying...';
                    button.disabled = true;

                    // Simulate API verification
                    setTimeout(() => {
                        button.innerHTML = '<i class="fas fa-check me-2"></i>Verified';
                        button.classList.remove('btn-outline-primary');
                        button.classList.add('btn-success');
                        
                        // Enable submit button
                        document.getElementById('analyticsSubmitButton').disabled = false;
                    }, 1500);
                }
            };

            const analyticsForm = document.getElementById('analyticsForm');
            if (analyticsForm) {
                analyticsForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        googleAnalytics: {
                            trackingId: this.gaTrackingId.value,
                            enhancedEcommerce: this.gaEnhancedEcom.checked
                        },
                        customAnalytics: {
                            enabled: this.enableCustom.checked,
                            trackPageviews: this.trackPageviews?.checked || false,
                            trackEvents: this.trackEvents?.checked || false,
                            trackConversions: this.trackConversions?.checked || false
                        }
                    };
                    
                    // Save data
                    tribeData.analytics = data;
                    
                    // Show preview
                    showPreview('analytics', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Analytics Configuration</h4>
                            <p><strong>Google Analytics:</strong> ${data.googleAnalytics.trackingId ? 'Connected' : 'Not connected'}</p>
                            <p><strong>Enhanced Ecommerce:</strong> ${data.googleAnalytics.enhancedEcommerce ? 'Enabled' : 'Disabled'}</p>
                            <p><strong>Custom Analytics:</strong> ${data.customAnalytics.enabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    `);
                    markStepCompleted('14');
                };
            }
            break;
            
        case '15':
            // Handle notification toggles
            ['Email', 'Push', 'InApp'].forEach(type => {
                document.getElementById(`enable${type}`)?.addEventListener('change', function() {
                    const settings = document.getElementById(`${type.toLowerCase()}Settings`);
                    if (this.checked) {
                        settings.classList.remove('d-none');
                    } else {
                        settings.classList.add('d-none');
                    }
                });
            });

            const notificationsForm = document.getElementById('notificationsForm');
            if (notificationsForm) {
                notificationsForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        email: {
                            enabled: this.enableEmail.checked,
                            digest: this.emailDigest?.checked || false
                        },
                        push: {
                            enabled: this.enablePush.checked,
                            sound: this.pushSound?.checked || false
                        },
                        inApp: {
                            enabled: this.enableInApp.checked,
                            badge: this.showBadge?.checked || false,
                            preview: this.showPreview?.checked || false,
                            persist: this.persistNotifs?.checked || false
                        }
                    };
                    
                    // Save data
                    tribeData.notifications = data;
                    
                    // Show preview
                    showPreview('notifications', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Notification Settings</h4>
                            <p><strong>Email:</strong> ${data.email.enabled ? 'Enabled' : 'Disabled'}</p>
                            <p><strong>Push:</strong> ${data.push.enabled ? 'Enabled' : 'Disabled'}</p>
                            <p><strong>In-App:</strong> ${data.inApp.enabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                    `);
                    markStepCompleted('15');
                };
            }
            break;
            
        case '16':
            const backupForm = document.getElementById('backupForm');
            if (backupForm) {
                // Handle storage provider change
                document.getElementById('storageProvider')?.addEventListener('change', function() {
                    const settings = document.getElementById('storageSettings');
                    const placeholders = {
                        aws: ['S3 Bucket Name', 'Access Key ID', 'Secret Access Key'],
                        gcp: ['Bucket Name', 'Project ID', 'Service Account Key'],
                        azure: ['Container Name', 'Account Name', 'Access Key']
                    };
                    
                    const inputs = settings.querySelectorAll('input');
                    placeholders[this.value].forEach((placeholder, index) => {
                        inputs[index].placeholder = placeholder;
                    });
                });

                backupForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        schedule: {
                            frequency: this.backupFrequency.value,
                            retention: this.retentionPeriod.value
                        },
                        storage: {
                            provider: this.storageProvider.value,
                            encrypted: this.encryptBackups.checked
                        },
                        content: {
                            database: this.backupDatabase.checked,
                            files: this.backupFiles.checked,
                            config: this.backupConfig.checked,
                            logs: this.backupLogs.checked,
                            analytics: this.backupAnalytics.checked,
                            audit: this.backupAudit.checked
                        }
                    };
                    
                    // Save data
                    tribeData.backup = data;
                    
                    // Show preview
                    showPreview('backup', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Backup Configuration</h4>
                            <p><strong>Schedule:</strong> ${data.schedule.frequency} backups</p>
                            <p><strong>Storage:</strong> ${data.storage.provider.toUpperCase()} ${data.storage.encrypted ? '(Encrypted)' : ''}</p>
                            <p><strong>Content:</strong> 
                                ${Object.entries(data.content)
                                    .filter(([_, enabled]) => enabled)
                                    .map(([type]) => type.charAt(0).toUpperCase() + type.slice(1))
                                    .join(', ')}
                            </p>
                        </div>
                    `);
                    markStepCompleted('16');
                };
            }
            break;
            
        case '17':
            const securityForm = document.getElementById('securityForm');
            if (securityForm) {
                securityForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        authentication: {
                            twoFactor: this.enable2FA.checked,
                            sso: this.ssoEnabled.checked,
                            socialAuth: this.socialAuth.checked,
                            password: {
                                specialChar: this.requireSpecialChar.checked,
                                numbers: this.requireNumbers.checked,
                                uppercase: this.requireUppercase.checked
                            }
                        },
                        protection: {
                            ddos: this.ddosProtection.checked,
                            waf: this.wafEnabled.checked,
                            rateLimiting: this.rateLimiting.checked,
                            session: {
                                timeout: this.sessionTimeout.value,
                                forceLogout: this.forceLogout.checked
                            }
                        },
                        monitoring: {
                            failedLogins: this.logFailedLogins.checked,
                            ipBlocking: this.ipBlocking.checked,
                            activityAudit: this.activityAudit.checked,
                            securityAlerts: this.securityAlerts.checked,
                            vulnerabilityScan: this.vulnerabilityScan.checked,
                            malwareScan: this.malwareScan.checked
                        }
                    };
                    
                    // Save data
                    tribeData.security = data;
                    
                    // Show preview
                    showPreview('security', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Security Configuration</h4>
                            <p><strong>Authentication:</strong> 
                                ${data.authentication.twoFactor ? '2FA, ' : ''}
                                ${data.authentication.sso ? 'SSO, ' : ''}
                                ${data.authentication.socialAuth ? 'Social Auth' : ''}
                            </p>
                            <p><strong>Protection:</strong> 
                                ${data.protection.ddos ? 'DDoS, ' : ''}
                                ${data.protection.waf ? 'WAF, ' : ''}
                                ${data.protection.rateLimiting ? 'Rate Limiting' : ''}
                            </p>
                            <p><strong>Monitoring:</strong> 
                                ${data.monitoring.activityAudit ? 'Audit, ' : ''}
                                ${data.monitoring.securityAlerts ? 'Alerts, ' : ''}
                                ${data.monitoring.vulnerabilityScan ? 'Vulnerability Scan' : ''}
                            </p>
                        </div>
                    `);
                    markStepCompleted('17');
                };
            }
            break;
            
        case '18':
            const complianceForm = document.getElementById('complianceForm');
            if (complianceForm) {
                complianceForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        dataProtection: {
                            gdpr: this.gdprCompliance.checked,
                            ccpa: this.ccpaCompliance.checked,
                            encryption: this.dataEncryption.checked,
                            retentionPeriod: this.retentionPeriod.value
                        },
                        policies: {
                            privacy: this.privacyPolicy.checked,
                            terms: this.termsService.checked,
                            cookie: this.cookiePolicy.checked,
                            consent: this.consentManagement.checked
                        },
                        monitoring: {
                            accessLogs: this.dataAccessLogs.checked,
                            complianceReports: this.complianceReports.checked,
                            incidentReporting: this.incidentReporting.checked,
                            auditTrails: this.auditTrails.checked,
                            breachNotification: this.dataBreachNotification.checked,
                            regulatoryReporting: this.regulatoryReporting.checked
                        }
                    };
                    
                    // Save data
                    tribeData.compliance = data;
                    
                    // Show preview
                    showPreview('compliance', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Compliance Configuration</h4>
                            <p><strong>Data Protection:</strong> 
                                ${data.dataProtection.gdpr ? 'GDPR, ' : ''}
                                ${data.dataProtection.ccpa ? 'CCPA, ' : ''}
                                ${data.dataProtection.encryption ? 'Encryption' : ''}
                            </p>
                            <p><strong>Policies:</strong> 
                                ${data.policies.privacy ? 'Privacy Policy, ' : ''}
                                ${data.policies.terms ? 'Terms of Service, ' : ''}
                                ${data.policies.cookie ? 'Cookie Policy' : ''}
                            </p>
                            <p><strong>Monitoring:</strong> 
                                ${data.monitoring.accessLogs ? 'Access Logs, ' : ''}
                                ${data.monitoring.auditTrails ? 'Audit Trails, ' : ''}
                                ${data.monitoring.breachNotification ? 'Breach Notifications' : ''}
                            </p>
                        </div>
                    `);
                    markStepCompleted('18');
                };
            }
            break;
            
        case '19':
            // Handle payment processor toggles
            ['Stripe', 'PayPal', 'Crypto'].forEach(processor => {
                document.getElementById(`enable${processor}`)?.addEventListener('change', function() {
                    const settings = document.getElementById(`${processor.toLowerCase()}Settings`);
                    if (this.checked) {
                        settings.classList.remove('d-none');
                    } else {
                        settings.classList.add('d-none');
                    }
                });
            });

            const paymentsForm = document.getElementById('paymentsForm');
            if (paymentsForm) {
                paymentsForm.onsubmit = function(e) {
                    e.preventDefault();
                    
                    const data = {
                        processors: {
                            stripe: {
                                enabled: this.enableStripe.checked
                            },
                            paypal: {
                                enabled: this.enablePayPal.checked
                            },
                            crypto: {
                                enabled: this.enableCrypto.checked
                            }
                        },
                        settings: {
                            autoPayouts: this.autoPayouts.checked,
                            refunds: this.refunds.checked,
                            subscriptions: this.subscriptions.checked,
                            invoicing: this.invoicing.checked,
                            taxCollection: this.taxCollection.checked,
                            paymentReports: this.paymentReports.checked
                        }
                    };
                    
                    // Save data
                    tribeData.payments = data;
                    
                    // Show preview
                    showPreview('payments', `
                        <div class="preview-section mb-4">
                            <h4 class="text-primary mb-3">Payment Configuration</h4>
                            <p><strong>Processors:</strong> 
                                ${data.processors.stripe.enabled ? 'Stripe, ' : ''}
                                ${data.processors.paypal.enabled ? 'PayPal, ' : ''}
                                ${data.processors.crypto.enabled ? 'Crypto' : ''}
                            </p>
                            <p><strong>Features:</strong> 
                                ${data.settings.autoPayouts ? 'Auto Payouts, ' : ''}
                                ${data.settings.subscriptions ? 'Subscriptions, ' : ''}
                                ${data.settings.invoicing ? 'Invoicing' : ''}
                            </p>
                        </div>
                    `);
                    markStepCompleted('19');
                };
            }
            break;
            
        case '20':  // Compliance Settings
            const sectionComplianceForm = document.getElementById('complianceForm');
            if (sectionComplianceForm) {
                sectionComplianceForm.onsubmit = function(e) {
                    e.preventDefault();
                    const data = {
                        jurisdiction: this.jurisdiction.value,
                        requirements: {
                            kyc: this.kyc.checked,
                            gdpr: this.gdpr.checked,
                            dataRetention: this.dataRetention.checked
                        }
                    };
                    tribeData.compliance = data;
                    showPreview();
                    markStepCompleted('20');
                };
            }
            break;

        case '21':  // Agent Configuration
            const sectionAgentForm = document.getElementById('agentForm');
            if (sectionAgentForm) {
                sectionAgentForm.onsubmit = function(e) {
                    e.preventDefault();
                    const data = {
                        name: this.agentName.value,
                        role: this.agentRole.value,
                        description: this.agentDescription.value,
                        capabilities: {
                            chat: this.chatCapability.checked,
                            task: this.taskCapability.checked,
                            content: this.contentCapability.checked
                        }
                    };
                    tribeData.agent = data;
                    showPreview();
                    markStepCompleted('21');
                };
            }
            break;
    }
}

function showPreview() {
    const contentArea = document.querySelector('.preview-panel .card-body');
    let preview = '<h4 class="mb-4">Tribe Configuration</h4>';
    
    // Add sections to preview based on available data
    if (tribeData.basics) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Basic Details</h5>
                <h6>${tribeData.basics.name}</h6>
                <p>${tribeData.basics.description}</p>
            </div>
        `;
    }
    
    if (tribeData.purpose) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Purpose & Goals</h5>
                <p><strong>Purpose:</strong> ${tribeData.purpose.purpose}</p>
                <p><strong>Goals:</strong> ${tribeData.purpose.goals}</p>
            </div>
        `;
    }
    
    if (tribeData.token) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Token Configuration</h5>
                <div class="mb-3">
                    <h6>Basic Details</h6>
                    <p><strong>Name:</strong> ${tribeData.token.basics.name}</p>
                    <p><strong>Symbol:</strong> ${tribeData.token.basics.symbol}</p>
                </div>
                ${tribeData.token.networks.length > 0 ? `
                    <div class="mb-3">
                        <h6>Network Distribution</h6>
                        ${tribeData.token.networks.map(net => `
                            <p><strong>${net.network.toUpperCase()}:</strong> ${net.allocation}% (${net.standard})</p>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="mb-3">
                    <h6>Supply Configuration</h6>
                    <p><strong>Type:</strong> ${tribeData.token.supply.type}</p>
                    <p><strong>Initial Supply:</strong> ${tribeData.token.supply.initial} tokens</p>
                </div>
                ${tribeData.token.tax.enabled ? `
                    <div class="mb-3">
                        <h6>Transaction Tax</h6>
                        <p><strong>Rate:</strong> ${tribeData.token.tax.percentage}%</p>
                        <p><strong>Handling:</strong> ${tribeData.token.tax.handling}</p>
                    </div>
                ` : ''}
                ${tribeData.token.distribution.length > 0 ? `
                    <div class="mb-3">
                        <h6>Token Distribution</h6>
                        ${tribeData.token.distribution.map(dist => `
                            <p><strong>${dist.category}:</strong> ${dist.percentage}% (${dist.vesting})</p>
                        `).join('')}
                    </div>
                ` : ''}
                ${tribeData.token.agents.length > 0 ? `
                    <div class="mb-3">
                        <h6>Agent Allocations</h6>
                        ${tribeData.token.agents.map(agent => `
                            <p><strong>${agent.name}:</strong> ${agent.allocation}%</p>
                            <p class="small text-muted">Wallet: ${agent.wallet}</p>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.logo) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Tribe Logo</h5>
                <img src="${tribeData.logo.logoUrl}" alt="Tribe Logo" style="max-width: 100px; max-height: 100px;" class="mb-2" />
            </div>
        `;
    }
    
    if (tribeData.xProfile) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">X Profiles</h5>
                <div class="mb-3">
                    <h6>Tribe Profile</h6>
                    <p><strong>Handle:</strong> @${tribeData.xProfile.tribe.handle}</p>
                    <p><strong>Auto-Posting:</strong> ${tribeData.xProfile.tribe.autoPost ? 'Enabled' : 'Disabled'}</p>
                    <p><strong>Status:</strong> ${tribeData.xProfile.tribe.verified ? 'Verified' : 'Pending Verification'}</p>
                </div>
                ${tribeData.xProfile.agents.length > 0 ? `
                    <div>
                        <h6>Agent Profiles</h6>
                        ${tribeData.xProfile.agents.map(agent => `
                            <div class="mb-2">
                                <p><strong>${agent.name}:</strong> @${agent.handle}</p>
                                <p class="small text-muted">Auto-Reply: ${agent.autoReply ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.github) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">GitHub Integration</h5>
                <div class="mb-3">
                    <h6>Organization</h6>
                    <p><strong>Name:</strong> ${tribeData.github.organization.name}</p>
                    <p><strong>Authentication:</strong> ${tribeData.github.organization.authType === 'oauth' ? 'OAuth' : 'Personal Access Token'}</p>
                </div>
                <div class="mb-3">
                    <h6>Main Repository</h6>
                    <p><strong>Repository:</strong> ${tribeData.github.organization.name}/${tribeData.github.main.repo}</p>
                    <p><strong>Visibility:</strong> ${tribeData.github.main.visibility}</p>
                    <p><strong>Features:</strong> 
                        ${tribeData.github.main.features.autoCommit ? 'Auto-Commits, ' : ''}
                        ${tribeData.github.main.features.autoPR ? 'Auto PRs, ' : ''}
                        ${tribeData.github.main.features.autoIssues ? 'Issue Tracking, ' : ''}
                        ${tribeData.github.main.features.codeReview ? 'AI Code Review' : ''}
                    </p>
                </div>
                ${tribeData.github.agents.length > 0 ? `
                    <div>
                        <h6>Agent Repositories</h6>
                        ${tribeData.github.agents.map(agent => `
                            <div class="mb-2">
                                <p><strong>${agent.name}:</strong> ${tribeData.github.organization.name}/${agent.repo}</p>
                                <p class="small text-muted">
                                    Access Level: ${agent.access}<br>
                                    Permissions: 
                                    ${agent.permissions.directCommits ? 'Direct Commits, ' : ''}
                                    ${agent.permissions.pullRequests ? 'Pull Requests, ' : ''}
                                    ${agent.permissions.manageIssues ? 'Issue Management' : ''}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.wallet) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Wallet Configuration</h5>
                <div class="mb-3">
                    <h6>Treasury Wallet</h6>
                    <p><strong>Type:</strong> ${tribeData.wallet.treasury.type === 'multisig' ? 'Multi-Signature' : 'Standard'}</p>
                    <p><strong>Network:</strong> ${tribeData.wallet.treasury.network.toUpperCase()}</p>
                    ${tribeData.wallet.treasury.type === 'multisig' ? `
                        <p><strong>Required Signatures:</strong> ${tribeData.wallet.treasury.multisig.requiredSigs}</p>
                        <p><strong>Time-Lock:</strong> ${tribeData.wallet.treasury.multisig.timelock ? 'Enabled' : 'Disabled'}</p>
                    ` : ''}
                    <p><strong>Controls:</strong> 
                        ${tribeData.wallet.treasury.controls.budgets ? 'Agent Budgets, ' : ''}
                        ${tribeData.wallet.treasury.controls.limits ? 'Spending Limits, ' : ''}
                        ${tribeData.wallet.treasury.controls.audit ? 'Audit Trail' : ''}
                    </p>
                </div>
                ${tribeData.wallet.agents.length > 0 ? `
                    <div>
                        <h6>Agent Wallets</h6>
                        ${tribeData.wallet.agents.map(wallet => `
                            <div class="mb-2">
                                <p><strong>${wallet.name}:</strong> ${wallet.type} Wallet</p>
                                <p class="small text-muted">
                                    Daily Limit: $${wallet.dailyLimit}<br>
                                    Permissions: 
                                    ${wallet.permissions.tokenTrading ? 'Token Trading, ' : ''}
                                    ${wallet.permissions.nftTrading ? 'NFT Trading, ' : ''}
                                    ${wallet.permissions.defiOps ? 'DeFi Operations' : ''}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.googleCloud) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Google Cloud Configuration</h5>
                <div class="mb-3">
                    <h6>Project Details</h6>
                    <p><strong>Project Name:</strong> ${tribeData.googleCloud.project.name}</p>
                    <p><strong>Region:</strong> ${tribeData.googleCloud.project.region}</p>
                </div>
                ${tribeData.googleCloud.services.length > 0 ? `
                    <div class="mb-3">
                        <h6>Enabled Services</h6>
                        <p>${tribeData.googleCloud.services.join(', ')}</p>
                    </div>
                ` : ''}
                ${tribeData.googleCloud.agents.length > 0 ? `
                    <div class="mb-3">
                        <h6>Agent Service Access</h6>
                        ${tribeData.googleCloud.agents.map(agent => `
                            <div class="mb-2">
                                <p><strong>${agent.name}:</strong></p>
                                <p class="small text-muted">Services: ${agent.services.join(', ')}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.telegram) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Telegram Community</h5>
                <div class="mb-3">
                    <h6>Public Channel</h6>
                    ${tribeData.telegram.community.channel.name ? `
                        <p><strong>Channel:</strong> @${tribeData.telegram.community.channel.name}</p>
                        <p><strong>Agent Posting:</strong> ${tribeData.telegram.community.channel.agentPosts ? 'Enabled' : 'Disabled'}</p>
                    ` : '<p class="text-muted">No channel configured yet</p>'}
                </div>
                <div class="mb-3">
                    <h6>Private Group</h6>
                    ${tribeData.telegram.community.group.name ? `
                        <p><strong>Group:</strong> @${tribeData.telegram.community.group.name}</p>
                        <p><strong>Member Approval:</strong> ${tribeData.telegram.community.group.requireApproval ? 'Required' : 'Not Required'}</p>
                        <p><strong>Agent Interactions:</strong> ${tribeData.telegram.community.group.agentInteractions ? 'Enabled' : 'Disabled'}</p>
                    ` : '<p class="text-muted">No group configured yet</p>'}
                </div>
                ${tribeData.telegram.agents.length > 0 ? `
                    <div class="mb-3">
                        <h6>Agent Access</h6>
                        ${tribeData.telegram.agents.map(agent => `
                            <div class="mb-2">
                                <p><strong>${agent.name}</strong></p>
                                <p class="small text-muted">
                                    Permissions: ${agent.permissions.join(', ') || 'No permissions set'}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                ${tribeData.telegram.features.length > 0 ? `
                    <div class="mb-3">
                        <h6>Community Features</h6>
                        <p>${tribeData.telegram.features.join(', ')}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.aiApis) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">AI Services Configuration</h5>
                
                <!-- Enabled Providers -->
                <div class="mb-3">
                    <h6>Enabled AI Providers</h6>
                    ${Object.entries(tribeData.aiApis.providers).map(([provider, config]) => `
                        <div class="mb-2">
                            <p><strong>${provider.toUpperCase()}:</strong> ${config.model}</p>
                            <p class="small text-muted">Monthly Budget: $${config.limit}</p>
                        </div>
                    `).join('')}
                </div>

                <!-- Payment Methods -->
                <div class="mb-3">
                    <h6>Payment Configuration</h6>
                    ${tribeData.aiApis.payments.card.enabled ? 
                        `<p><i class="fas fa-credit-card me-2"></i>Credit Card Payment Configured</p>` : ''}
                    ${tribeData.aiApis.payments.crypto.enabled ? `
                        <p><i class="fab fa-bitcoin me-2"></i>Crypto Payment: ${tribeData.aiApis.payments.crypto.currency} 
                        on ${tribeData.aiApis.payments.crypto.network}</p>
                    ` : ''}
                    ${tribeData.aiApis.payments.autoRecharge.enabled ? `
                        <p><i class="fas fa-sync-alt me-2"></i>Auto-recharge: $${tribeData.aiApis.payments.autoRecharge.amount} 
                        at $${tribeData.aiApis.payments.autoRecharge.threshold} threshold</p>
                    ` : ''}
                </div>

                <!-- Agent Access -->
                ${tribeData.aiApis.agents.length > 0 ? `
                    <div class="mb-3">
                        <h6>Agent API Access</h6>
                        ${tribeData.aiApis.agents.map(agent => `
                            <div class="mb-2">
                                <p><strong>${agent.name}</strong></p>
                                <p class="small text-muted">
                                    APIs: ${agent.apis.join(', ')}<br>
                                    Monthly Budget: $${agent.budget}
                                </p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    if (tribeData.pfp) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">NFT Collection</h5>
                <div class="mb-3">
                    <h6>Collection Details</h6>
                    <p><strong>Name:</strong> ${tribeData.pfp.collection.name}</p>
                    <p><strong>Size:</strong> ${tribeData.pfp.collection.size} NFTs</p>
                    <p><strong>Style:</strong> ${tribeData.pfp.style.charAt(0).toUpperCase() + tribeData.pfp.style.slice(1)}</p>
                </div>
                <div class="mb-3">
                    <h6>Generation Method</h6>
                    <p><strong>Type:</strong> ${tribeData.pfp.method === 'ai' ? 'AI Generation' : 'Manual Layers'}</p>
                    ${tribeData.pfp.generation.prompt ? `<p><strong>Style Prompt:</strong> ${tribeData.pfp.generation.prompt}</p>` : ''}
                </div>
                <div class="mb-3">
                    <h6>Networks</h6>
                    <p>${tribeData.pfp.collection.networks.map(net => net.toUpperCase()).join(', ')}</p>
                </div>
            </div>
        `;
    }
    
    if (tribeData.agent) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Agent #1</h5>
                <div class="mb-3">
                    <h6>Basic Details</h6>
                    <p><strong>Name:</strong> ${tribeData.agent.name}</p>
                    <p><strong>Role:</strong> ${tribeData.agent.role}</p>
                    <p><strong>Description:</strong> ${tribeData.agent.description}</p>
                </div>
                <div class="mb-3">
                    <h6>Capabilities</h6>
                    <p>${tribeData.agent.capabilities.join(', ')}</p>
                </div>
                <div class="mb-3">
                    <h6>Permissions</h6>
                    <p>${tribeData.agent.permissions.join(', ')}</p>
                </div>
            </div>
        `;
    }

    if (tribeData.leader) {
        preview += `
            <div class="preview-section mb-4 pb-3 border-bottom">
                <h5 class="text-primary">Leader Agent</h5>
                <div class="mb-3">
                    <h6>Basic Details</h6>
                    <p><strong>Name:</strong> ${tribeData.leader.name}</p>
                    <p><strong>Leadership Style:</strong> ${tribeData.leader.style}</p>
                    <p><strong>Mission:</strong> ${tribeData.leader.mission}</p>
                </div>
                <div class="mb-3">
                    <h6>Advanced Capabilities</h6>
                    <p>${tribeData.leader.capabilities.join(', ')}</p>
                </div>
                <div class="mb-3">
                    <h6>Oversight Permissions</h6>
                    <p>${tribeData.leader.permissions.join(', ')}</p>
                </div>
            </div>
        `;
    }
    
    contentArea.innerHTML = preview;
}

function getSectionName(number) {
    const sections = {
        '01': 'name',
        '02': 'purpose',
        '03': 'token',
        '04': 'logo',
        '05': 'x-profile',
        '06': 'github',
        '07': 'wallet',
        '08': 'google-cloud',
        '09': 'telegram',
        '10': 'domain',
        '11': 'ai-apis',
        '12': 'pfp',
        '13': 'facebook',
        '14': 'instagram',
        '15': 'discord',
        '16': 'analytics',
        '17': 'notifications',
        '18': 'backup',
        '19': 'security',
        '20': 'compliance',
        '21': 'agent',
        '22': 'payments'
    };
    return sections[number] || 'unknown';
}

function generateRandomTribe() {
    // Random tribe names and descriptions
    const tribeNames = [
        "Digital Nomads DAO", "AI Builders Collective", "Web3 Pioneers", 
        "Future Labs DAO", "Meta Builders Society", "Quantum Tribe",
        "Cyber Syndicate", "Neural Network Guild", "Data Wizards DAO"
    ];
    
    const tribeDescriptions = [
        "Building the future of decentralized AI communities",
        "Empowering AI agents to create value in the digital economy",
        "Pioneering the intersection of AI and blockchain technology",
        "Creating autonomous digital ecosystems for the next generation",
        "Revolutionizing how AI agents collaborate and create value"
    ];

    // Random purposes and goals
    const tribePurposes = [
        "To create a self-sustaining ecosystem of AI agents",
        "To bridge human creativity with artificial intelligence",
        "To build the infrastructure for autonomous AI communities",
        "To pioneer new forms of human-AI collaboration",
        "To develop cutting-edge AI solutions for Web3"
    ];

    const tribeGoals = [
        "Launch AI-powered products, Build community, Scale operations",
        "Develop AI tools, Grow token value, Expand ecosystem",
        "Create revenue streams, Foster innovation, Build partnerships",
        "Scale technology, Increase adoption, Generate value",
        "Research AI systems, Deploy solutions, Grow community"
    ];

    // Random token configurations
    const tokenNames = ["AIX", "TRIBE", "NEURAL", "SYNTH", "META", "CYBER"];
    const tokenSymbols = ["AIX", "TRB", "NRL", "SYN", "MTA", "CYB"];
    const tokenSupplies = ["1000000", "10000000", "100000000", "50000000", "25000000"];

    // Random X Profile configurations
    const xHandles = [
        "AItribeDAO", "TribeNetwork", "AIbuilders", 
        "TribeProtocol", "AIcollective", "Web3tribe"
    ];

    // Generate random logo (placeholder URL)
    const logoUrls = [
        "https://via.placeholder.com/150/4A90E2/FFFFFF?text=AI+TRIBE",
        "https://via.placeholder.com/150/2ECC71/FFFFFF?text=DAO",
        "https://via.placeholder.com/150/E74C3C/FFFFFF?text=WEB3",
        "https://via.placeholder.com/150/9B59B6/FFFFFF?text=META",
        "https://via.placeholder.com/150/F1C40F/FFFFFF?text=TRIBE"
    ];

    // Helper function to get random item from array
    const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    // Generate data for each section
    tribeData.basics = {
        name: randomItem(tribeNames),
        description: randomItem(tribeDescriptions)
    };

    tribeData.purpose = {
        purpose: randomItem(tribePurposes),
        goals: randomItem(tribeGoals)
    };

    tribeData.token = {
        basics: {
            name: randomItem(tokenNames),
            symbol: randomItem(tokenSymbols)
        },
        supply: {
            type: 'fixed',
            initial: randomItem(tokenSupplies)
        },
        networks: [
            {
                network: 'bsv',
                standard: 'stas',
                allocation: '40'
            },
            {
                network: 'eth',
                standard: 'erc20',
                allocation: '30'
            },
            {
                network: 'sol',
                standard: 'spl',
                allocation: '30'
            }
        ],
        tax: {
            enabled: Math.random() > 0.5,
            percentage: '5',
            handling: 'treasury'
        }
    };

    tribeData.logo = {
        logoUrl: randomItem(logoUrls)
    };

    tribeData.xProfile = {
        tribe: {
            handle: randomItem(xHandles),
            autoPost: true,
            verified: false
        },
        agents: [
            {
                name: "Content Agent",
                handle: "tribe_content_ai",
                autoReply: true
            },
            {
                name: "Support Agent",
                handle: "tribe_support_ai",
                autoReply: true
            }
        ]
    };

    // Update preview
    showPreview();
}

function generateRandomTraits() {
    const traits = {
        backgrounds: [
            "cyberpunk city",
            "quantum realm",
            "digital void",
            "neural network",
            "data stream"
        ],
        characters: [
            "android",
            "cyborg",
            "AI entity",
            "digital spirit",
            "data being"
        ],
        accessories: [
            "neon halo",
            "holographic wings",
            "data crystals",
            "quantum particles",
            "neural implants"
        ],
        colors: [
            "neon blue and purple",
            "matrix green and black",
            "cyber pink and gold",
            "quantum blue and silver",
            "digital red and white"
        ]
    };

    // Helper function to get random item from array
    const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    return {
        background: randomItem(traits.backgrounds),
        character: randomItem(traits.characters),
        accessory: randomItem(traits.accessories),
        colors: randomItem(traits.colors)
    };
}

// Add a "Generate Random" button
window.generateRandomTraits = function() {
    const traits = generateRandomTraits();
    const prompt = `Create a ${traits.character} with ${traits.accessory} in a ${traits.background} setting using ${traits.colors} color scheme`;
    
    // Update the prompt textarea
    document.querySelector('#aiOptions textarea').value = prompt;
    
    // Trigger sample generation
    generateSamples();
}; 

// Team Management Functions
function initializeTeamManagement() {
    const searchInput = document.getElementById('searchUser');
    const searchResults = document.getElementById('searchResults');
    const humanMembersList = document.getElementById('humanMembersList');
    const aiAgentsList = document.getElementById('aiAgentsList');

    // Example team data structure
    const teamData = {
        humans: [],
        agents: []
    };

    // Search users as you type
    searchInput?.addEventListener('input', debounce(async function() {
        const query = this.value.trim();
        if (query.length < 2) return;

        try {
            // TODO: Replace with actual API call
            const results = await searchUsers(query);
            displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    }, 300));

    // Add member to team
    function addTeamMember(member) {
        const memberElement = createMemberElement(member);
        
        if (member.type === 'human') {
            teamData.humans.push(member);
            humanMembersList.appendChild(memberElement);
        } else {
            teamData.agents.push(member);
            aiAgentsList.appendChild(memberElement);
        }

        // Save team data
        localStorage.setItem('teamData', JSON.stringify(teamData));
    }

    // Create member element
    function createMemberElement(member) {
        const div = document.createElement('div');
        div.className = 'list-group-item d-flex align-items-center justify-content-between';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${member.avatar}" class="rounded-circle me-3" width="40" height="40">
                <div>
                    <h6 class="mb-0">${member.name}</h6>
                    <small class="text-muted">${member.role || 'Team Member'}</small>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-outline-secondary btn-sm" onclick="editMember('${member.id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="removeMember('${member.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }

    // Load saved team data
    const savedTeamData = JSON.parse(localStorage.getItem('teamData') || '{"humans":[],"agents":[]}');
    savedTeamData.humans.forEach(member => addTeamMember({...member, type: 'human'}));
    savedTeamData.agents.forEach(member => addTeamMember({...member, type: 'agent'}));
}

// Initialize team management when the team tab is shown
document.querySelector('a[href="#team"]')?.addEventListener('click', function() {
    initializeTeamManagement();
});

// Add this function to handle switching to Create New Tribe tab
function switchToCreateTribe() {
    // Find the "Create New Tribe" nav link and click it
    const createTribeTab = document.querySelector('a[href="#create-tribe"]');
    if (createTribeTab) {
        const tab = new bootstrap.Tab(createTribeTab);
        tab.show();
        
        // Scroll to top if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Also update the nav link to use the same function
document.addEventListener('DOMContentLoaded', function() {
    const createTribeNavLink = document.querySelector('a[href="#create-tribe"]');
    if (createTribeNavLink) {
        createTribeNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchToCreateTribe();
        });
    }
});

function getAIAssistance() {
    // Show loading state
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating suggestions...';

    // Get context from form if available
    const category = document.querySelector('select[name="category"]')?.value;
    const stage = document.querySelector('select[name="tribeType"]')?.value;

    // Example AI prompt
    const prompt = `Help me define a compelling purpose and value proposition for a ${stage || ''} 
        tribe in the ${category || ''} space. Consider market opportunities, growth potential, 
        and unique value creation.`;

    // TODO: Replace with actual AI API call
    setTimeout(() => {
        // Simulate AI response
        const suggestions = {
            mission: "Example mission based on your inputs...",
            vision: "Example vision statement...",
            objectives: [
                "Objective 1...",
                "Objective 2...",
                "Objective 3..."
            ],
            valueProps: [
                "Value proposition 1...",
                "Value proposition 2..."
            ]
        };

        // Populate form with suggestions
        populateFormWithSuggestions(suggestions);

        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;

        // Show success message
        showToast('success', 'AI Suggestions Generated', 
            'Review and customize the suggestions to match your vision');
    }, 1500);
}

function populateFormWithSuggestions(suggestions) {
    // Populate form fields with AI suggestions
    document.querySelector('textarea[name="mission"]').value = suggestions.mission;
    document.querySelector('textarea[name="vision"]').value = suggestions.vision;
    
    // Add objectives
    suggestions.objectives.forEach(objective => {
        addObjective(objective);
    });
}

function suggestFocusAreas() {
    // Get the current vision text
    const vision = document.querySelector('textarea[name="mission"]').value;
    
    // TODO: Use AI to analyze vision and suggest relevant focus areas
    // For now, simulate AI response
    setTimeout(() => {
        const input = document.querySelector('input[name="focusAreas"]');
        const suggestions = "AI, Social Impact, Creator Economy";  // This would come from AI
        
        // Show a tooltip or modal with suggestions
        if (confirm(`Suggested areas based on your vision:\n${suggestions}\n\nApply these suggestions?`)) {
            input.value = suggestions;
        }
    }, 500);
}

function updateDistributionInputs() {
    const networks = document.querySelectorAll('input[name="networks"]');
    const distributionInputs = document.querySelectorAll('[name$="-distribution"]');
    
    // Count checked networks
    const checkedCount = Array.from(networks).filter(n => n.checked).length;
    
    // Enable/disable and set default values
    distributionInputs.forEach(input => {
        const networkCheckbox = input.closest('.form-check').querySelector('input[name="networks"]');
        input.disabled = !networkCheckbox.checked;
        
        if (networkCheckbox.checked) {
            input.value = Math.floor(100 / checkedCount);
        } else {
            input.value = 0;
        }
    });
    
    validateDistribution();
}

function validateDistribution() {
    const distributionInputs = document.querySelectorAll('[name$="-distribution"]:not([disabled])');
    const totalSpan = document.getElementById('distributionTotal');
    
    let total = 0;
    distributionInputs.forEach(input => {
        total += parseInt(input.value) || 0;
    });
    
    totalSpan.textContent = total + '%';
    const isValid = total === 100;
    
    totalSpan.classList.toggle('text-danger', !isValid);
    totalSpan.classList.toggle('text-success', isValid);
    
    // Disable form submission if distribution is invalid
    const submitButton = document.querySelector('#tokenForm button[type="submit"]');
    submitButton.disabled = !isValid;
    
    return isValid;
}

// Add to existing form submission handler
document.getElementById('tokenForm')?.addEventListener('submit', function(e) {
    if (!validateDistribution()) {
        e.preventDefault();
        alert('Please ensure token distribution across chains totals 100%');
    }
});

function toggleTreasuryConfig(value) {
    const treasuryConfig = document.getElementById('treasuryConfig');
    const burnWarning = document.getElementById('burnWarning');
    
    treasuryConfig.classList.toggle('d-none', value !== 'treasury');
    burnWarning.classList.toggle('d-none', value !== 'burn');
}

function addSigner() {
    const signersList = document.getElementById('signersList');
    const newSigner = document.createElement('div');
    newSigner.className = 'input-group mb-2';
    newSigner.innerHTML = `
        <input type="text" class="form-control" name="signers[]" 
            placeholder="Enter signer wallet address">
        <button type="button" class="btn btn-outline-danger" onclick="this.parentElement.remove()">
            <i class="fas fa-minus"></i>
        </button>
    `;
    signersList.appendChild(newSigner);
}

// Add validation for burn rate
document.querySelector('input[name="transactionFee"]')?.addEventListener('change', function() {
    const feeDistribution = document.querySelector('select[name="feeDistribution"]').value;
    if (feeDistribution === 'burn' && this.value > 5) {
        alert('Warning: High burn rates (>5%) may lead to token illiquidity issues.');
    }
});

// Theme and branding functions
function previewTheme(themeName) {
    // Remove existing theme classes
    document.body.classList.remove('theme-modern-blue', 'theme-cyber-neon');
    // Add new theme class
    document.body.classList.add(`theme-${themeName}`);
    
    // Update color pickers to match theme
    const themes = {
        'modern-blue': {
            primary: '#0066ff',
            secondary: '#2d3748',
            accent: '#00d4ff'
        },
        'cyber-neon': {
            primary: '#00ff9d',
            secondary: '#0d1117',
            accent: '#ff00ff'
        }
    };
    
    const colors = themes[themeName];
    document.getElementById('primaryColor').value = colors.primary;
    document.getElementById('secondaryColor').value = colors.secondary;
    document.getElementById('accentColor').value = colors.accent;
}

function updateCustomTheme() {
    const primary = document.getElementById('primaryColor').value;
    const secondary = document.getElementById('secondaryColor').value;
    const accent = document.getElementById('accentColor').value;
    
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--accent-color', accent);
}

function updateFonts() {
    const headingFont = document.getElementById('headingFont').value;
    const bodyFont = document.getElementById('bodyFont').value;
    
    document.documentElement.style.setProperty('--heading-font', headingFont);
    document.documentElement.style.setProperty('--body-font', bodyFont);
    
    // Update previews
    document.getElementById('headingPreview').style.fontFamily = headingFont;
    document.getElementById('bodyPreview').style.fontFamily = bodyFont;
}

function addStyleToPrompt(style) {
    const prompt = document.getElementById('logoPrompt');
    const currentText = prompt.value;
    prompt.value = currentText + (currentText ? ', ' : '') + style;
}

async function generateAILogo() {
    const prompt = document.getElementById('logoPrompt').value;
    const useThemeColors = document.getElementById('matchThemeColors').checked;
    const container = document.getElementById('aiGeneratedLogos');
    const btn = document.getElementById('generateLogoBtn');
    
    // Get current theme colors if needed
    const themeColors = useThemeColors ? {
        primary: document.documentElement.style.getPropertyValue('--primary-color'),
        secondary: document.documentElement.style.getPropertyValue('--secondary-color'),
        accent: document.documentElement.style.getPropertyValue('--accent-color')
    } : null;
    
    // Show loading state
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
    container.innerHTML = '<div class="col-12 text-center"><div class="spinner-border"></div></div>';
    
    try {
        // TODO: Replace with actual AI API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate 4 generated options
        container.innerHTML = Array(4).fill(0).map((_, i) => `
            <div class="col-6 mb-3">
                <div class="card h-100">
                    <img src="path/to/generated-logo-${i+1}.png" class="card-img-top p-3" 
                        style="cursor: pointer" onclick="selectAILogo(this.src)">
                    <div class="card-footer">
                        <button class="btn btn-sm btn-outline-primary w-100" onclick="regenerateVariation(${i+1})">
                            <i class="fas fa-sync-alt me-1"></i>Variation
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="alert alert-danger">Generation failed. Please try again.</div>';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-wand-magic-sparkles me-2"></i>Generate Logo';
    }
}

function selectAILogo(src) {
    document.getElementById('logoPreview').src = src;
    // Optionally show a success message
    showToast('success', 'Logo Selected', 'Click Save & Continue to keep this logo');
}

function regenerateVariation(index) {
    // TODO: Implement variation generation
    showToast('info', 'Generating Variation', 'Creating a new version of this design...');
}

// Add CSS for themes
const style = document.createElement('style');
style.textContent = `
    .theme-modern-blue {
        --primary-color: #0066ff;
        --secondary-color: #2d3748;
        --accent-color: #00d4ff;
    }
    
    .theme-cyber-neon {
        --primary-color: #00ff9d;
        --secondary-color: #0d1117;
        --accent-color: #ff00ff;
    }
    
    .theme-option {
        cursor: pointer;
        padding: 10px;
        border-radius: 8px;
        border: 2px solid transparent;
    }
    
    .theme-option:hover {
        border-color: var(--primary-color);
    }
    
    .color-preview {
        height: 60px;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        margin-bottom: 5px;
    }
    
    .color-strip {
        flex: 1;
    }
`;

document.head.appendChild(style);

// Add these functions to handle file uploads
function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndPreviewImage(file, 'logoPreview', {
            maxSize: 5 * 1024 * 1024, // 5MB
            aspectRatio: 1, // Square
            minWidth: 200
        });
    }
}

function handleBannerUpload(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndPreviewImage(file, 'bannerPreview', {
            maxSize: 10 * 1024 * 1024, // 10MB
            aspectRatio: 3/1, // Banner ratio
            minWidth: 1200
        });
    }
}

function validateAndPreviewImage(file, previewId, options) {
    if (!file.type.startsWith('image/')) {
        showToast('error', 'Invalid File', 'Please upload an image file');
        return;
    }
    
    if (file.size > options.maxSize) {
        showToast('error', 'File Too Large', `Please upload an image smaller than ${options.maxSize/1024/1024}MB`);
        return;
    }

    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        img.src = e.target.result;
        img.onload = function() {
            if (img.width < options.minWidth) {
                showToast('error', 'Image Too Small', `Image should be at least ${options.minWidth}px wide`);
                return;
            }
            document.getElementById(previewId).src = e.target.result;
        };
    };
    reader.readAsDataURL(file);
}

async function generateAIBanner() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

    try {
        // TODO: Replace with actual AI API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate banner generation
        const bannerPreview = document.getElementById('bannerPreview');
        bannerPreview.src = 'path/to/generated-banner.png'; // Replace with actual generated banner
        
        showToast('success', 'Banner Generated', 'Click Save & Continue to keep this banner');
    } catch (error) {
        showToast('error', 'Generation Failed', 'Please try again');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function generateRandomBranding() {
    // Random theme selection
    const themes = ['modern-blue', 'cyber-neon', 'dark-matter', 'forest', 'ocean', 'sunset'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    previewTheme(randomTheme);
    
    // Random fonts
    const headingFonts = Array.from(document.getElementById('headingFont').options);
    const bodyFonts = Array.from(document.getElementById('bodyFont').options);
    
    document.getElementById('headingFont').value = headingFonts[Math.floor(Math.random() * headingFonts.length)].value;
    document.getElementById('bodyFont').value = bodyFonts[Math.floor(Math.random() * bodyFonts.length)].value;
    updateFonts();
}

function saveBranding() {
    // Collect all branding data
    const brandingData = {
        logo: document.getElementById('logoPreview').src,
        banner: document.getElementById('bannerPreview').src,
        theme: {
            primary: document.getElementById('primaryColor').value,
            secondary: document.getElementById('secondaryColor').value,
            accent: document.getElementById('accentColor').value
        },
        typography: {
            headingFont: document.getElementById('headingFont').value,
            bodyFont: document.getElementById('bodyFont').value
        }
    };

    // Save to local storage or your backend
    localStorage.setItem('tribeBranding', JSON.stringify(brandingData));
    
    // Mark step as completed
    markStepCompleted('04');
    
    showToast('success', 'Branding Saved', 'Your tribe branding has been saved successfully');
}

// Update the themes object to include all new themes
const themes = {
    'modern-blue': {
        primary: '#0066ff',
        secondary: '#2d3748',
        accent: '#00d4ff'
    },
    'cyber-neon': {
        primary: '#00ff9d',
        secondary: '#0d1117',
        accent: '#ff00ff'
    },
    'dark-matter': {
        primary: '#1a1a1a',
        secondary: '#333333',
        accent: '#ff3366'
    },
    'forest': {
        primary: '#2ecc71',
        secondary: '#27ae60',
        accent: '#f1c40f'
    },
    'ocean': {
        primary: '#3498db',
        secondary: '#2980b9',
        accent: '#1abc9c'
    },
    'sunset': {
        primary: '#e74c3c',
        secondary: '#d35400',
        accent: '#f39c12'
    }
};