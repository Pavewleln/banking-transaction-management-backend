import CardModel from '../models/Card.js'
import UserModel from '../models/User.js'
import { dateofCreatedCard } from '../utils/dateOfCreatedCard.js'
import { randomCardCode } from '../utils/randomCardCode.js'
import { randomCardNumber } from '../utils/randomCardNumber.js'

export const getAllCards = async (req, res) => {
    try {
        const cards = await CardModel.find().populate('user').exec()
        res.json(cards)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось получить карты"
        })
    }
}
export const getOneCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        CardModel.findOne(
            {
              _id: cardId,
            },
            (err, doc) => {
              if (err) {
                console.log(err);
                return res.status(500).json({
                  message: 'Не удалось вернуть карту',
                });
              }
      
              if (!doc) {
                return res.status(404).json({
                  message: 'Карта не найдена',
                });
              }
      
              res.json(doc);
            },
          ).populate('user');
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
        const {fullname} = user
        const cards = await CardModel.find().populate('user').exec()
        if(cards.length >= 3) {
            return res.status(404).json({
                message: "Превышен лимит карт"
            })
        }
        const doc = new CardModel({
            dateOfCreation: dateofCreatedCard(),
            number: randomCardNumber(),
            code: randomCardCode(),
            owner: fullname,
            bankName: "Тинькофф",
            user: req.userId
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
        const cardId = req.params.id;
        CardModel.findByIdAndDelete({
            _id: cardId
        }, (err, doc) => {
            if(err) {
                console.log(e)
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
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Не удалось удалить карту"
        })
    }
}