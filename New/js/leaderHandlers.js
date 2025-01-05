// Show the add leader modal
function showAddLeaderModal() {
    const modal = new bootstrap.Modal(document.getElementById('addLeaderModal'));
    modal.show();
}

// Toggle trait selection
function toggleTrait(element) {
    element.classList.toggle('active');
    element.classList.toggle('bg-primary');
    element.classList.toggle('text-white');
}

// Save leader data
function saveLeader() {
    const leaderData = {
        name: document.getElementById('leaderName').value,
        style: document.getElementById('leaderStyle').value,
        twitter: document.getElementById('leaderTwitter').value,
        twitterStyle: document.getElementById('twitterStyle').value,
        traits: Array.from(document.querySelectorAll('.trait-chips .badge.active'))
            .map(badge => badge.textContent),
        communication: document.getElementById('communicationStyle').value,
        decision: document.getElementById('decisionStyle').value
    };

    // Validate data
    if (!leaderData.name || !leaderData.style) {
        alert('Please fill in the required fields');
        return;
    }

    // Save leader data and update UI
    saveTribeLeader(leaderData);
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('addLeaderModal')).hide();
    
    // Show success message
    showToast('Leader Added', 'AI Leader has been successfully configured!', 'success');
}

// Save leader to tribe data
function saveTribeLeader(leaderData) {
    // Add to tribe configuration
    window.tribeConfig = window.tribeConfig || {};
    window.tribeConfig.leader = leaderData;
    
    // Update preview if available
    if (typeof updatePreview === 'function') {
        updatePreview('leader');
    }
} 