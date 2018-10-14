const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: { type: String, required: [true, "Please provide full name"], maxlength: [65, "You have reach the maximum length of the name"], minlength: [5, "Input must greater than 5"] },
    phone: {
        type: Number,
        unique: true,
        validate: {
            validator: function (v) {
                return /\d{9}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number is required']
    },
    email: {
        type: String,
        maxlength: [255, "The email should be in 20 character"],
        minlength: [5, "Input must greater than 5"],
        unique: true,
        validate: {
            validator: (e) => {
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(e);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    seminars: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Seminar'
        // type: String
    }]

});


module.exports = mongoose.model("Attendee", Schema);