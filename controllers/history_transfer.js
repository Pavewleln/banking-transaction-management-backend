import HistoryCardModel from "../models/HistoryCard.js"
import { TYPE_MONEY_ACCOUNT, TYPE_MONEY_CREDIT, TYPE_MONEY_RECEIVING, TYPE_MONEY_TRANSFER } from "../types.js"
import { dateofCreatedCard } from "../utils/dateOfCreatedCard.js"

export const AddTransferInHistory = async (req, res) => {
    try {
        if(req.body.moneyType !== TYPE_MONEY_RECEIVING && req.body.moneyType !== TYPE_MONEY_TRANSFER && req.body.moneyType !== TYPE_MONEY_ACCOUNT && req.body.moneyType !== TYPE_MONEY_CREDIT){
            return res.status(404).json({
                message: "Не указан тип перевода"
            })
        }

        const doc = new HistoryCardModel({
            recipient: req.body.recipient,
            date: dateofCreatedCard(),
            sum: req.body.sum,
            card: req.body.card,
            currency: req.body.currency,
            user: req.userId,
            moneyType: req.body.moneyType
        })
        const history = await doc.save()
        res.json(history)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось добавить в историю переводов"
        })
    }
}

export const getAllHistoryCard = async (req, res) => {
    try {
        const histories = await HistoryCardModel.find({ card: req.params.cardId })
        res.json(histories)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить историю переводов"
        })
    }
}

export const getAllHistoryUser = async (req, res) => {
    try {
        const histories = await HistoryCardModel.find().populate('user').exec()
        res.json(histories)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить историю переводов"
        })
    }
}

export const getOneHistory = async (req, res) => {
    try {
        const history = await HistoryCardModel.findOne({ _id: req.params.id })
        res.json(history)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Не удалось получить информацию"
        })
    }
}