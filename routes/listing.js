const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");



function validateSchema(req, res, next) {
    const result = listingSchema.safeParse(req.body);

    if (!result.success) {
        const errMsg = result.error.errors.map(e => e.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new")
})

router.get("/:id", wrapAsync(async (req, res) => {
    const id = req.params.id;
    const item = await Listing.findById(id).populate("reviews").populate("owner").populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    res.render("listings/show.ejs", { item })
}))



router.get("/", wrapAsync(async (req, res) => {
    const list = await Listing.find({});
    res.render("listings/index.ejs", { listings: list });
}))

router.post("/", isLoggedIn, validateSchema, wrapAsync(async (req, res) => {

    const { title, description, price, image, country, location } = req.body;
    const newListing = {
        title, description, price, image: {
            url: image,
            filename: "listingimage"
        }, country, location
    };
    newListing.owner = req.user._id;
    await Listing.create(newListing);
    res.redirect("/listing")
}
))


router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const item = await Listing.findById(id);
    res.render("listings/edit.ejs", { item })
}))

router.put("/:id", isLoggedIn,isOwner, validateSchema, wrapAsync(async (req, res) => {
    const id = req.params.id;

    const updatedData = {
        ...req.body,
        image: {
            url: req.body.image
        }
    };
    let listing = await Listing.findById(id);
    await listing.updateOne(updatedData);

    res.redirect(`/listing/${id}`);
}));


router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listing");
}))


module.exports = router;