const mongoose = require("mongoose");
const passportlocalmongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, requied: true},
    roles: {
        role: {type: mongoose.Schema.Types.ObjectId, requied: true},
        role_name: {type: String, required: true},
        isAdmin: {type: Boolean, required: true}
    },
    name: {type: String, required: true}
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", userSchema);