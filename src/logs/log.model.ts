import { Schema, model } from 'mongoose'

const LogModel = new Schema({
  path: { type: String, required: true },
  statusCode: { type: Number, required: true },
  error: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
}, { versionKey: false })

export default model('Log', LogModel)
