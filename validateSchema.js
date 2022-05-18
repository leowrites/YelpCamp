// Joi documentation https://joi.dev/api/?v=17.6.0
const BaseJoi = require('joi')
const sanitizehtml = require('sanitize-html')

const extension = (BaseJoi) => ({
    type: 'string',
    base: BaseJoi.string(),
    messages: {
        'string.htmlSafe' : '{{#label}} must not include HTML!'
    },
    rules: {
        htmlSafe:{
            validate(value, helpers) {
                const clean = sanitizehtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                })
                if (clean != value) return helpers.error('string.htmlSafe', { value })
                return clean
            }
        }
    }

})

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().htmlSafe(),
        price: Joi.number().required().min(0),
        description: Joi.string().htmlSafe(),
        location: Joi.string().required().htmlSafe()
    }).required(),
    deleteImages: Joi.array()
})


const reviewSchema = Joi.object({
    review: Joi.object({
        text: Joi.string().required().htmlSafe(),
        rating: Joi.number().required()
    }).required()
})


module.exports = {
    campgroundSchema: campgroundSchema,
    reviewSchema: reviewSchema
}