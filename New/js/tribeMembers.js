// AI Member Management
const aiMemberTemplate = `
    <div class="card mb-3 ai-member">
        <div class="card-header d-flex justify-content-between align-items-center">
            <input type="text" class="form-control form-control-sm w-auto" placeholder="AI Name">
            <button class="btn btn-sm btn-outline-danger" onclick="removeAIMember(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="card-body">
            <div class="mb-3">
                <label class="form-label">Role/Specialty</label>
                <select class="form-select" onchange="updateRoleDescription(this)">
                    <option value="">Select a role...</option>
                    <option value="content">Content Creator</option>
                    <option value="research">Researcher</option>
                    <option value="community">Community Manager</option>
                    <option value="support">Support Agent</option>
                    <option value="custom">Custom Role</option>
                </select>
                <small class="text-muted role-description"></small>
            </div>
            <div class="mb-3">
                <label class="form-label">Personality Traits</label>
                <div class="personality-traits">
                    <div class="trait-chips">
                        <span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">Professional</span>
                        <span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">Friendly</span>
                        <span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">Technical</span>
                        <span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">Creative</span>
                        <span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">Analytical</span>
                    </div>
                    <input type="text" class="form-control mt-2" placeholder="Add custom traits...">
                </div>
            </div>
            <div class="social-connections">
                <h6>Social Media Presence</h6>
                <div class="social-platforms">
                    <div class="social-item mb-2">
                        <i class="fab fa-twitter"></i>
                        <input type="text" class="form-control" placeholder="Twitter Handle">
                        <select class="form-select ms-2 w-auto">
                            <option>Casual Tweeter</option>
                            <option>News Curator</option>
                            <option>Thought Leader</option>
                        </select>
                    </div>
                    <div class="social-item mb-2">
                        <i class="fab fa-discord"></i>
                        <input type="text" class="form-control" placeholder="Discord Username">
                        <select class="form-select ms-2 w-auto">
                            <option>Community Helper</option>
                            <option>Moderator</option>
                            <option>Expert Advisor</option>
                        </select>
                    </div>
                    <button class="btn btn-outline-primary btn-sm mt-2" onclick="addSocialPlatform(this)">
                        <i class="fas fa-plus"></i> Add Platform
                    </button>
                </div>
            </div>
            <div class="ai-capabilities mt-3">
                <h6>AI Capabilities</h6>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="capability1">
                    <label class="form-check-label" for="capability1">
                        Natural Language Processing
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="capability2">
                    <label class="form-check-label" for="capability2">
                        Content Generation
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="capability3">
                    <label class="form-check-label" for="capability3">
                        Data Analysis
                    </label>
                </div>
            </div>
        </div>
    </div>
`;

// Role descriptions for different AI member types
const roleDescriptions = {
    content: "Creates and curates engaging content across platforms",
    research: "Analyzes data and provides insights for the tribe",
    community: "Manages community interactions and engagement",
    support: "Provides assistance and answers questions",
    custom: "Define a custom role for this AI member"
};

function addNewAIMember() {
    const aiMembersList = document.getElementById('aiMembersList');
    const newMember = document.createElement('div');
    newMember.innerHTML = aiMemberTemplate;
    aiMembersList.appendChild(newMember.firstElementChild);
}

function removeAIMember(button) {
    button.closest('.ai-member').remove();
}

function updateRoleDescription(select) {
    const description = roleDescriptions[select.value] || '';
    select.nextElementSibling.textContent = description;
}

function toggleTrait(trait) {
    trait.classList.toggle('bg-primary');
    trait.classList.toggle('text-white');
    trait.classList.toggle('bg-light');
    trait.classList.toggle('text-dark');
}

function addSocialPlatform(button) {
    const platforms = {
        linkedin: { icon: 'linkedin', placeholder: 'LinkedIn Profile', roles: ['Professional', 'Thought Leader', 'Industry Expert'] },
        medium: { icon: 'medium', placeholder: 'Medium Username', roles: ['Writer', 'Publisher', 'Editor'] },
        github: { icon: 'github', placeholder: 'GitHub Username', roles: ['Developer', 'Contributor', 'Maintainer'] }
    };

    const socialConnections = button.closest('.social-platforms');
    const platformSelect = document.createElement('div');
    platformSelect.className = 'platform-select mb-2';
    platformSelect.innerHTML = `
        <select class="form-select" onchange="setupNewPlatform(this)">
            <option value="">Select platform...</option>
            ${Object.keys(platforms).map(p => `<option value="${p}">${p.charAt(0).toUpperCase() + p.slice(1)}</option>`).join('')}
        </select>
    `;
    
    button.parentElement.insertBefore(platformSelect, button);
}

function setupNewPlatform(select) {
    if (!select.value) return;
    
    const platform = select.value;
    const platformDiv = document.createElement('div');
    platformDiv.className = 'social-item mb-2';
    platformDiv.innerHTML = `
        <i class="fab fa-${platform}"></i>
        <input type="text" class="form-control" placeholder="${platform.charAt(0).toUpperCase() + platform.slice(1)} Username">
        <button class="btn btn-outline-danger btn-sm ms-2" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    select.parentElement.replaceWith(platformDiv);
} 