// Post model Schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    
    userId:{
        type: String,
    }


},{timestamps: true})

module.exports = mongoose.model('Post', PostSchema);