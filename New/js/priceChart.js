// Using TradingView's lightweight charts
function initPriceChart() {
    const container = document.querySelector('.chart-container');
    new TradingView.widget({
        "width": "100%",
        "height": 400,
        "symbol": "TRIBEUSD",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_chart"
    });
} 