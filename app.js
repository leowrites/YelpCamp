// @ts-nocheck
if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routes/users')
const helmet = require('helmet')
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/yelp-camp'
const MongoStore = require('connect-mongo')
const secret = process.env.SECRET || 'kdlafbnvioawngrajw'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(morgan('tiny'))
// app.use((req, res, next) => {
//     console.log(req.method.toUpperCase())
//     next()
// })

// run some function based on route
// app.use('/campgrounds', (req, res, next) => {
//     console.log('Campgrounds')
//     next()
// })
const options = {
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 6
}

const sessionConfig = {
    store: MongoStore.create(options),
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = []



app.use((req, res, next) => {
    // Information here is avaliable everywhere
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes)
app.use(express.static(path.join(__dirname, 'public')))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

// a 404 route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
// error handling functions
// this will run whenever an error is encountered
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = 'Oh No! Something went wrong'
    res.status(status).render('error', { err })
})