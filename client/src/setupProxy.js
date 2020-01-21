const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use('/auth/*', proxy({
        target: 'http://localhost:5000'
    }))
    app.use('/api/*', proxy({
        target: 'http://localhost:5000'
    }))
}