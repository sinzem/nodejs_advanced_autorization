const ApiError = require('../exceptions/api-error');

/* (миддлвер для обработки ошибки - сравнит, подходит ли случай к описанным в классе) */
module.exports = function (err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: 'Неопределенная ошибка'});
} /* (подключаем в миддлверы в index.js) */