async function sendDiscordNotification(message, type = 'info') {
    try {
        const response = await fetch(DISCORD_CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message,
                username: 'AI Tribes Bot',
                avatar_url: 'https://your-domain.com/assets/images/bot-avatar.png'
            })
        });
        return response.ok;
    } catch (error) {
        console.error('Failed to send Discord notification:', error);
        return false;
    }
} 