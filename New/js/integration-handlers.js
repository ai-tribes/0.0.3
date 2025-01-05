// Integration type switcher
document.querySelectorAll('[data-type]').forEach(button => {
    button.addEventListener('click', function() {
        // Update active button
        document.querySelectorAll('[data-type]').forEach(btn => 
            btn.classList.remove('active')
        );
        this.classList.add('active');

        // Show corresponding section
        const type = this.dataset.type;
        document.querySelectorAll('[data-section]').forEach(section => {
            if (section.dataset.section === type) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });
    });
}); 