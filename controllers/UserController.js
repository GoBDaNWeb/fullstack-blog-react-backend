import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        })

        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            }, 
            'Dfhufcvfrttdrf20',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        console.log(req.body);
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Пользователь не найден',
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: 'Неверный логин или пароль',
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            }, 
            'Dfhufcvfrttdrf20',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const  user = await UserModel.findById(req.userId)
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            })
        }

        const {passwordHash, ...userData} = user._doc

        res.json(userData)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Неn доступа'
        })
    }
}