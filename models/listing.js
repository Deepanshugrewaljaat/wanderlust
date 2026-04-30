const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const User = require("./user");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://unsplash.com/photos/white-house-under-maple-trees-1ddol8rgUH8"
        }

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;