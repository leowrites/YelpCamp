const User = require('../models/user')

module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        registeredUser.save()
        req.login(registeredUser, err => {
            if (err) return err
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.loginPage = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const redirectUrl = req.session.returnTo || '/campgrounds'
    req.flash('success', 'Welcome Back')
    return res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}