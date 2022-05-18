if (process.env.NODE_ENV !== "production"){
    require('dotenv').config()
    //use process.env.CLOUDINARY_API_NAME
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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
// const campgroundRoutes = require('./routes/campground')
// app.use('/campgrounds', campgrounRoutes)

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connection Open')
    })
    .catch(() => {
        console.log('Error')
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

const sessionConfig = {
    name: 'session',
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
app.use(mongoSanitize)
app.use(helmet({
    contentSecurityPolicy: false
}))

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash())
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

app.listen(3000, () => {
    console.log('Serving on port 3000')
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