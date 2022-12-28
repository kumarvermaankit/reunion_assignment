// User model schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    
    following: {
        type: Array,
    },
    followers: {
        type: Array,
    },
    password: {
        type: String,
    }
    


}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);
