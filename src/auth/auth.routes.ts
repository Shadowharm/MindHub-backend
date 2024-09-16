import { Router } from 'express'
import userController from './auth.controller'
import { body } from 'express-validator'
const authRouter = Router()

authRouter.post('/signup',
  body('email').isEmail().withMessage('Невалидный email'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не короче 6 символов '),
  userController.signup)
authRouter.post('/login', userController.login)
authRouter.post('/logout', userController.logout)
authRouter.get('/activate/:link', userController.activate)
authRouter.post('/refresh', userController.refresh)
export default authRouter