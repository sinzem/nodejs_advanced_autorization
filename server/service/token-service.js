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

    validateAccessToken(token) { 
        try {
            /* (проверка токена доступа - передаем сам токен и ключевое слово) */
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
    /* (функции валидации используются при обновлении токенов) */
    validateRefreshToken(token) {
        try {
            /* (проверка refresh-токена - передаем сам токен и ключевое слово) */
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    /* (функция для поиска токена в БД) */
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }

    /* (функция для удаления токена из БД) */
    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService(); /* (понадобится в user-service.js) */