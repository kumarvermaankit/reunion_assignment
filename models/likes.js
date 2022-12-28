// create likes model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LikeSchema = new Schema({
    userId: {
        type: String,
    },
    postId: {
        type: String,
    }

},{timestamps: true})

module.exports = mongoose.model('Like', LikeSchema);