// Joi documentation https://joi.dev/api/?v=17.6.0
const Joi = require('joi')

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        description: Joi.string(),
        location: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

const reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})

module.exports = {
    campgroundSchema: campgroundSchema,
    reviewSchema: reviewSchema
}