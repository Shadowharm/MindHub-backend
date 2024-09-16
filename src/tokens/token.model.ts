import { Schema, model } from 'mongoose'

const TokenModel = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
})


export default model('Token', TokenModel)