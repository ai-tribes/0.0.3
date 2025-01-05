const express = require('express');
const app = express();

app.use(express.static('public'));

// Setup routes for each section
app.get('/components/sections/:section', (req, res) => {
    const section = req.params.section;
    const filePath = `${__dirname}/components/sections/${section}`;
    console.log('Attempting to load:', filePath);
    res.sendFile(filePath);
});

// Main dashboard routes
app.get('/components/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(`${__dirname}/components/${page}.html`);
});

app.get('/api/agents/templates', (req, res) => {
    res.json({
        templates: [
            {
                id: 'community',
                name: 'Community Manager',
                icon: 'user-tie',
                description: 'Manages community engagement and moderation',
                capabilities: ['moderation', 'engagement', 'support']
            },
            {
                id: 'content',
                name: 'Content Creator',
                icon: 'paint-brush',
                description: 'Creates and curates content across platforms',
                capabilities: ['writing', 'image-gen', 'scheduling']
            },
            {
                id: 'analytics',
                name: 'Analytics Agent',
                icon: 'chart-line',
                description: 'Analyzes tribe metrics and provides insights',
                capabilities: ['analysis', 'reporting', 'prediction']
            },
            {
                id: 'treasury',
                name: 'Treasury Manager',
                icon: 'wallet',
                description: 'Manages token economics and treasury',
                capabilities: ['defi', 'reporting', 'automation']
            },
            {
                id: 'developer',
                name: 'Developer Assistant',
                icon: 'code',
                description: 'Assists with code and technical tasks',
                capabilities: ['coding', 'debugging', 'documentation']
            }
        ]
    });
});

app.get('/api/agents', async (req, res) => {
    try {
        const agents = await db.from('agents')
            .select('*')
            .eq('ownerAddress', req.query.owner);
        res.json(agents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agents', async (req, res) => {
    try {
        const agent = await agentManager.createAgent(
            req.body.ownerAddress,
            req.body.config
        );
        res.json(agent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/agents/:agentId/fund', async (req, res) => {
    try {
        const receipt = await agentManager.fundAgent(
            req.params.agentId,
            req.body.amount,
            req.body.token
        );
        res.json(receipt);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/integrations/platform', async (req, res) => {
    try {
        // Get platform integration status
        const integrations = {
            github: { status: 'disconnected' },
            cloudflare: { status: 'disconnected' },
            vercel: { status: 'disconnected' },
            gcp: { status: 'disconnected' }
        };
        res.json(integrations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/billing/usage', async (req, res) => {
    try {
        // Get billing and usage data
        const usage = {
            totalSpent: 0,
            services: {},
            history: []
        };
        res.json(usage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(8000, () => {
    console.log('Server running on port 8000');
}); 