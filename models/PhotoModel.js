var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connect = mongoose.connect('mongodb://127.0.0.1:27017/android');
autoIncrement.initialize(connect);

var PhotoSchema = new Schema({
    thumbnail: String,
    created_at: {
        type: Date,
        default: Date.now()
    }
});

PhotoSchema.plugin(autoIncrement.plugin, {model: 'photo', field: "id", startAt: 1});
module.exports = mongoose.model('photo', PhotoSchema);