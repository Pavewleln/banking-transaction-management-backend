import mongoose from 'mongoose'

const CardSchema = new mongoose.Schema({
    dateOfCreation: { // Дата созлания карты
        type: String,
        required: true
    },
    numberCard: { // Номер карты
        type: String,
        required: true,
        unique: true
    },
    code: { // Три цифры с обратной стороны
        type: Number,
        required: true
    },
    owner: { // Владелец
        type: String,
        required: true
    },
    bankName: { // Название банка
        type: String,
        required: true
    },
    user: { // Владелец
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: { // Баланс
        type: Number,
        required: true
    },
    currency: { // Валюта
        type: String,
        required: true
    },
    typeCard: { // тип карты: дебетовая или кредитная
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Card", CardSchema)