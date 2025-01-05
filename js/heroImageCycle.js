// Array of all hero images
const heroImages = [
    'assets/Hero.png',
    'assets/Hero1.png',
    'assets/Hero2.png',
    'assets/Hero3.png',
    'assets/Hero4.png',
    'assets/Hero5.png',
    'assets/Hero6.png',
    'assets/Hero7.png',
    'assets/Hero9.png',
    'assets/Hero10.png'
];

// Function to get random image from array
function getRandomHeroImage() {
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    return heroImages[randomIndex];
}

// Initialize hero image
function initHero() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const randomImage = getRandomHeroImage();
        heroSection.style.backgroundImage = `url('${randomImage}')`;
    }
}

// Set random image when page loads
document.addEventListener('DOMContentLoaded', initHero); 