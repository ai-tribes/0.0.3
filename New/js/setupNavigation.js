// Track current section and setup flow
const setupSections = ['tribeName', 'tribeLeader', 'tribeMembers', 'socialSetup'];
let currentSectionIndex = 0;

// Section validation rules
const sectionValidation = {
    tribeName: () => {
        const name = document.querySelector('#tribeName input[type="text"]').value;
        const description = document.querySelector('#tribeName textarea').value;
        return name.length >= 3 && description.length >= 10;
    },
    tribeLeader: () => {
        const leaderName = document.querySelector('#tribeLeader input[placeholder="Name your AI leader"]').value;
        const leaderStyle = document.querySelector('#tribeLeader select').value;
        return leaderName.length >= 2 && leaderStyle !== '';
    },
    tribeMembers: () => {
        // At least one member is required
        const members = document.querySelectorAll('.ai-member');
        return members.length > 0;
    },
    socialSetup: () => true // Optional section
};

// Section completion tracking
const sectionProgress = {
    tribeName: false,
    tribeLeader: false,
    tribeMembers: false,
    socialSetup: false
};

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.setup-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';

    // Update buttons
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(sectionId)) {
            btn.classList.add('active');
        }
    });

    // Update current section index
    currentSectionIndex = setupSections.indexOf(sectionId);
    updateNavigationButtons();
    updateProgress();
}

function nextSection() {
    // Validate current section
    const currentSection = setupSections[currentSectionIndex];
    if (!validateSection(currentSection)) {
        showValidationError(currentSection);
        return;
    }

    // Mark section as complete
    sectionProgress[currentSection] = true;
    
    // Move to next section
    if (currentSectionIndex < setupSections.length - 1) {
        currentSectionIndex++;
        showSection(setupSections[currentSectionIndex]);
    }
}

function previousSection() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        showSection(setupSections[currentSectionIndex]);
    }
}

function validateSection(sectionId) {
    return sectionValidation[sectionId]();
}

function showValidationError(sectionId) {
    const errorMessages = {
        tribeName: "Please enter a tribe name (min 3 chars) and description (min 10 chars)",
        tribeLeader: "Please configure your tribe leader with a name and leadership style",
        tribeMembers: "Add at least one AI member to your tribe",
        socialSetup: "Configure social media integration"
    };

    // Show error toast or alert
    const toast = new bootstrap.Toast(document.createElement('div'));
    toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
            <strong class="me-auto">Validation Error</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${errorMessages[sectionId]}
        </div>
    `;
    document.body.appendChild(toast._element);
    toast.show();
}

function updateProgress() {
    const progress = document.querySelector('.progress-bar');
    const completedSections = Object.values(sectionProgress).filter(Boolean).length;
    const percentage = (completedSections / setupSections.length) * 100;
    
    progress.style.width = `${percentage}%`;
    progress.setAttribute('aria-valuenow', percentage);

    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.remove('completed', 'active');
        if (index < currentSectionIndex) {
            step.classList.add('completed');
        } else if (index === currentSectionIndex) {
            step.classList.add('active');
        }
    });
}

function updateNavigationButtons() {
    const prevButton = document.querySelector('.setup-navigation .btn-secondary');
    const nextButton = document.querySelector('.setup-navigation .btn-primary');

    prevButton.disabled = currentSectionIndex === 0;
    nextButton.textContent = currentSectionIndex === setupSections.length - 1 ? 'Finish' : 'Next';
}

// Initialize setup
document.addEventListener('DOMContentLoaded', () => {
    showSection('tribeName');
    updateProgress();
}); 