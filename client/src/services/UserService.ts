import $api from '../http';
import {AxiosResponse} from 'axios';
import { IUser } from '../models/IUser';

/* (создаем класс с функцией для эндпоинта по получению списка пользователей) */
export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users');
    }
}
