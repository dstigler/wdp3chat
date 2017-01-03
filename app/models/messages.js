var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg_datetime: Date,
    msg_text: String,
    msg_chat_id: ObjectID,
    msg_user_id: ObjectID
}));
