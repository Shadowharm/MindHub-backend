import { Router } from 'express'
import logsController from './logs.controller'
import protectMiddleware from '../middlewares/protect.middleware'


const logsRouter = Router()

logsRouter.get('/', protectMiddleware('logs'), logsController.getAll)

export default logsRouter