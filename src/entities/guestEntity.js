const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const guestSchema = {
    room_id : {
        type : Schema.Types.ObjectId,
        required: true,
        ref : 'Room'
    },
    status : {
        type : Boolean,
        default : false
    },
    fullName : {
        name : {
            type : String,
            required : true
        },
        lastName1 : {
            type : String,
            required : true
        },
        lastName2 : {
            type : String,
            required : true
        }
    },
    age : {
        type : Number,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    email : {
        type : String,
        default : 'No email'
    },
    phone : {
        type : String,
        default : 'No phone'
    }
}

const Guest = mongoose.model('Guest', new Schema(guestSchema), 'guests');

module.exports.Guest = Guest;
module.exports.buildGuestEntity = (guestObject) => new Guest(Object.freeze(guestObject));