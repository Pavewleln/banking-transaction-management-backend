
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
    try{   
        console.log(req.body)
        console.log(JSON.stringify(req.body))
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
    
        const doc = new UserModel({
            email: req.body.email,
            fullname: req.body.fullname,
            passwordHash: hash,
        })
    
        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        },
        'secret123',
        {
            expiresIn: '30d'
        })
    
        res.json({
            token
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось зарегистрироваться"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: "Неверный логин или пароль"
            })
        }
        const isValidpassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)
        if(!isValidpassword) {
            return res.status(404).json({
                message: "Неверный логин или пароль"
            })
        }
        const token = jwt.sign({
            _id: user._id
        },
        'secret123',
        {
            expiresIn: '30d'
        })
    
        res.json({
            token
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось авторизоваться"
        })
    }
}

export const getMe = async (req, res) => {
    try{
        const user = await UserModel.findById(req.userId)

        if(!user) {
            res.status(404).json({
                message: "не найден"
            })
        }
        const {passwordHash, ...userData} = user._doc
    
        res.json({...userData})

    } catch (e) {
        console.log(e)
        res.status(404).json({
            message: "Нет доступа"
        })
    }
}