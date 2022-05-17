const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const reviewController = require('../controllers/reviews')
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.newReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReivew))

module.exports = router