// require('dotenv').config();
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {
    /* (функция генерации токенов) */
    generateTokens(payload) { /* (при вызове примет значение, которое нужно зашифровать) */
        /* (при шифровании передаем шифруемую информацию(payload), секретный код(любое слово) и срок годности токена) */
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    /* (функция сохранит refresh-токен в БД по id пользователя - данный вариант подходит, если пользователь работает из одного устройства(при входе с другого будет перерегистрация и старый токен переписан)) */
    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId}); /* (проверяем БД на наличие этого пользователя) */
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        } /* (если по данному id уже есть токен - перезаписываем, id оставляем) */
        const token = await tokenModel.create({user: userId, refreshToken}); /* (если еще нету - создаем новую запись) */
        return token;
    }
}

module.exports = new TokenService(); /* (понадобится в user-service.js) */