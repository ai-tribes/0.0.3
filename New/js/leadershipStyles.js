const leadershipStyles = {
    visionary: {
        description: "A forward-thinking leader that inspires and guides the tribe towards innovation",
        traits: ["Innovative", "Inspiring", "Strategic", "Big Picture Thinker"],
        memberRoles: ["Researcher", "Content Creator", "Trend Analyst", "Innovation Scout"],
        interactionStyle: "Focuses on future possibilities and motivates members to explore new ideas"
    },
    democratic: {
        description: "Encourages participation and collective decision-making within the tribe",
        traits: ["Collaborative", "Inclusive", "Open-minded", "Facilitator"],
        memberRoles: ["Community Manager", "Consensus Builder", "Feedback Analyst", "Mediator"],
        interactionStyle: "Promotes discussion and values input from all tribe members"
    },
    coaching: {
        description: "Develops tribe members' capabilities and helps them reach their potential",
        traits: ["Supportive", "Patient", "Empowering", "Development-focused"],
        memberRoles: ["Mentor", "Skill Trainer", "Progress Tracker", "Resource Curator"],
        interactionStyle: "Provides guidance and helps members grow their abilities"
    },
    analytical: {
        description: "Makes decisions based on data and systematic analysis",
        traits: ["Logical", "Detail-oriented", "Methodical", "Objective"],
        memberRoles: ["Data Analyst", "Quality Controller", "Systems Optimizer", "Performance Monitor"],
        interactionStyle: "Uses data-driven approaches and clear metrics for decisions"
    }
};

function updateLeadershipStyle(select) {
    const style = leadershipStyles[select.value];
    if (!style) return;

    // Update description
    select.nextElementSibling.textContent = style.description;

    // Update suggested traits
    const traitChips = document.querySelector('.trait-chips');
    traitChips.innerHTML = style.traits.map(trait => 
        `<span class="badge bg-light text-dark me-2 mb-2" onclick="toggleTrait(this)">${trait}</span>`
    ).join('');

    // Update available member roles
    updateAvailableMemberRoles(style.memberRoles);

    // Show interaction pattern
    showInteractionPattern(style.interactionStyle);
}

function updateAvailableMemberRoles(roles) {
    const memberRolesSelect = document.querySelectorAll('.ai-member select[name="role"]');
    memberRolesSelect.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = `
            <option value="">Select a role...</option>
            ${roles.map(role => `
                <option value="${role.toLowerCase().replace(/\s+/g, '-')}" 
                        ${currentValue === role ? 'selected' : ''}>
                    ${role}
                </option>
            `).join('')}
            <option value="custom">Custom Role</option>
        `;
    });
}

function showInteractionPattern(pattern) {
    const interactionDiv = document.querySelector('.interaction-pattern');
    if (!interactionDiv) {
        const newDiv = document.createElement('div');
        newDiv.className = 'interaction-pattern mt-3';
        newDiv.innerHTML = `
            <h6><i class="fas fa-exchange-alt"></i> Interaction Pattern</h6>
            <p class="text-muted small">${pattern}</p>
        `;
        document.querySelector('.tribe-leader .card-body').appendChild(newDiv);
    } else {
        interactionDiv.querySelector('p').textContent = pattern;
    }
}

// Add this to the AI member template
function getAIMemberTemplate(leaderStyle) {
    const style = leadershipStyles[leaderStyle] || leadershipStyles.visionary;
    return `
        <div class="card mb-3 ai-member">
            <!-- Previous header content -->
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Role</label>
                    <select class="form-select" name="role" onchange="updateMemberRole(this)">
                        <option value="">Select a role...</option>
                        ${style.memberRoles.map(role => `
                            <option value="${role.toLowerCase().replace(/\s+/g, '-')}">${role}</option>
                        `).join('')}
                        <option value="custom">Custom Role</option>
                    </select>
                </div>
                <div class="mb-3 role-relationship">
                    <label class="form-label">Relationship to Leader</label>
                    <select class="form-select" name="relationship">
                        <option value="direct">Direct Report</option>
                        <option value="specialist">Specialist Advisor</option>
                        <option value="support">Support Staff</option>
                    </select>
                </div>
                <!-- Rest of the member configuration -->
            </div>
        </div>
    `;
} 