var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var connect = mongoose.connect('mongodb://127.0.0.1:27017/android');
autoIncrement.initialize(connect);

var UserSchema = new Schema({
    userID: {
        type: String,
        required: [true, '아이디는 필수입니다.']
    },
    userPassword: {
        type: String,
        required: [true, '비밀번호는 필수입니다.']
    },

    userName: {
        type: String,
        required: [true, '닉네임은 필수입니다.']
    },

    userAge: {
        type: String,
        required: [true, '이메일은 필수입니다.']
    },

    created_at: {
        type: Date,
        default: Date.now()
    }
});

UserSchema.plugin(autoIncrement.plugin, {model: 'user', field: "id", startAt: 1});
module.exports = mongoose.model('user', UserSchema);