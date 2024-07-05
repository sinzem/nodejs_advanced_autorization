const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const mailService = require('./mail-service');
const tokenService = require('./token-service');

class UserService {
    /* (функция для регистрации пользователя) */
    async registration(email, password) {
        const candidate = await UserModel.findOne({email}); /* (получаем пользователя с переданным email из БД) */
        if (candidate) {
            throw new Error(`Пользователь с почтовым адресом ${email} уже зарегистрирован`);
        }
        const hashPassword = await bcrypt.hash(password, 3); /* (хешируем пароль перед сохранением в БД) */
        const activationLink = uuid.v4(); /* (с помощью генератора значений создаем активационную ссылку) */
        const user = await UserModel.create({email, password: hashPassword, activationLink}); /* (если пользователь еще не зарегистрирован, создаем запись в БД) */
        await mailService.sendActivationMail(email, activationLink); /* (через почтовый сервис отправляем пользователю на email сыылку активации) */

        const userDto = new UserDto(user); /* (класс UserDto отсеет из обьекта user лишние поля, оставит id, email и флажок об активации) */
        const tokens = tokenService.generateTokens({...userDto}); /* (генерируем токены с полученным обьектом) */
        await tokenService.saveToken(userDto.id, tokens.refreshToken); /* (сохраняем fresh-токен в БД) */

        return {
            ...tokens,
            user: userDto
        } /* (возвращаем два токена и сокращенный обьект с данными о пользователе) */
    }
}

module.exports = new UserService();