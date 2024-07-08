const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) { /* (next запускает следующий миддлвер в цепочке) */
    try {
        const authorizationHeader = req.headers.authorization; /* (получаем поле авторизации из заголовков) */
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1]; /* (получаем сам токен из заголовков(изначально состоит из двух частей - Bearer token)) */
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken); /* (валидируем токен) */
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData; /* (если токен валидный, добавляем соответственное значение к запросу) */
        next(); /* (next запускает следующий миддлвер в цепочке) */
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
} /* (подключаем в эндпоинт по получению пользователей из БД в router/index.js) */