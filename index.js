import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import isAuth from './utils/isAuth.js'
import { getMe, login, register } from './controllers/user_controller.js'
import { loginValidator, registerValidator } from './validations.js'
import handleErrors from './utils/handleErrors.js'
const app = express()
mongoose
    .connect(`mongodb+srv://kulikovps2004:Werbi_223@cluster0.zr0hleh.mongodb.net/banking-transaction?retryWrites=true&w=majority`)
    .then(() => { console.log("DB ok") })
    .catch((err) => { console.log("DB error", err) })

app.use(express.json());
app.use(cors())

app.get('/auth/me', isAuth, getMe)
app.post('/auth/login', loginValidator, handleErrors, login)
app.post('/auth/register', registerValidator, handleErrors, register)

app.listen(4000, (err) => {
    if (err) console.log(err)
    console.log("Server ok")
})