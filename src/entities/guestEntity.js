const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const guestSchema = {
    credencials : {
        name : {
            type : String,
            required : true,
            default : 'Nameless_guest'
        },
        lastName1 : {
            type : String,
            required : true,
            default : ''
        },
        lastName2 : {
            type : String,
            required : true,
            default : ''
        }
    },
    email : {
        type : String,
        required : false,
        default : 'No_Email',
        validate: [validateEmail, 'Please fill a valid email address']
    },
    phoneNumner : {
        type : String,
        required : false,
        default : 'No_phoneNumber'
    },
    room_id : {
        type : Schema.Types.ObjectId,
        ref : 'Room'
    },

}

const Guest = mongoose.model('Guest', new Schema(guestSchema), 'guests');

module.exports.Guest = Guest;
module.exports.buildGuestEntity = (guestObject) => new Guest(Object.freeze(guestObject));