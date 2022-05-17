const Review = require('../models/review')
const Campground = require('../models/campground')

module.exports.newReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created New Review')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReivew = async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id,
        { $pull: { reviews: req.params.reviewId } })
    await Review.findByIdAndDelete(req.params.reviewId)
    res.redirect(`/campgrounds/${req.params.id}`)
}