const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {type: String, required: [true, "Please provide full name"], maxlength: [65, "You have reach the maximum length of the name"]},
    info: {type: String}
    
});


module.exports = mongoose.model("Speaker", Schema);