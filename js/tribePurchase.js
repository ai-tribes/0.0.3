class TribePurchase {
    constructor(tribeData) {
        this.tribe = tribeData;
        this.modal = new bootstrap.Modal(document.getElementById('buyTokenModal'));
        this.setupModal();
    }

    setupModal() {
        const modal = document.getElementById('buyTokenModal');
        
        // Update modal content when shown
        modal.addEventListener('show.bs.modal', (event) => {
            const button = event.relatedTarget;
            const tribeId = button.getAttribute('data-tribe-id');
            const tribe = tribes[tribeId];

            this.updateModalContent(tribe);
            this.setupPurchaseLinks(tribe);
        });
    }

    updateModalContent(tribe) {
        document.getElementById('modalTokenName').textContent = `${tribe.name} (${tribe.token.symbol})`;
        document.getElementById('modalTokenPrice').innerHTML = `
            <span class="text-${tribe.token.change >= 0 ? 'success' : 'danger'}">
                $${tribe.token.price.toFixed(2)} 
                <small>${tribe.token.change >= 0 ? '↑' : '↓'} ${Math.abs(tribe.token.change)}%</small>
            </span>
        `;
        document.getElementById('modalTokenLogo').src = `assets/tribes/${tribe.id}.png`;
    }

    setupPurchaseLinks(tribe) {
        // Jupiter (Solana)
        const jupiterLink = document.getElementById('jupiterLink');
        jupiterLink.href = `https://jup.ag/swap/SOL-${tribe.token.symbol}`;
        
        // Raydium (Solana)
        const raydiumLink = document.getElementById('raydiumLink');
        raydiumLink.href = `https://raydium.io/swap/?inputCurrency=SOL&outputCurrency=${tribe.token.contracts.solana}`;
        
        // Uniswap (Ethereum)
        const uniswapLink = document.getElementById('uniswapLink');
        uniswapLink.href = `https://app.uniswap.org/#/swap?outputCurrency=${tribe.token.contracts.ethereum}`;
    }
} 