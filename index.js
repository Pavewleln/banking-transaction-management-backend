import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import isAuth from './utils/isAuth.js'
import { getMe, login, register, update } from './controllers/user_controller.js'
import { loginValidator, registerValidator } from './validations.js'
import handleErrors from './utils/handleErrors.js'
import { createCard, getAllCards, getAllCardsNumbers, getOneCard, removeCard, transferMoney } from './controllers/card_controller.js'
import { AddTransferInHistory, getAllHistoryCard, getAllHistoryUser, getOneHistory } from './controllers/history_transfer.js'
const app = express()
import multer from 'multer'
// подключение к БД
mongoose
    .connect(`mongodb+srv://kulikovps2004:Werbi_223@cluster0.zr0hleh.mongodb.net/banking-transaction?retryWrites=true&w=majority`)
    .then(() => { console.log("DB ok") })
    .catch((err) => { console.log("DB error", err) })

// Чтобы все приходило в json формат
app.use(express.json());

// Чтобы локальный сервер работал
app.use(cors())

// Чтобы хранить данные по типу фото
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storage})

// Пользователь //
app.get('/auth/me', isAuth, getMe) // Аутентификация
app.post('/auth/login', loginValidator, handleErrors, login) // Войти
app.post('/auth/register', registerValidator, handleErrors, register) // Зарегистрироваться
app.patch('/auth/update', isAuth, update) // Изменение данных
app.post('/upload', isAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
}) // Загрузка фото на сервер. НО НЕ ДОБАВЛЕНИЕ В USER!!!


// Действия с картами // 
app.get('/cards/all', isAuth, getAllCards) // Запросить все свои карты
app.get('/cards/all/numbers', isAuth, getAllCardsNumbers) // Запросить номера всех своих карт
app.get('/cards/:number', isAuth, getOneCard) // Запросить конкретную карту
app.post('/cards/create', isAuth, createCard) // Выпустить новую карту
app.delete('/cards/:id', isAuth, removeCard) // Закрыть карту
app.post('/cards/transfer', isAuth, transferMoney) // Перевести деньги

// История //
app.post('/history', isAuth, AddTransferInHistory) // Добавить в историю
app.get('/history/card/:cardNumber', isAuth, getAllHistoryCard) // Вывести историю карты
app.get('/history/all', isAuth, getAllHistoryUser) // Вывести всю историю пользователя
app.get('/history/:id', isAuth, getOneHistory) // Вывести определенную историю

// Счет //
// Перевод денег с карты на счет
// Перевод со счета на карту

// Кредит //
// Пока хз))))))))
// 
// 

// запуск сервера //
app.listen(4000, (err) => {
    if (err) console.log(err)
    console.log("Server ok")
})