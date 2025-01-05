class PerchanceGenerator {
    constructor(grammar) {
        this.rules = this.parseGrammar(grammar);
    }

    parseGrammar(grammar) {
        const rules = {};
        let currentRule = null;
        
        grammar.split('\n').forEach(line => {
            line = line.trim();
            if (!line) return;
            
            if (!line.startsWith(' ')) {
                // This is a rule name
                currentRule = line;
                rules[currentRule] = [];
            } else {
                // This is a rule option
                rules[currentRule].push(line.trim());
            }
        });
        
        return rules;
    }

    generate(ruleName) {
        if (!this.rules[ruleName]) {
            throw new Error(`Rule "${ruleName}" not found`);
        }
        const options = this.rules[ruleName];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Add support for weighted options
    generateWeighted(ruleName, weights) {
        const options = this.rules[ruleName];
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const random = Math.random() * totalWeight;
        
        let sum = 0;
        for (let i = 0; i < options.length; i++) {
            sum += weights[i];
            if (random < sum) return options[i];
        }
        return options[options.length - 1];
    }
} 