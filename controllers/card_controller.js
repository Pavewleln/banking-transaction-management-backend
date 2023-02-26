import CardModel from '../models/Card.js'
import UserModel from '../models/User.js'
import { CURRENCY_CARD_RUB, CURRENCY_CARD_USD, TYPE_CARD_CREDIT, TYPE_CARD_DEBIT } from '../types.js'
import { dateofCreatedCard } from '../utils/dateOfCreatedCard.js'
import { randomCardCode } from '../utils/randomCardCode.js'
import { randomCardNumber } from '../utils/randomCardNumber.js'

export const getAllCards = async (req, res) => {
    try {
        const cards = await CardModel.find({user: req.userId})
        res.json(cards)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось получить карты"
        })
    }
}

export const getAllCardsNumbers = async (req, res) => {
    try {
        const cards = await CardModel.find({user: req.userId})
        const numbers = cards.map((card) => {
            return card.numberCard
        })
        res.json(numbers)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "не удалось получить карты"
        })
    }
}

export const getOneCard = async (req, res) => {
    try {
        const numberCard = req.params.number;
        const card = await CardModel.findOne({numberCard: numberCard})
        res.json(card)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить карту',
        });
    }
};

export const createCard = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        const { fullname } = user
        const cards = await CardModel.find({user: req.userId})
        if (cards.length >= 3) {
            return res.status(404).json({
                message: "Превышен лимит карт"
            })
        }
        if (req.body.currency !== CURRENCY_CARD_USD && req.body.currency !== CURRENCY_CARD_RUB) {
            return res.status(404).json({
                message: "Карта не поддерживает данную валюту"
            })
        }
        if (req.body.typeCard !== TYPE_CARD_CREDIT && req.body.typeCard !== TYPE_CARD_DEBIT) {
            return res.status(404).json({
                message: "Карта может быть дебетовой или кредитной"
            })
        }

        const doc = new CardModel({
            dateOfCreation: dateofCreatedCard(),
            numberCard: randomCardNumber(),
            code: randomCardCode(),
            owner: fullname,
            bankName: "Zarvic",
            user: req.userId,
            balance: req.body.currency == CURRENCY_CARD_RUB ? 1000 : (1000/60).toFixed(2),
            currency: req.body.currency,
            typeCard: req.body.typeCard
        })

        const card = await doc.save()
        res.json(card)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось создать карту"
        })
    }
}

export const removeCard = async (req, res) => {
    try {
        CardModel.findByIdAndDelete({
            _id: req.params.id
        }, (err, doc) => {
            if(err) {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось удалить карту"
                })
            }
            if(!doc) {
                return res.status(404).json({
                    message: "Карта не найдена"
                })
            }
            res.json({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось удалить карту"
        })
    }
}

export const transferMoney = async (req, res) => {
    try {
        // проверка на сумму
        if(req.body.sum < 10) {
            return res.status(500).json({
                message: "Сумма перевода не может быть меньше 10"
            })
        }
        if(req.body.sum > 100000) {
            return res.status(500).json({
                message: "Сумма перевода не может превышать 100000"
            })
        }

        // проверка на существование отправителя и получателя
        const cardSender = await CardModel.findOne({ numberCard: req.body.sender })
        const cardRecipient = await CardModel.findOne({ numberCard: req.body.recipient })

        if(!cardSender) {
            return res.status(404).json({
                message: "У вас нет такой карты"
            })
        }
        if(!cardRecipient) {
            return res.status(404).json({
                message: "Карты получателя не существует"
            })
        }
        
        // проверка на наличие денег
        if (req.body.sum >= cardSender.balance) {
            return res.status(500).json({
                message: "У вас не хватает средств"
            })
        }

        // Перевод получателю
        CardModel.findOneAndUpdate(
            {
                numberCard: req.body.recipient,
            },
            {
                $inc: { balance: req.body.sum },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(e)
                    return res.status(500).json({
                        message: "Не удалось удалить карту"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Карта не найдена"
                    })
                }
            }
        ).populate('user');

        // Снятие у отправителя
        CardModel.findOneAndUpdate(
            {
                numberCard: req.body.sender,
            },
            {
                $inc: { balance: -req.body.sum },
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(e)
                    return res.status(500).json({
                        message: "Не удалось удалить карту"
                    })
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Карта не найдена"
                    })
                }
            }
        ).populate('user');

        res.json({
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Перевод денег не удался"
        })
    }
}
