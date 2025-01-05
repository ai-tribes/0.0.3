const express = require('express');
const fs = require('fs');
const path = require('path');

// Single endpoint to serve a random hero image
app.get('/random-hero-image', (req, res) => {
    const directoryPath = path.join(__dirname, 'assets/heroimages');
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.png'));
    const randomFile = files[Math.floor(Math.random() * files.length)];
    res.sendFile(path.join(directoryPath, randomFile));
}); 