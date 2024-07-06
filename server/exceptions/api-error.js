/* (класс для обработки ошибок) */
module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message); 
        this.status = status;
        this.errors = errors;
    }

    /* (статические методы - для вызова не обязательно создавать экземпляр класса) */
    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
} /* (обрабатывать будем через миддлвер error-middleware.js, подключаем в местах возможных ошибок) */