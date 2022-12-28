// Comments model schema

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment: {
        type: String,
    },
    userId: {
        type: String,
    },
    postId: {
        type: String,
    }


},{timestamps: true});

module.exports = mongoose.model('Comment', CommentSchema);