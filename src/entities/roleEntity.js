const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = {
    roleName : {
        type : String,
        required : true
    },
    roleCode : {
        type : String,
        required : true
    }
}

const Role = mongoose.model('Role', new Schema(roleSchema), 'roles');

module.exports.Role = Role;
module.exports.buildRoleEntity = (roleObject) => new User(Object.freeze(roleObject));