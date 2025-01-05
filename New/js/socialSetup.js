// Toggle section visibility
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = section.previousElementSibling;
    const icon = button.querySelector('.toggle-icon');
    
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    button.classList.toggle('active');
}

// Toggle member details
function toggleMember(button) {
    const memberContent = button.nextElementSibling;
    const icon = button.querySelector('.fas');
    
    memberContent.style.display = memberContent.style.display === 'none' ? 'block' : 'none';
    button.classList.toggle('active');
}

// Toggle platform configuration
function togglePlatform(button) {
    const platformContent = button.nextElementSibling;
    const icon = button.querySelector('.fas');
    
    platformContent.style.display = platformContent.style.display === 'none' ? 'block' : 'none';
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    button.classList.toggle('active');
}

// Add new social platform
function addPlatform(button) {
    // Platform addition logic
}

// Add new AI member
function addNewMember() {
    // Member addition logic
} 