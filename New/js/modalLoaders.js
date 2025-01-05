// Just load the name modal
document.addEventListener('DOMContentLoaded', function() {
    // Load numbered modals from tribe-setup folder
    fetch('components/modals/tribe-setup/01-name.html')
        .then(response => response.text())
        .then(html => document.getElementById('nameModalContainer').innerHTML = html);
        
    fetch('components/modals/tribe-setup/21-leader-agent.html')
        .then(response => response.text())
        .then(html => document.getElementById('leaderAgentModalContainer').innerHTML = html);
        
    fetch('components/modals/tribe-setup/22-agent.html')
        .then(response => response.text())
        .then(html => document.getElementById('agent1ModalContainer').innerHTML = html);
}); 