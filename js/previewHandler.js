// Store tribe data
let tribeData = {
    name: '',
    description: '',
    leader: {
        name: '',
        style: '',
        traits: []
    },
    members: [],
    social: {}
};

// Update preview based on section and input changes
function updatePreview(sectionId) {
    const previewPanel = document.getElementById('previewPanel');
    if (!previewPanel) return;

    // Update data based on current section
    updateDataFromInputs(sectionId);

    // Render preview
    previewPanel.innerHTML = `
        <div class="preview-content">
            ${renderTribeInfo()}
            ${renderLeaderInfo()}
            ${renderMembersInfo()}
            ${renderSocialInfo()}
        </div>
    `;
}

// Update data from inputs
function updateDataFromInputs(sectionId) {
    switch(sectionId) {
        case 'nameSection':
            tribeData.name = document.getElementById('tribeName')?.value || '';
            tribeData.description = document.getElementById('tribeDescription')?.value || '';
            break;
            
        case 'leaderSection':
            const leaderName = document.querySelector('#leaderSection input[name="leaderName"]')?.value;
            const leaderStyle = document.querySelector('#leaderSection select[name="leaderStyle"]')?.value;
            if (leaderName) tribeData.leader.name = leaderName;
            if (leaderStyle) tribeData.leader.style = leaderStyle;
            break;
            
        case 'membersSection':
            // Update members data
            break;
            
        case 'socialSection':
            // Update social data
            break;
    }
}

// Render functions for each section
function renderTribeInfo() {
    return `
        <div class="preview-tribe-info">
            <h6>${tribeData.name || 'Your Tribe Name'}</h6>
            <p class="text-muted small">${tribeData.description || 'Add a description for your tribe'}</p>
        </div>
    `;
}

function renderLeaderInfo() {
    if (!tribeData.leader.name) return '';
    return `
        <div class="preview-leader mt-3">
            <h6 class="text-primary"><i class="fas fa-crown"></i> Leader</h6>
            <p class="small mb-1">${tribeData.leader.name}</p>
            ${tribeData.leader.style ? `<p class="text-muted smaller">${tribeData.leader.style}</p>` : ''}
        </div>
    `;
}

function renderMembersInfo() {
    if (!tribeData.members.length) return '';
    return `
        <div class="preview-members mt-3">
            <h6 class="text-primary"><i class="fas fa-users"></i> Members</h6>
            ${tribeData.members.map(member => `
                <div class="member-item small">
                    <i class="fas fa-user"></i> ${member.name}
                    ${member.role ? `<span class="badge bg-secondary ms-2">${member.role}</span>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderSocialInfo() {
    if (!Object.keys(tribeData.social).length) return '';
    return `
        <div class="preview-social mt-3">
            <h6 class="text-primary"><i class="fas fa-share-alt"></i> Social Presence</h6>
            ${Object.entries(tribeData.social).map(([platform, handle]) => `
                <div class="social-item small">
                    <i class="fab fa-${platform}"></i> ${handle}
                </div>
            `).join('')}
        </div>
    `;
}

// Add input event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Listen for all input changes
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
            const section = input.closest('.setup-section');
            if (section) {
                updatePreview(section.id);
            }
        });
    });
}); 