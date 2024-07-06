const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const {body} = require('express-validator'); /* (для валидации тела запроса) */

const router = new Router();

/* (создаем пути для эндпоинтов) */
router.post('/registration',
    /* (при регистрации данные пропускаем через функцию проверки, результаты используем в user-controller.js) */
    body('email').isEmail(), 
    body('password').isLength({min: 3, max: 32}),
    userController.registration); /* (для регистрации) */
router.post('/login', userController.login); /* (для логина) */
router.post('/logout', userController.logout); /* (выйти из аккаунта, удалит refresh-token) */
router.get('/activate/:link', userController.activate); /* (активация аккаунта по ссылке, которая будет приходить на почту) */
router.get('/refresh', userController.refresh); /* (для перезаписи access-токена с помощью refresh-токена) */
router.get('/users', userController.getUsers); /* (тестовый запрос для получения списка пользователей(для авторизованных)) */

module.exports = router; /* (подключаем в корневой index.js) */
