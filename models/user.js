const mongoose = require("mongoose");
let passportLocalMongoose = require("passport-local-mongoose");

passportLocalMongoose =
    passportLocalMongoose.default || passportLocalMongoose;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email", // 
});

module.exports = mongoose.model("User", userSchema);
