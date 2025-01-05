class TribePriceTracker {
    constructor() {
        this.prices = {};
        this.setupWebSocket();
    }

    setupWebSocket() {
        // Connect to price feed (example)
        const ws = new WebSocket('wss://price-feed.example.com');
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.updatePrice(data.symbol, data.price, data.change);
        };
    }

    updatePrice(symbol, price, change) {
        this.prices[symbol] = { price, change };
        this.updatePriceDisplay(symbol);
    }

    updatePriceDisplay(symbol) {
        const elements = document.querySelectorAll(`[data-token-symbol="${symbol}"]`);
        elements.forEach(el => {
            el.innerHTML = this.formatPrice(this.prices[symbol]);
        });
    }

    formatPrice({ price, change }) {
        return `
            <span class="text-${change >= 0 ? 'success' : 'danger'}">
                $${price.toFixed(2)} 
                <small>${change >= 0 ? '↑' : '↓'} ${Math.abs(change)}%</small>
            </span>
        `;
    }
} 