class ImageGenerator {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.stability.ai/v1/generation';
        this.engine = 'stable-diffusion-xl-1024-v1-0';
        this.requestQueue = [];
        this.isProcessing = false;
        this.rateLimitDelay = 1000; // 1 second between requests
    }

    // Add rate limiting
    async queueRequest(prompt, options) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ prompt, options, resolve, reject });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) return;
        
        this.isProcessing = true;
        const { prompt, options, resolve, reject } = this.requestQueue.shift();

        try {
            const result = await this.generateImage(prompt, options);
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.isProcessing = false;
            setTimeout(() => this.processQueue(), this.rateLimitDelay);
        }
    }

    // Update generateImage to use rate limiting
    async generateImage(prompt, options = {}) {
        try {
            console.log('Generating image with prompt:', prompt);
            const response = await fetch(`${this.baseUrl}/${this.engine}/text-to-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    text_prompts: [{ 
                        text: prompt,
                        weight: 1
                    }],
                    cfg_scale: options.cfg_scale || 7,
                    height: options.height || 1024,
                    width: options.width || 1024,
                    samples: 1,
                    steps: options.steps || 30,
                    style_preset: options.style_preset || 'digital-art'
                })
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                console.error('API Error Response:', responseData);
                throw new Error(`API Error: ${responseData.message || 'Unknown error'}`);
            }

            if (!responseData.artifacts || !responseData.artifacts[0]) {
                console.error('Unexpected API Response:', responseData);
                throw new Error('No image data in response');
            }

            return responseData.artifacts[0].base64;
        } catch (error) {
            console.error('Full error details:', error);
            throw error;
        }
    }

    // Helper method for NFT-specific generation
    async generateNFT(style, traits) {
        const stylePrompts = {
            pixel: 'pixel art style, 32x32 pixels, retro gaming aesthetic, clean pixels, limited color palette, nostalgic game art style',
            anime: 'anime art style, cel shaded, clean linework, vibrant colors, professional illustration, Studio Ghibli inspired',
            custom: ''
        };

        const qualityPrompts = {
            pixel: 'sharp pixels, well-defined shapes, cohesive color scheme, retro gaming feel',
            anime: 'high quality illustration, detailed shading, professional artwork, smooth gradients',
            custom: 'high quality, detailed, professional artwork'
        };

        const prompt = `
            ${traits.character || ''} character
            in a ${traits.background || ''} setting,
            wearing ${traits.accessory || ''},
            color scheme: ${traits.colors || ''},
            ${stylePrompts[style] || ''},
            ${qualityPrompts[style] || ''},
            trending on artstation, award winning, masterpiece
        `.trim().replace(/\s+/g, ' ');

        const styleSettings = {
            pixel: {
                width: 512,
                height: 512,
                style_preset: 'pixel-art',
                cfg_scale: 8,
                steps: 40
            },
            anime: {
                width: 1024,
                height: 1024,
                style_preset: 'anime',
                cfg_scale: 7,
                steps: 30
            },
            custom: {
                width: 1024,
                height: 1024,
                style_preset: 'digital-art',
                cfg_scale: 7,
                steps: 30
            }
        };

        return this.generateImage(prompt, styleSettings[style] || styleSettings.custom);
    }

    // Cache generated images
    async generateAndCache(prompt, cacheKey) {
        if (!this.imageCache) {
            this.imageCache = new Map();
        }

        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        const image = await this.generateImage(prompt);
        this.imageCache.set(cacheKey, image);
        return image;
    }
}

// Initialize with your Stability AI API key
const imageGenerator = new ImageGenerator('sk-I41oLhbVjwOpycZZFZ7rHajteSkn4MQoUOtr8GQ60Ee1zLLr'); 

async function testStabilityAPI() {
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin fa-3x"></i><p>Testing API connection...</p></div>';
    
    try {
        // Simple test with one basic prompt
        const image = await imageGenerator.generateImage(
            "a simple test image of a cute robot, digital art style", 
            {
                height: 512,
                width: 512,
                steps: 30,
                cfg_scale: 7,
                style_preset: 'digital-art'
            }
        );

        previewGrid.innerHTML = `
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-body">
                        <h6>Test Image</h6>
                        <img src="data:image/png;base64,${image}" 
                             alt="Test Image" 
                             class="img-fluid rounded shadow-sm">
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('API Test Error:', error);
        previewGrid.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Test failed: ${error.message}
                <br><small class="text-muted">Check console for details</small>
            </div>
        `;
    }
}

// Run the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.className = 'btn btn-outline-secondary mb-3';
    testButton.innerHTML = '<i class="fas fa-vial me-2"></i>Test API';
    testButton.onclick = testStabilityAPI;
    
    // Add the test button to the preview section
    const previewSection = document.getElementById('previewSection');
    if (previewSection) {
        previewSection.querySelector('.d-flex').appendChild(testButton);
    }
}); 