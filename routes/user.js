const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})



router.post("/signup", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listing");
        });

    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", "Welcome");
    let redirectUrl = res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
})

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "User logged out successfully");
        res.redirect("/listing")

    })
})

module.exports = router;