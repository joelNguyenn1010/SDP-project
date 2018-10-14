const mongoose = require("mongoose");
const datetime = require('node-datetime');

const Schema = new mongoose.Schema({
    name: {type: String, unique: [true, "The seminar with the given name already exist"],required: [true, "Please provide full name"],minlength: [5, "Minimum length for venue should be more than 5 character!"], maxlength: [200, "You have reach the maximum length of the name"]},
    abstract: {type: String, minlength: [20, "Minimum length for venue should be more than 5 character!"]},
    date: {type: Date, 
        required: [true, "Please input date"]
    ,          validate: { validator: (e) => {
            var date = e.getDate();
            var newDate = new Date();
            var mothn = e.getMonth()+1;
            var checkmonth = newDate.getMonth()+1;
            var checking = newDate.getDay()-1;

            // console.log(mothn);
            // console.log(checkmonth);
            // console.log(date);
            // console.log(checking);
            // console.log(mothn >= checkmonth ? true : false);
            console.log(e >= newDate ? true : false);
             if(e >= newDate) {
                 return true;
             } else {
                 return false;
             }
         },
            message: props => `Date is not valid!`
             }

},
    speaker: [{type: String, minlength: [5, "Minimum length for venue should be more than 5 character!"]}],
    time: {type: String,
         required: [true, "Please input time"]
        //  validate: { validator: (e) => {
        //     return /([0-24]{2}):([0-60]{2})/.test(e);
        // },
        //     message: props => `${props.value} is not a valid time!`
        //     }
    },
    duration: {type: [Number, "Please input number" ], required: [true, "Please input duration"], max: [24, "The seminar should last in one day"]},
    venue: {type: String, unique: [true, "There is a seminar with this venue"],require: [true, "Please input venue"], minlength: [5, "Minimum length for venue should be more than 5 character!"] },
    capacity: {type: Number, required: [true, "please input capacity"],
    validate: { validator: (e) => {

         if(e >= 1) {
             return true;
         } else {
             return false;
         }


     },
            message: props => `Capacity must have at least one!`
             }


},
    attendees: [{
        name: {type: String},
        phone: {type: Number},
        email: {type: String}
    }],
    organiser: {type: mongoose.Schema.Types.ObjectId, ref: 'Orginiser'},
    organiser_name: {type: String, required: [true, "Its seem the system can't find your name in this account, please contact UTS support"]}
});


module.exports = mongoose.model("Seminar", Schema);