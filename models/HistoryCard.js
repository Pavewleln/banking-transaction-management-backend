import mongoose from 'mongoose'

const HistorySchema = new mongoose.Schema({
    recipient: { // Отправитель
        type: String,
        required: true
    },
    date: { // Дата 
        type: String,
        required: true
    },
    sum: { // Сумма
        type: Number,
        required: true
    },
    card: { // Карта
        type: Number,
        required: true
    },
    currency: { // Валюта
        type: String,
        required: true
    },
    user: { // Владелец
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    moneyType: { // Тип денег: перечисления, пополнения, счета или кредиты
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("History", HistorySchema)