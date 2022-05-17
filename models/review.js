const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model('Review', reviewSchema)