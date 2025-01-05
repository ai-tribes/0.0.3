document.addEventListener('DOMContentLoaded', function() {
    // Load wallet modal
    fetch('components/shared/wallet-modal.html')
        .then(response => response.text())
        .then(html => {
            // Create container for modal if it doesn't exist
            let modalContainer = document.getElementById('walletModalContainer');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'walletModalContainer';
                document.body.appendChild(modalContainer);
            }
            modalContainer.innerHTML = html;
        });
}); 