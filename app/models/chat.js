var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Chat', new Schema({
    chat_name: String,
    deleteable: Boolean
}));
