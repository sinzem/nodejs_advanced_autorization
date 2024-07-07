import $api from '../http';
import {AxiosResponse} from 'axios';
import { AuthResponce } from '../models/response/AuthResponse';

/* (создаем класс с функциями для эндпоинтов, все типизируем) */
export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponce>> {
        return $api.post<AuthResponce>('/login', {email, password});
    }

    static async registration(email: string, password: string): Promise<AxiosResponse<AuthResponce>> {
        return $api.post<AuthResponce>('/registration', {email, password});
    }

    static async logout(): Promise<void> {
        return $api.post('/logout');
    }
}

