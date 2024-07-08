require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;

const app = express(); /* (создаем сервер) */

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, /* (разрешение на куки) */
    origin: process.env.CLIENT_URL /* (адрес клиент-приложения) */
})); /* (настройки обмена куками) */
app.use('/api', router);
app.use(errorMiddleware); /* (миддлвер для обработки ошибок подключается последним в цепочке миддлверов) */

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
           /*  useNewUrlParser: true,
            useUnifiedTopology: true */
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();