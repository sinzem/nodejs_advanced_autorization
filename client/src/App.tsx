import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import {observer} from 'mobx-react-lite'; /* (для отслеживания изменений в store) */
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const App: FC = () => {

    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth();
        }
    }, []) /* (при загрузке проверяем наличие токена в LS, если есть - запускаем проверку авторизации) */

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    if (store.isLoading) { 
        return <div>Загрузка...</div>
    }

    if (!store.isAuth) {
        return (
            <>
            <LoginForm />
            <div>
                <button onClick={getUsers}>Получить пользователей</button>
            </div></>
        )
    }

    return (
        <div>
            <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}`: "АВТОРИЗУЙТЕСЬ"}</h1>
            <h1>{store.user.isActivated ? `Аккаунт подтвержден по почте` : `ПОДТВЕРДИТЕ АККАУНТ!!!`}</h1>
            <button onClick={() => store.logout()}>Выйти</button>
            <div>
                <button onClick={getUsers}>Получить пользователей</button>
            </div>
            {users.map(user => 
                <div key={user.email}>{user.email}</div>
            )}
        </div>
    );
}

export default observer(App); /* (оборачиваем приложение в observer для отслеживания изменений в store) */
