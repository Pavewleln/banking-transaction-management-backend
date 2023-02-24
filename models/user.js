import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    fullname: { // Имя
        type: String,
        required: true
    },
    email: { // Почта
        type: String,
        required: true,
        unique: true
    },
    passwordHash: { // Зашифрованный пароль
        type: String,
        required: true
    },
    avatarUrl: String
}, {
    timestamps: true
})

export default mongoose.model("User", UserSchema)