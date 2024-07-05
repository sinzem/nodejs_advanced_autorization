
/* (data transfer object - при генерации токена нужны не все поля из БД, этот класс по сути отсеет лишние, подключаем в user-service.js) */
module.exports = class UserDto {
    email; 
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}