function loadRandomHeroImages() {
    const images = [
        'assets/heroimages/Hero.png',
        'assets/heroimages/Hero1.png',
        'assets/heroimages/Hero2.png',
        'assets/heroimages/Hero3.png',
        'assets/heroimages/Hero4.png',
        'assets/heroimages/Hero5.png',
        'assets/heroimages/Hero6.png',
        'assets/heroimages/Hero7.png',
        'assets/heroimages/Hero8.png',
        'assets/heroimages/Hero9.png',
        'assets/heroimages/Hero10.png',
        'assets/heroimages/Hero11.png',
        'assets/heroimages/Hero13.png',
        'assets/heroimages/hero14.png',
        'assets/heroimages/hero15.png',
        'assets/heroimages/hero16.png',
        'assets/heroimages/hero17.png',
        'assets/heroimages/hero18.png',
        'assets/heroimages/hero19.png',
        'assets/heroimages/hero20.png',
        'assets/heroimages/Hero22.png'
    ];
    
    const preloadedImages = [];
    let loadedCount = 0;

    function preloadImages(callback) {
        images.forEach(src => {
            const img = new Image();
            img.onload = () => {
                preloadedImages.push(src);
                loadedCount++;
                if (loadedCount === images.length) {
                    callback();
                }
            };
            img.onerror = () => {
                loadedCount++;
                if (loadedCount === images.length) {
                    callback();
                }
            };
            img.src = src;
        });
    }

    function cycleImage() {
        const heroSection = document.querySelector('.hero');
        if (heroSection && preloadedImages.length > 0) {
            const currentSrc = heroSection.style.backgroundImage.slice(5, -2);
            let nextImage;
            do {
                nextImage = preloadedImages[Math.floor(Math.random() * preloadedImages.length)];
            } while (nextImage === currentSrc && preloadedImages.length > 1);
            
            heroSection.style.backgroundImage = `url('${nextImage}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
        }
    }

    preloadImages(() => {
        cycleImage();
        setInterval(cycleImage, 7000);
    });
}

document.addEventListener('DOMContentLoaded', loadRandomHeroImages); 