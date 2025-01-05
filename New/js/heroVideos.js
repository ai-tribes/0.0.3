document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.querySelector('.hero-media-container');
    const videoFiles = [
        'assets/heroimages/herovideo1.mp4',
        'assets/heroimages/herovideo2.mp4',
        'assets/heroimages/herovideo3.mp4',
        'assets/heroimages/herovideo4.mp4',
        'assets/heroimages/herovideo5.mp4',
        'assets/heroimages/herovideo6.mp4',
        'assets/heroimages/herovideo7.mp4',
        'assets/heroimages/herovideo8.mp4',
        'assets/heroimages/herovideo9.mp4',
        'assets/heroimages/herovideo10.mp4',
        'assets/heroimages/herovideo11.mp4',
        'assets/heroimages/herovideo12.mp4',
        'assets/heroimages/herovideo13.mp4',
        'assets/heroimages/herovideo14.mp4',
        'assets/heroimages/herovideo15.mp4'
    ];
    
    let currentVideoIndex = 0;
    let videos = [];

    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Shuffle the video array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initialize videos
    function initializeVideos() {
        // Shuffle the video files
        const shuffledVideos = shuffleArray([...videoFiles]);
        
        // For mobile, only load first 5 videos to improve performance
        const videosToLoad = isMobile ? shuffledVideos.slice(0, 5) : shuffledVideos;
        
        videosToLoad.forEach((videoSrc, index) => {
            const video = document.createElement('video');
            video.className = 'hero-media';
            video.muted = true;
            video.playsinline = true;
            video.preload = "auto";
            video.setAttribute('playsinline', '');  // iOS support
            video.setAttribute('webkit-playsinline', '');  // iOS support
            video.setAttribute('muted', '');  // Ensure muted works on all devices

            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';

            video.appendChild(source);
            videoContainer.appendChild(video);
            videos.push(video);
        });

        // Show first video
        videos[0].classList.add('active');
        // Force play for mobile
        playVideo(videos[0]);
    }

    // Helper function to handle video playback
    function playVideo(video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Video play failed:", error);
                // If autoplay fails, try playing on user interaction
                document.addEventListener('touchstart', function() {
                    video.play();
                }, { once: true });
            });
        }
    }

    function cycleVideos() {
        videos[currentVideoIndex].classList.remove('active');
        currentVideoIndex = (currentVideoIndex + 1) % videos.length;
        videos[currentVideoIndex].classList.add('active');
        videos[currentVideoIndex].currentTime = 0;
        playVideo(videos[currentVideoIndex]);
    }

    // Initialize
    initializeVideos();

    // Add ended event listener to all videos
    videos.forEach(video => {
        video.addEventListener('ended', cycleVideos);
    });
}); 