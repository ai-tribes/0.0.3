function saveTribeName() {
    const name = document.getElementById('tribeName').value;
    const description = document.getElementById('tribeDescription').value;
    
    if (name && description) {
        // Update preview section
        const previewSection = document.getElementById('tribeNamePreview');
        previewSection.innerHTML = `
            <div class="preview-content">
                <h4>${name}</h4>
                <p class="text-muted">${description}</p>
            </div>
        `;
        
        // Close modal
        const modal = document.getElementById('nameModal');
        bootstrap.Modal.getInstance(modal).hide();
    }
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.setup-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active button state
    document.querySelectorAll('#navigationButtons .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Show first section by default
document.addEventListener('DOMContentLoaded', () => {
    showSection('nameSection');
}); 