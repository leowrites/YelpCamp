const Campground = require('../models/campground')
const cloudinary = require('cloudinary').v2

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds: campgrounds })
}

module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.viewCampground = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find the campground')
        res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/details', { campground: campground })
    }
}

module.exports.postCampground = async (req, res, next) => {
    // To prevent POST request directly (from postman for example)
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const campground = new Campground(req.body.campground)
    campground.img = req.files.map(file => ({url: file.path, filename: file.filename}))
    campground.email = req.user.email
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully posted')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find the campground')
        res.redirect('/campgrounds')
    } else {
        res.render('campgrounds/edit', { campground: campground, success: req.flash('success') })
    }
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(file => ({url: file.path, filename: file.filename}))
    campground.img.push(...images)
    console.log(req.body.deleteImages)
    await campground.save()
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: { images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated')
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteCampground =  async (req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds')
}