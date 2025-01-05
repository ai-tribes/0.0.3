// Service Types
const SERVICE_TYPES = {
    AI: 'ai',
    PLATFORM: 'platform',
    BLOCKCHAIN: 'blockchain'
};

// Service Categories
const CATEGORIES = {
    LANGUAGE: 'language',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    SEARCH: 'search',
    CODE: 'code',
    SOCIAL: 'social'
};

// Service Configurations
const serviceConfigs = {
    // AI Services
    openai: {
        type: SERVICE_TYPES.AI,
        category: CATEGORIES.LANGUAGE,
        title: 'OpenAI',
        description: 'GPT-4, GPT-3.5 Turbo, and DALL-E models',
        models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
        image: '/assets/images/aipngs/chatgpt.jpeg',
        pricing: 'paid',
        apiEndpoint: 'https://api.openai.com/v1'
    },
    // ... other AI services

    // Platform Services
    github: {
        type: SERVICE_TYPES.PLATFORM,
        title: 'GitHub',
        description: 'Repository & CI/CD',
        image: '/assets/images/platforms/github.png',
        apiEndpoint: 'https://api.github.com'
    },
    // ... other platform services
};

// Service Connection Management
class ServiceConnection {
    static async connect(serviceId) {
        const config = serviceConfigs[serviceId];
        if (!config) throw new Error('Invalid service ID');

        try {
            // Show connection modal
            this.showConnectionModal(config);

            // Connection will be handled by specific service handler
            return await this.handleConnection(serviceId, config);
        } catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
    }

    static async handleConnection(serviceId, config) {
        switch(config.type) {
            case SERVICE_TYPES.AI:
                return await this.connectAIService(serviceId, config);
            case SERVICE_TYPES.PLATFORM:
                return await this.connectPlatformService(serviceId, config);
            default:
                throw new Error('Unsupported service type');
        }
    }

    static async connectAIService(serviceId, config) {
        // Implement AI service connection logic
        // This will handle API key validation, model selection, etc.
    }

    static async connectPlatformService(serviceId, config) {
        // Implement platform service connection logic
        // This will handle OAuth, API keys, etc.
    }

    static showConnectionModal(config) {
        // Implementation for showing connection modal
    }
}

// Usage Tracking
class ServiceUsage {
    static async trackUsage(serviceId, usage) {
        // Implement usage tracking
    }

    static async getUsageStats(serviceId) {
        // Get usage statistics
    }
}

// Export functionality
export {
    ServiceConnection,
    ServiceUsage,
    serviceConfigs,
    SERVICE_TYPES,
    CATEGORIES
}; 