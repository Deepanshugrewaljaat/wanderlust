const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path")
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
const flash = require("connect-flash");

const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

async function main() {
    await mongoose.connect(process.env.ATLAS_URL);
}

main().then(() => {
    console.log("Connected to DATABASE");
}).catch((err) => {
    console.log(err);
})
app.set("trust proxy", 1);

const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
    stringify: false,   
});

app.use(
    session({
        store,
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(
    new LocalStrategy(
        { usernameField: "email" }, // 🔥 fix
        User.authenticate()
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listing", listingsRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);
app.get("/", (req, res) => {
    return res.redirect("/listing");
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);   // ✅ VERY IMPORTANT
    }

    let { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("error.ejs", { message });
});
app.listen(9000, () => {
    console.log("APP IS LISTENING");
})