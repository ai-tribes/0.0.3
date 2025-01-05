class SectionManager {
    constructor() {
        this.currentSection = 'ai';
        this.init();
    }

    init() {
        // Add click handlers to section buttons
        document.querySelectorAll('[data-type]').forEach(button => {
            button.addEventListener('click', (e) => this.switchSection(e.target.dataset.type));
        });

        // Initialize with AI Services view
        this.switchSection('ai');
    }

    switchSection(type) {
        // Update button states
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        // Show/hide sections
        document.querySelectorAll('[data-section]').forEach(section => {
            section.classList.toggle('d-none', section.dataset.section !== type);
        });

        // Update current section
        this.currentSection = type;

        // Load section-specific content
        this.loadSectionContent(type);
    }

    async loadSectionContent(type) {
        switch(type) {
            case 'platform':
                await this.loadPlatformIntegrations();
                break;
            case 'billing':
                await this.loadBillingDashboard();
                break;
            default:
                await this.loadAIServices();
        }
    }

    async loadPlatformIntegrations() {
        // Load platform integration status
        const integrations = await fetch('/api/integrations/platform').then(r => r.json());
        this.updatePlatformUI(integrations);
    }

    async loadBillingDashboard() {
        // Load billing and usage data
        const usage = await fetch('/api/billing/usage').then(r => r.json());
        this.updateBillingUI(usage);
    }

    updatePlatformUI(integrations) {
        // Update platform integration cards
    }

    updateBillingUI(usage) {
        // Update billing dashboard
    }
}

// Initialize
const sectionManager = new SectionManager(); 