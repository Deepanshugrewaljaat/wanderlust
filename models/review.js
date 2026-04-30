const mongoose = require("mongoose");
const { tr } = require("zod/locales");
const { required } = require("zod/mini");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports  = mongoose.model("Review",reviewSchema);

