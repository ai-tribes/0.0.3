// Handle Tribe Social Connections
function updateSocialPreview(type, platform, handle) {
    const previewSection = document.querySelector('.connected-socials');
    const socialElement = document.createElement('div');
    socialElement.classList.add('connected-social', 'mb-2', 'd-flex', 'align-items-center');
    socialElement.innerHTML = `
        <i class="fab fa-${platform.toLowerCase()} me-2"></i>
        <span>${type}: ${handle}</span>
        <span class="badge bg-success ms-2">Connected</span>
    `;
    previewSection.appendChild(socialElement);
}

function connectTribeSocial(platform) {
    const input = document.querySelector(`#tribeSocialModal input[placeholder*="${platform}"]`);
    const handle = input.value;
    if (handle) {
        updateSocialPreview('Tribe', platform, handle);
        input.closest('.social-item').classList.add('connected');
    }
}

// Handle Leader Social Connections
function connectLeaderSocial(platform) {
    const input = document.querySelector(`#leaderSocialModal input[placeholder*="${platform}"]`);
    const handle = input.value;
    if (handle) {
        updateSocialPreview('Leader', platform, handle);
        input.closest('.social-item').classList.add('connected');
    }
}

// Initialize Social Connection Handlers
document.addEventListener('DOMContentLoaded', function() {
    const socialButtons = document.querySelectorAll('.social-item button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const platform = e.target.closest('.social-item').querySelector('input').placeholder;
            if (e.target.closest('#tribeSocialModal')) {
                connectTribeSocial(platform);
            } else if (e.target.closest('#leaderSocialModal')) {
                connectLeaderSocial(platform);
            }
        });
    });
});

// Save functions for social connections
function saveTribeSocials() {
    const modal = document.getElementById('tribeSocialModal');
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        const platform = input.placeholder.split(' ')[0];
        if (input.value) {
            connectTribeSocial(platform);
        }
    });
    bootstrap.Modal.getInstance(modal).hide();
    updateSetupProgress();
}

function saveLeaderSocials() {
    const modal = document.getElementById('leaderSocialModal');
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        const platform = input.placeholder.split(' ')[0];
        if (input.value) {
            connectLeaderSocial(platform);
        }
    });
    bootstrap.Modal.getInstance(modal).hide();
    updateSetupProgress();
} 