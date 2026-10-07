# MindHub — Backend

REST API продуктивити-платформы **MindHub**: авторизация с ролями и правами, задачи (todos) и журнал действий пользователей.

Связанный репозиторий frontend: [MindHub-frontend](https://github.com/Shadowharm/MindHub-frontend)

## Стек технологий

- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose** — хранение данных
- **JSON Web Token** — access-токены, ротация через refresh-токен в отдельной коллекции
- **bcrypt** — хеширование паролей
- **Nodemailer** — отправка письма активации аккаунта
- **cookie-parser**, **cors** — работа с cookies и кросс-доменными запросами
- **express-validator** — валидация входных данных

## Функциональность

- **Аутентификация**: регистрация с активацией по email, вход/выход, access/refresh-токены (access живёт 60 секунд, refresh хранится в БД и ротируется)
- **Роли и права**: модель `Role` с кодом, названием и списком permissions; при старте сервера создаётся администратор по умолчанию (`initAdmin.ts`)
- **Пользователи**: CRUD поверх профиля пользователя
- **Todos**: создание, получение, обновление и удаление задач, привязанных к пользователю через `todosToken`
- **Журнал действий (Logs)**: middleware логирует каждый запрос (URL, код ответа, ошибку) в отдельную коллекцию — простая база для аудита API

## Архитектура

Модульная структура по доменам — каждый модуль содержит модель, сервис, контроллер и роуты:

```
src/
├── auth/        # Регистрация, вход, middleware проверки токена
├── users/       # Пользователи
├── roles/       # Роли и права доступа
├── tokens/      # Хранение и ротация refresh-токенов
├── todos/       # Задачи
├── logs/        # Журналирование запросов
├── mail/        # Отправка писем (активация аккаунта)
├── middlewares/ # Общие middleware (ошибки, защита маршрутов)
├── exceptions/  # Класс ApiError для единообразных ошибок API
├── routes.ts    # Сборка всех роутов под /api
└── index.ts     # Точка входа, подключение к MongoDB, запуск сервера
```


## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте `.env` в корне проекта со значениями:
   ```env
   PORT=3001
   DB_URL=mongodb://localhost:27017/mindhub
   JWT_ACCESS_SECRET=your_secret
   CLIENT_URL=http://localhost:3000
   API_URL=http://localhost:3001
   # + настройки SMTP для Nodemailer
   ```
3. Запустите в режиме разработки:
   ```bash
   npm run dev
   ```
   Или соберите и запустите production-сборку:
   ```bash
   npm run build
   npm start
   ```

## Автор

[Shadowharm](https://github.com/Shadowharm)
