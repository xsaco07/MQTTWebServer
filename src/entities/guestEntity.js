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
            default : ''
        }
    },
    age : {
        type : Number,
        required : true
    },
    country : {
        type : String,
        default : 'No country'
    },
    email : {
        type : String,
        required : true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    phone : {
        type : String,
        default : 'No_phone'
    }
}

const Guest = mongoose.model('Guest', new Schema(guestSchema), 'guests');

module.exports.Guest = Guest;
module.exports.buildGuestEntity = (guestObject) => new Guest(Object.freeze(guestObject));