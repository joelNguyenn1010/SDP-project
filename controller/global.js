var global = {};
var Seminar = require('./../model/seminar');
global.checkSeminar = (req, res, next) => {
    var today = new Date();

    Seminar.find(
        {
            date:
            {
                $lt: today
            }
        },
        (err, found) => {
            deleteOutDateSeminar(found);
        }
    )
}

var deleteOutDateSeminar = (seminars) => {
    
    if (seminars) {
        seminars.forEach((id) => {
            Seminar.deleteOne( { _id: id._id }, (err, result)=> {
                console.log(err);
                console.log(result);
            });
        })
    }
}

module.exports = global;