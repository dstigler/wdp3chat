var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
Rooms = require('./room');
User = require('./user');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Message', new Schema({
    msg_datetime: Date,
    msg_text: String,
    msg_chat_id:
        {type: mongoose.Schema.ObjectID,
         ref: 'Rooms'},
    msg_user_id: {
        type: mongoose.Schema.ObjectID,
        ref: 'User'}
}));
