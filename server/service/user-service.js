const bcrypt = require('bcrypt');
const uuid = require('uuid');
const UserModel = require('../models/user-model');
const UserDto = require('../dtos/user-dto');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const ApiError = require('../exceptions/api-error');

class UserService {
    /* (функция для регистрации пользователя) */
    async registration(email, password) {
        const candidate = await UserModel.findOne({email}); /* (получаем пользователя с переданным email из БД) */
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже зарегистрирован`);
        }
        const hashPassword = await bcrypt.hash(password, 3); /* (хешируем пароль перед сохранением в БД) */
        const activationLink = uuid.v4(); /* (с помощью генератора значений создаем активационную ссылку(для подтверждения email)) */
        const user = await UserModel.create({email, password: hashPassword, activationLink}); /* (если пользователь еще не зарегистрирован, создаем запись в БД) */
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`); /* (через почтовый сервис отправляем пользователю на email сыылку активации(ссылка представляет собой адрес нашего приложения с прикрепленным номером, сгенерированным для этого пользователя - в сборе - эндпоинт активации(в роутах))) */

        const userDto = new UserDto(user); /* (класс UserDto отсеет из обьекта user лишние поля, оставит id, email и флажок об активации) */
        const tokens = tokenService.generateTokens({...userDto}); /* (генерируем токены с полученным обьектом) */
        await tokenService.saveToken(userDto.id, tokens.refreshToken); /* (сохраняем fresh-токен в БД) */

        return {
            ...tokens,
            user: userDto
        } /* (возвращаем два токена и сокращенный обьект с данными о пользователе) */
    }

    /* (функция активации(для проверки email) - при создании записи юзера в БД ему на почту отправляется ссылка со случайно сгенерированным кодом активации, при переходе по которой он попадает на эндпоинт активации, который запускает эту функцию) */
    async activate(activationLink) { /* (получаем код активации) */
        const user = await UserModel.findOne({activationLink}); /* (ищем юзера с таким кодом) */
        if (!user) { /* (выдаем ошибку, если не нашли) */
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }
        user.isActivated = true; /* (проставляем подтверждение в поле активации, если нашли) */
        await user.save(); /* (сохраняем изменения в БД) */
    }
}

module.exports = new UserService();  /* (подключаем в user-controller.js) */