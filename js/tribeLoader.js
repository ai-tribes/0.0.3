// Function to load tribe components
async function loadTribes() {
    const tribeContainer = document.getElementById('tribe-container');
    const tribes = ['research', 'climate', 'art', 'gaming', 'edu', 'news'];
    
    for (const tribe of tribes) {
        try {
            const response = await fetch(`components/tribes/${tribe}.html`);
            const html = await response.text();
            const tribeElement = document.createElement('div');
            tribeElement.className = 'col-md-4';
            tribeElement.innerHTML = html;
            tribeContainer.appendChild(tribeElement);
        } catch (error) {
            console.error(`Error loading ${tribe} tribe:`, error);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadTribes };
} 