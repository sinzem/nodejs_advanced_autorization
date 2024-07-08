import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
/* (настраиваем axios) */
export const API_URL = `http://localhost:5000/api`; /* (адрес сервера) */

/* (создаем переменную для отправки запросов) */
const $api = axios.create({
    withCredentials: true, /* (опция позволит aвтоматически прикреплять куки к запросам) */
    baseURL: API_URL
})

/* (интерцепторы для запроса/ответа - вспомогательные функции, перехватывающие запрос/ответ и обрабатывающие их) */
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}) /* (интерцептор на запрос примет из axios config и к заголовкам присоединит access-token из локального хранилища) */

/* (интерцептор для ответа, сработает на ошибку 401 - отсутствие авторизации(по окончании срока действия access-токена выдаст 401, интерцептор должен отправить запрос на refresh - обновить токены, и снова отправить изначальный запрос с новыми токенами)) */
$api.interceptors.response.use((config) => { 
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) { /* (проверка на статус и повторение(чтобы не зациклился)) */
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            console.log("Не авторизован!");
        }
    }
    throw error;
})

export default $api;