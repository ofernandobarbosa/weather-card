import mongoose from "mongoose";

const Weather = mongoose.model('Weather', {
    searchedCity: String,
    icon: String,
    weatherDescription: String,
    temp: Number,
    measureUnit: String,
    windSpeed: Number,
    time: Date,
    humidity: Number
})

export default Weather