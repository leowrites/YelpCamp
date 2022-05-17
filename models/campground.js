const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: [true, 'name cannot be blank']
    },
    price: {
        type: Number,
        required: true
    },
    img: [
        {
            url: String,
            filename: String
        }
    ],
    description: {
        type: String,

    },
    location: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)