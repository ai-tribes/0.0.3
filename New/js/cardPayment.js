// Card Payment Modal Handler
document.addEventListener('DOMContentLoaded', () => {
    const cardPaymentModal = new bootstrap.Modal(document.getElementById('cardPaymentModal'));
    const cardPaymentForm = document.getElementById('cardPaymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const cardTypeIcon = document.querySelector('.card-type-icon');
    
    // Add click handlers to all "Subscribe with Card" buttons
    document.querySelectorAll('button[data-action="card-payment"]').forEach(button => {
        button.addEventListener('click', () => {
            const planType = button.getAttribute('data-plan-type');
            const planPrice = button.getAttribute('data-plan-price');
            
            // Update modal with plan details
            document.getElementById('selectedPlanName').textContent = planType;
            document.getElementById('selectedPlanPrice').textContent = planPrice;
            document.getElementById('paymentAmount').textContent = planPrice;
            
            cardPaymentModal.show();
        });
    });

    // Card number formatting and validation
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
        
        // Detect card type
        const cardType = detectCardType(value.replace(/\s/g, ''));
        updateCardTypeIcon(cardType);
        
        // Validate card number using Luhn algorithm
        const isValid = validateCardNumber(value.replace(/\s/g, ''));
        setInputValidation(cardNumberInput, isValid);
    });

    // Expiry date formatting and validation
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2);
        }
        e.target.value = value;
        
        const isValid = validateExpiryDate(value);
        setInputValidation(expiryInput, isValid);
    });

    // CVV validation
    cvvInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        const isValid = validateCVV(e.target.value);
        setInputValidation(cvvInput, isValid);
    });

    // Form submission
    cardPaymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            showToast('Validation Error', 'Please check the form for errors.', 'error');
            return;
        }

        const submitButton = cardPaymentForm.querySelector('button[type="submit"]');
        const spinner = submitButton.querySelector('.spinner-border');
        
        // Show loading state
        submitButton.disabled = true;
        spinner.classList.remove('d-none');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (document.getElementById('saveCard').checked) {
                // Save card details (in real app, save tokenized version)
                localStorage.setItem('savedCard', JSON.stringify({
                    last4: cardNumberInput.value.slice(-4),
                    type: detectCardType(cardNumberInput.value)
                }));
            }
            
            cardPaymentModal.hide();
            showToast('Payment Successful', 'Your subscription has been activated!', 'success');
            
        } catch (error) {
            showToast('Payment Failed', 'Please try again or contact support.', 'error');
        } finally {
            submitButton.disabled = false;
            spinner.classList.add('d-none');
        }
    });

    // Utility functions
    function detectCardType(number) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) return type;
        }
        return 'unknown';
    }

    function updateCardTypeIcon(type) {
        cardTypeIcon.className = 'input-group-text card-type-icon ' + type;
        cardTypeIcon.innerHTML = `<i class="fas fa-${type === 'unknown' ? 'credit-card' : type}"></i>`;
    }

    function validateCardNumber(number) {
        if (!/^\d+$/.test(number)) return false;
        
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return (sum % 10) === 0;
    }

    function validateExpiryDate(value) {
        if (!/^\d\d\/\d\d$/.test(value)) return false;
        
        const [month, year] = value.split('/').map(num => parseInt(num, 10));
        const now = new Date();
        const expiry = new Date(2000 + year, month - 1);
        
        return month >= 1 && month <= 12 && expiry > now;
    }

    function validateCVV(value) {
        return /^\d{3,4}$/.test(value);
    }

    function setInputValidation(input, isValid) {
        input.classList.remove('is-valid', 'is-invalid');
        input.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }

    function validateForm() {
        let isValid = true;
        const requiredFields = cardPaymentForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value) {
                setInputValidation(field, false);
                isValid = false;
            }
        });
        
        return isValid &&
            validateCardNumber(cardNumberInput.value.replace(/\s/g, '')) &&
            validateExpiryDate(expiryInput.value) &&
            validateCVV(cvvInput.value);
    }

    function showToast(title, message, type = 'success') {
        const toastContainer = document.querySelector('.toast-container') || 
            (() => {
                const container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
                return container;
            })();

        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-${type === 'success' ? 'check-circle text-success' : 'exclamation-circle text-danger'} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}); 