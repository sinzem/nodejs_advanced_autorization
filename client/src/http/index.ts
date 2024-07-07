import axios from 'axios';

export const API_URL = `http://localhost:5000`; /* (адрес сервера) */

const $api = axios.create({
    withCredentials: true, /* (опция позволит фвтоматически прикреплять куки к запросам) */
    baseURL: API_URL
})

/* (интерцепторы для запроса/ответа - вспомогательные функции, перехватывающие запрос/ответ и обрабатывающие их) */
$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}) /* (интерцептор на запрос примет из axios config и к заголовкам присоединит access-token и локального хранилища) */

export default $api;