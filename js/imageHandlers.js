function handleImageLoad(img) {
    img.parentElement.classList.remove('loading');
}

function handleImageError(img, type) {
    img.parentElement.classList.remove('loading');
    img.parentElement.classList.add('error');
    
    // Replace with appropriate placeholder
    switch(type) {
        case 'banner':
            img.src = 'assets/placeholders/banner.svg';
            break;
        case 'logo':
            img.src = 'assets/placeholders/logo.svg';
            break;
        case 'avatar':
            img.src = 'assets/placeholders/avatar.svg';
            break;
        default:
            img.src = 'assets/placeholders/default.svg';
    }
}

// Add loading wrapper to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-type]');
    images.forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = `image-container loading ${img.dataset.type}-placeholder`;
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        
        img.addEventListener('load', () => handleImageLoad(img));
        img.addEventListener('error', () => handleImageError(img, img.dataset.type));
    });
}); 