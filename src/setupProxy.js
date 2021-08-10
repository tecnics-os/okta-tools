const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    const { REACT_APP_BACKEND_URL } = process.env;
    app.use(
        '/api',
        createProxyMiddleware({
        target: `${REACT_APP_BACKEND_URL}`,
        changeOrigin: true,
        })
    );
};