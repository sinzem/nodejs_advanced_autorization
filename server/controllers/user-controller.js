const userService = require('../service/user-service');
/* (cb-функции для эндпоинтов) */
class UserController {
    async registration(req, res, next) {
        try { /* (cb-функция для эндпоинта регистрации) */
            const {email, password} = req.body; /* (достаем данные из запроса) */
            const userData = await userService.registration(email, password); /* (передаем в сервис, генерируем токены) */
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); /* (помещаем токен в куки, передаем имя, значение, срок хранения в мс, разрешение только для запросов, JS внутри браузера его не изменяет, также можно добавить опцию secure) */
            return res.json(userData); /* (проверяем через postman, вернуло 2 токена и обьект пользователя, расшифровываем токен онлайн(jwt.io) - вернуло обьект юзера) */
        } catch (e) {
            console.log(e);
        }
    }

    async login(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async logout(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link; /* (получаем ссылку активации) */
            await userService.activate(activationLink); /* (pfgecrftv сb-функцию активации) */
            return res.redirect(process.env.CLIENT_URL); /* (перенаправляем пользователя на нужную страницу) */
        } catch (e) {
            console.log(e);
        }
    }

    async refresh(req, res, next) {
        try {

        } catch (e) {
            
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json([123, 456]);  /* (тестируем в postman) */
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new UserController();