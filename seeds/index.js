const mongoose = require('mongoose')
const Campground = require('../models/campground')
const locations = require('./seeds')
const city_names = require('./city_name')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connection Open')
    })
    .catch(() => {
        console.log('Error')
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDb = async () => {
    await Campground.deleteMany()
    for (let i = 0; i < 50; i++) {
        const location_index = Math.floor(Math.random() * locations.length)
        const camp = new Campground({
            author: '62815919a4338cb65df5c829',
            title: `${sample(city_names).name}`,
            price: Math.floor(Math.random() * 1000),
            location: `${locations[location_index].city}, ${locations[location_index].state}`,
            img: [{
                "url": "https://res.cloudinary.com/dg28e9eer/image/upload/v1652763736/YelpCamp/hg41wko6bizlpkiymhtz.jpg",
                "filename": "YelpCamp/hg41wko6bizlpkiymhtz",
            }]
        })
        await camp.save()
    }
}
seedDb()