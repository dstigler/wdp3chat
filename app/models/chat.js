var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Rooms', new Schema({
    chat_name: String,
    deleteable: Boolean
}));
