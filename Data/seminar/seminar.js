class Seminar {
    constructor(build) {
       this.name = build.name;
       this.abstract = build.abstract;
       this.date = build.date;
       this.speaker = build.speaker;
       this.time = build.time;
       this.duration = build.duration;
       this.venue = build.venue;
       this.capacity = build.capacity;
       this.attendees = build.attendees;
       this.organiser = build.organiser;
       this.organiser_name = build.organiser_name;
    }
}
module.exports = class Builder {
          constructor(name) {
             this.name = name;
          }
          buildAbstract(abstract) {
             this.abstract = abstract;
             return this;
          }
          setDate(date) {
             this.date = date;
             return this;
          }
          buildSpeaker(speaker) {
            this.speaker = speaker;
            return this;
         }
         setTime(time) {
            this.time = time;
            return this;
         }
         setDuration(duration) {
            this.duration = duration;
            return this;
         }
         buildVenue(venue) {
            this.venue = venue;
            return this;
         }
         setCapacity(capacity) {
            this.capacity = capacity;
            return this;
         }
         buildAttendees(attendees) {
             this.attendees = attendees;
             return this;
         }
         buildOrganiser(organiser) {
             this.organiser = organiser;
             return this;
         }
         buildOrganiser_name(organiser_name) {
             this.organiser_name = organiser_name;
             return this;
         }
          build() {
             return new Seminar(this);
          }
       }

    
 