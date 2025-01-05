// Tribe Setup Modal Handlers
const modalHandlers = {
    handleNameSubmit: async (event) => {
        event.preventDefault();
        
        const tribeName = document.getElementById('tribeName').value;
        const tribeDescription = document.getElementById('tribeDescription').value;
        
        // Store the data
        localStorage.setItem('tribeName', tribeName);
        localStorage.setItem('tribeDescription', tribeDescription);
        
        // Update the preview
        document.getElementById('previewTribeName').textContent = tribeName || '...';
        document.getElementById('previewTribeDescription').textContent = tribeDescription || '...';
        
        // Close current modal
        const currentModal = bootstrap.Modal.getInstance(document.getElementById('tribeNameModal'));
        currentModal.hide();
    }
};

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Attach name form handler
    const nameForm = document.getElementById('tribeNameForm');
    if (nameForm) {
        nameForm.addEventListener('submit', modalHandlers.handleNameSubmit);
    }
    
    // Initialize preview with any stored data
    const storedName = localStorage.getItem('tribeName');
    const storedDesc = localStorage.getItem('tribeDescription');
    if (storedName) document.getElementById('previewTribeName').textContent = storedName;
    if (storedDesc) document.getElementById('previewTribeDescription').textContent = storedDesc;
}); 