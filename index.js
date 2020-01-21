const express = require('express')
const cookieSession = require('cookie-session')
const passport = require('passport')
require('./db/mongoose')
require('./services/passport')
require('./services/cache')
const authRouter = require('./routes/authRoutes')
const blogRouter = require('./routes/blogRoutes')
const keys = require('./config/keys')


const app = express()

app.use(express.json())
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(authRouter)
app.use(blogRouter)

if (['production', 'ci'].includes(process.env.NODE_ENV)) {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve('client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
app.listen(PORT)
