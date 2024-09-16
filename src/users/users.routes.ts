import { Router } from 'express'
import usersController from './users.controller'


const userRouter = Router()

userRouter.get('/', usersController.getAll)

export default userRouter