import Router from 'express'
import {UserController} from '../controllers/index.js'
import {checkAuth, handleValidationErrors} from '../middleware/index.js'
import { registerValidation, loginValidation} from '../validations.js'

const userRouter = new Router()

userRouter.post('/login', loginValidation, handleValidationErrors, UserController.login)
userRouter.post('/register', registerValidation, handleValidationErrors, UserController.register)
userRouter.get('/me', checkAuth, UserController.getMe)

export default userRouter