const ApiError = require('../exceptions/api-error');
const userService = require('../service/user-service');
const {validationResult} = require('express-validator'); /* (функция для получения результатов валидатора для запросов(из роутера)) */
/* (cb-функции для эндпоинтов) */
class UserController {
    async registration(req, res, next) {
        try { /* (cb-функция для эндпоинта регистрации) */
            const errors = validationResult(req); /* (функция примет ошибки при валидации запроса из роутера) */
            if (!errors.isEmpty()) { /* (если есть ошибки, выдаем сообщение) */
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password} = req.body; /* (достаем данные из запроса) */
            const userData = await userService.registration(email, password); /* (передаем в сервис, генерируем токены) */
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); /* (помещаем токен в куки, передаем имя, значение, срок хранения в мс, разрешение только для запросов, JS внутри браузера его не изменяет, также можно добавить опцию secure) */
            return res.json(userData); /* (проверяем через postman, вернуло 2 токена и обьект пользователя, расшифровываем токен онлайн(jwt.io) - вернуло обьект юзера) */
        } catch (e) {
            next(e); /* (запустит миддлвер для обработки ошибок) */
        }
    }

    async login(req, res, next) {
        try { /* (cb-функция для эндпоинта входа в аккаунт) */
            const {email, password} = req.body;
            const userData = await userService.login(email, password); /* (передаем в сервис, генерируем токены) */
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); /* (помещаем токен в куки, передаем имя, значение, срок хранения в мс, разрешение только для запросов, JS внутри браузера его не изменяет, также можно добавить опцию secure) */
            return res.json(userData);
        } catch (e) {
            next(e); /* (запустит миддлвер для обработки ошибок) */
        }
    }

    async logout(req, res, next) {
        try { /* (cb-функция для эндпоинта выхода из аккаунта) */
            const {refreshToken} = req.cookies; /* (получаем токен) */ 
            const token = await userService.logout(refreshToken); /* (запускаем сервис) */
            res.clearCookie('refreshToken'); /* (удаляем токен из куков) */
            return res.json(token); /* (какой-нибудь ответ на пользователя) */
        } catch (e) {
            
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link; /* (получаем ссылку активации) */
            await userService.activate(activationLink); /* (запускаем сb-функцию активации) */
            return res.redirect(process.env.CLIENT_URL); /* (перенаправляем пользователя на нужную страницу) */
        } catch (e) {
            next(e);  /* (запустит миддлвер для обработки ошибок) */
        }
    }

    async refresh(req, res, next) { /* (обновление токена) */
        try {
            const {refreshToken} = req.cookies; /* (получаем токен) */ 
            const userData = await userService.refresh(refreshToken); /* (запускаем сервис) */
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); /* (добавляем токен в куки) */
            return res.json(userData); /* (какой-нибудь ответ на пользователя) */
        } catch (e) {
            next(e);  /* (запустит миддлвер для обработки ошибок) */
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);  /* (запустит миддлвер для обработки ошибок) */
        }
    }
}

module.exports = new UserController();