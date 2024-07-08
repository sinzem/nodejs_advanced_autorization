import { IUser } from "../IUser";

/* (типизация для ответа при регистрации/логине) */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}