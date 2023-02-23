import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import isAuth from './utils/isAuth.js'
import { getMe, login, register } from './controllers/user_controller.js'
import { loginValidator, registerValidator } from './validations.js'
import handleErrors from './utils/handleErrors.js'
import { createCard, getAllCards, getOneCard, removeCard } from './controllers/card_controller.js'
const app = express()
// подключение к БД
mongoose
    .connect(`mongodb+srv://kulikovps2004:Werbi_223@cluster0.zr0hleh.mongodb.net/banking-transaction?retryWrites=true&w=majority`)
    .then(() => { console.log("DB ok") })
    .catch((err) => { console.log("DB error", err) })

app.use(express.json());
app.use(cors())
// регистрация
app.get('/auth/me', isAuth, getMe) // Аутентификация
app.post('/auth/login', loginValidator, handleErrors, login) // Войти
app.post('/auth/register', registerValidator, handleErrors, register) // Зарегистрироваться

// действия с картами
app.get('/cards', isAuth, getAllCards) // Запросить все свои карты
app.get('/cards/:id', isAuth, getOneCard) // Запросить конкретную карту
app.post('/card', isAuth, createCard) // Выпустить новую карту
app.delete('/cards/:id', isAuth, removeCard) // Закрыть карту

// запуск сервера
app.listen(4000, (err) => {
    if (err) console.log(err)
    console.log("Server ok")
})