const {Schema, model} = require('mongoose');

/* (схема записи токена пользователя в MongoDB) */
const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"}, /* (привязываем к id пользователя) */
    refreshToken: {type: String, required: true} /* (сам токен) */
});

module.exports = model('Token', TokenSchema);