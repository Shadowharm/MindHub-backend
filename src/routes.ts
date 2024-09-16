import { Router } from 'express'
import authRoutes from './auth/auth.routes'
import userRouter from './users/users.routes'
import logsRouter from './logs/logs.routes'
import todosRouter from './todos/todos.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRouter)
router.use('/logs', logsRouter)
router.use('/todos', todosRouter)

export default router