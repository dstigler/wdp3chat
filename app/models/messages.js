var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
Rooms = require('./room');
User = require('./user');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg_datetime: Date,
    msg_text: String,
    msg_chat_id: ObjectId,
    msg_user_id: ObjectId
}));
