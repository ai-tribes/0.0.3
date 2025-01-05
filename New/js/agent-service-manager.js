// Import required libraries
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import { createClient } from '@supabase/supabase-js';

// Core Agent Service Management System
class AgentServiceManager {
    constructor() {
        this.treasury = new TreasuryManager();
        this.billing = new BillingSystem();
        this.services = new ServiceRegistry();
        this.storage = new StorageManager();
        this.db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    // Agent Management
    async createAgent(ownerAddress, config) {
        try {
            // Create agent wallet
            const wallet = await this.createAgentWallet();
            
            // Create agent record
            const agent = {
                id: `agent_${Date.now()}`,
                ownerAddress,
                walletAddress: wallet.address,
                config,
                status: 'active',
                balance: {
                    USDC: '0',
                    ETH: '0',
                    MATIC: '0'
                },
                createdAt: new Date().toISOString()
            };

            // Store agent data
            await this.db.from('agents').insert(agent);

            return agent;
        } catch (error) {
            console.error('Agent creation failed:', error);
            throw error;
        }
    }

    // Service Access Management
    async grantServiceAccess(agentId, serviceId, tier = 'basic') {
        const service = this.services.get(serviceId);
        if (!service) throw new Error('Service not found');

        const agent = await this.getAgent(agentId);
        if (!agent) throw new Error('Agent not found');

        // Check agent has sufficient balance
        if (!await this.checkSufficientBalance(agent, service, tier)) {
            throw new Error('Insufficient balance');
        }

        // Grant access
        const access = {
            agentId,
            serviceId,
            tier,
            apiKey: await this.generateServiceApiKey(service),
            grantedAt: new Date().toISOString()
        };

        await this.db.from('service_access').insert(access);
        return access;
    }

    // Balance Management
    async fundAgent(agentId, amount, token) {
        const agent = await this.getAgent(agentId);
        if (!agent) throw new Error('Agent not found');

        try {
            // Create funding transaction
            const tx = {
                to: agent.walletAddress,
                value: ethers.utils.parseUnits(amount.toString(), getDecimals(token)),
                data: '0x' // Add any required data
            };

            // Send transaction
            const receipt = await this.treasury.sendTransaction(tx);

            // Record funding
            await this.db.from('agent_funding').insert({
                agentId,
                amount,
                token,
                txHash: receipt.transactionHash,
                status: 'completed',
                timestamp: new Date().toISOString()
            });

            // Update agent balance
            agent.balance[token] = (
                BigInt(agent.balance[token]) + 
                BigInt(ethers.utils.parseUnits(amount.toString(), getDecimals(token)))
            ).toString();

            await this.db.from('agents')
                .update({ balance: agent.balance })
                .match({ id: agentId });

            return receipt;
        } catch (error) {
            console.error('Funding failed:', error);
            throw error;
        }
    }

    // Service Usage
    async useService(agentId, serviceId, params) {
        const agent = await this.getAgent(agentId);
        const service = this.services.get(serviceId);
        const access = await this.getServiceAccess(agentId, serviceId);

        if (!access) throw new Error('No service access');

        try {
            // Estimate cost
            const estimatedCost = await this.billing.estimateServiceCost(
                service, 
                params,
                access.tier
            );

            // Check balance
            if (!this.hasEnoughBalance(agent, estimatedCost)) {
                throw new Error('Insufficient balance');
            }

            // Reserve funds
            await this.treasury.reserveFunds(agent, estimatedCost);

            // Make service call
            const result = await this.services.call(serviceId, params, access.apiKey);

            // Calculate actual cost
            const actualCost = await this.billing.calculateActualCost(
                service,
                result.usage,
                access.tier
            );

            // Process payment
            await this.treasury.processPayment(agent, service, actualCost);

            // Track usage
            await this.trackUsage(agentId, serviceId, result.usage, actualCost);

            return result;
        } catch (error) {
            // Handle failure and refund if needed
            await this.treasury.handleFailure(agent, estimatedCost);
            throw error;
        }
    }

    // Usage Tracking
    async trackUsage(agentId, serviceId, usage, cost) {
        await this.db.from('service_usage').insert({
            agentId,
            serviceId,
            usage,
            cost,
            timestamp: new Date().toISOString()
        });
    }

    // Helper functions
    getDecimals(token) {
        const decimals = {
            'USDC': 6,
            'ETH': 18,
            'MATIC': 18
        };
        return decimals[token] || 18;
    }
}

// Export the manager
export default new AgentServiceManager(); 