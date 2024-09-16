import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorMiddleware from './middlewares/error.middleware'
import authMiddleware from './auth/auth.middleware'
import router from './routes'
import logsMiddleware from './logs/logs.middleware'
import initAdmin from './initAdmin'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))

app.use(authMiddleware)

app.use('/api', router)


app.use(errorMiddleware)

app.use(logsMiddleware)


const PORT = process.env.PORT || 3001
const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string)
    await initAdmin()
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
  } catch (e) {
    console.error(e)
  }
}

start()