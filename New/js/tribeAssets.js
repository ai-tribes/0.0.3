function generateTribeLogo(name, size = 120) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Generate gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#' + Math.floor(Math.random()*16777215).toString(16));
    gradient.addColorStop(1, '#' + Math.floor(Math.random()*16777215).toString(16));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = `${size/3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name.charAt(0), size/2, size/2);
    
    return canvas.toDataURL();
} 