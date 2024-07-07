import { IUser } from "../IUser";

/* (типизация для ответа при регистрации/логине) */
export interface AuthResponce {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}