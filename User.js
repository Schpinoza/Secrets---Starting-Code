const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');
// const md5 = require("md5")




const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema)