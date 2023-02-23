import mongoose from 'mongoose'

const CardSchema = new mongoose.Schema({
    dateOfCreation: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model("Card", CardSchema)