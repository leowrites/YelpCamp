const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const userController = require('../controllers/users')
const passport = require('passport')
// /register form
// POST/register 
// /login
// /logout

router.route('/register')
    .get(userController.register)
    .post(catchAsync(userController.createUser))

router.route('/login')
    .get(userController.loginPage)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), userController.login)

router.get('/logout', userController.logout)

module.exports = router