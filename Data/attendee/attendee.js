const AttendeeModel = require('../../model/attendees');

class Attendee {
    constructor(builder) {
        this.name = builder.name;
        this.phone = builder.phone;
        this.email = builder.email;
        this.seminars = builder.seminars;
    }
}

module.exports = class Builder {
    constructor(name) {
        this.name = name;
    }

    buildPhone(phone) {
        this.phone = phone;
        return this;
    }

    buildEmail(email) {
        this.email = email;
        return this;
    }

    buildSeminars(id) {
        this.seminars = [];
        this.seminars.push(id);
        return this;
    }

    build() {
        console.log(this);
        var newAttendee = new AttendeeModel(new Attendee(this));
        return newAttendee;
    }
}