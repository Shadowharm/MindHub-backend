import { Types, Document } from 'mongoose'

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends Document {
  userId: Types.ObjectId
  refreshToken: string;
}