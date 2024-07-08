import $api from '../http';
import {AxiosResponse} from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';

/* (создаем класс с функциями для эндпоинтов, все типизируем) */
export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> { /* (функция должна вернуть промис, типизируем соответственно, в дженерик помещаем типизацию от axios с ожидаемым типом ответа - AuthResponse - двумя токенами и обьектом с информацией о пользователе) */
        return $api.post<AuthResponse>('/login', {email, password});
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/registration', {email, password});
    }

    static async logout(): Promise<void> {
        return $api.post('/logout');
    }
}

