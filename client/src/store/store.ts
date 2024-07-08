import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import {IUser} from '../models/IUser';
import AuthService from '../services/AuthService';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';

/* (с помощью MobX создаем глобальное состояние(необходимо подключить в корневой index.tsx)) */
export default class Store {
    /* (у состояния будет два поля - обьект с данными пользователя и флажек авторизации) */
    user = {} as IUser;
    isAuth = false;
    isLoading = false; /* (для отображения процесса загрузки) */

    constructor() {
        makeAutoObservable(this); /* (автоматически следит за изменениями) */
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }
    /* (действия для состояний) */
    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    /* (фунуции для эндпоинтов - при отработке изменят состояния) */
    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            console.log(response);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async registration(email: string, password: string) {
        try {
            const response = await AuthService.registration(email, password);
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        }
    }

    /* (для проверки авторизации пользователя, отработает при загрузке, вызываем в App.tsx) */
    async checkAuth() {
        this.setLoading(true); /* (для анимации загрузки) */
        try {
            /* (используем get-запрос от axios(без интерцептора $api) - направляем на эндпоинт обновления токена, добавляем разрешение на обмен куками) */
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e: any) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false); 
        }
    } 
}