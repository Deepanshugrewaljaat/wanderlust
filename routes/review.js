const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const item = await Listing.findById(req.params.id);

    if (!item) {
        throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    item.reviews.push(newReview);
    await item.save();

    res.redirect(`/listing/${item._id}`);
}));

router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listing/${id}`);
}));

module.exports = router;