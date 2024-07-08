import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Store from './store/store'; /* (подключаем состояния) */

interface State {
  store: Store
} /* (типизируем состояния) */

const store = new Store(); /* (создаем новый экземпляр класса состояний) */

export const Context = createContext<State>({
  store
}) /* (создаем контекст, помещаем в него состояния) */

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context.Provider value={{store}}> {/* (оборачиваем приложение в провайдер, куда передаем состояния) */}
      <App />
    </Context.Provider>
  </React.StrictMode>
);

