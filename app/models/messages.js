var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg_datetime: Date,
    msg_text: String,
    msg_chat_id: ObjectId,
    msg_user_id: ObjectId
}));
