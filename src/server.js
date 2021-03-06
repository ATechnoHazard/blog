import express from 'express'
import compression from 'compression'
import path from 'path'
import dotenv from 'dotenv'
import CookieParser from 'cookie-parser'

dotenv.config()

// Server var
const app = express()

// View engine setup
app.set('views', path.join(__dirname, 'static', 'views'))
app.set('view engine', 'ejs')

// set url
app.locals.url = 'http://localhost:3000'

// Middleware
app.use(compression())
app.use(CookieParser())
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'static', 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user-profile'))
app.use('/signup', require('./routes/sign-up'))
app.use('/login', require('./routes/login'))
app.use('/logout', require('./routes/logout'))
app.use('/blogs', require('./routes/index-blog'))
app.use('/blogs/create', require('./routes/create-blog'))
app.use('/blogs/id', require('./routes/blog-id'))
app.use('/blogs/search', require('./routes/search-page'))
app.use('/error', require('./routes/error'))
app.use('*', require('./routes/not-found'))

const port = process.env.PORT || 3000

app.listen(port, function listenHandler () {
  console.info(`Running on port ${port}`)
})
