const nodemailer = require('nodemailer');

/* (создаем почтовый сервис для отправки письма пользователю) */
/* (для отправки у себя в настройках почты(gmail) во вкладке Пересылка и POP/IMAP активируем IMAP, также нужны smtp-настройки, вынес в .env) */
class MailService {

    constructor() {
        /* (инициализируем почтовый клиент, как настройки вносим настройки smtp от goodle) */
        this.transporter = nodemailer.createTransport({ 
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER, /* (почтовый ящик, с которого будем отправлять) */
                pass: process.env.SMTP_PASSWORD /* (пароль для него(в google - пароли для сторонних приложений)) */
            }
        })
    }
    /* (настройки письма, примет адрес пользователя и ссылку активации) */
    async sendActivationMail(to, link) { 
        await this.transporter.sendMail({ /* (отправляем с помощью sendMail) */
            from: process.env.SMTP_USER, /* (от кого) */
            to, /* (кому) */
            subject: 'Активация аккаунта на ' + process.env.API_URL, /* (тема, добавляем имя сайта) */
            text: '', /* (вместо сообщения идет ссылка ниже) */
            html: 
                `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `
        })
    }
}

module.exports = new MailService(); /* (используем в user-service.js) */