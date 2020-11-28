const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = {
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : Schema.Types.ObjectId,
        required: true,
        ref : 'Role'
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
    email : {
        type : String,
        default : 'No email'
    }
}

const User = mongoose.model('User', new Schema(userSchema), 'users');

module.exports.User = User;
module.exports.buildUserEntity = (userObject) => new User(Object.freeze(userObject));