const express = require('express')
const router = express.Router()
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgroundController = require('../controllers/campgorunds')
const catchAsync = require('../utils/catchAsync')
// we use multer for parsing file
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
// middleware for this route
// router.use((req, res, next) =>{
// })

router.route('/')
    .get(catchAsync(campgroundController.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgroundController.postCampground))

router.get('/new', isLoggedIn, campgroundController.newCampground)

router.route('/:id')
    .get(catchAsync(campgroundController.viewCampground))
    .patch(isLoggedIn, isAuthor,  upload.array('image'), validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundController.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground))

module.exports = router