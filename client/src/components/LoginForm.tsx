import { FC, useContext, useState } from "react";
import {Context} from '../index'; /* (подключаем контекст, чтобы использовать store c состояниями) */
import {observer} from 'mobx-react-lite'; /* (для отслеживания изменений в store) */

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {store} = useContext(Context); /* (получаем состояния, вешаем действия на кнопки) */

    return (
        <div>
            <input type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Email' 
            />  

            <input type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Password' 
            />      
            <button onClick={() => store.login(email, password)}>
                Логин
            </button>  
            <button onClick={() => store.registration(email, password)}>
                Регистрация
            </button>
        </div>
    );
};

export default observer(LoginForm); /* (подключаем в App.tsx, оборачиваем в observer для отслеживания изменений в store) */