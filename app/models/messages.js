var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg_datetime: Date,
    msg_text: String,
    msg_chat_name: String,
    msg_user_name: String
}));
