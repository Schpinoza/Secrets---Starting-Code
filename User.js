const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")



const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

module.exports = mongoose.model("User", userSchema)