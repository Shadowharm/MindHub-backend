import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

import TokenModel from './token.model'
import { User } from '../users/user.instance'
import { AuthTokens, IToken } from './token.instance'
import { DeleteResult } from 'mongodb'
import ApiError from '../exceptions/api-error'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret'
class TokenService {
  generateTokens (user: User): AuthTokens {
    return {
      accessToken: jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: '60s' }),
      refreshToken: uuidv4()
    }
  }

  validateAccessToken (token: string, params): User | null {
    try {
      const { exp: _, iat: __, ...user } = jwt.verify(token, JWT_ACCESS_SECRET, params)
      return user
    } catch (e) {
      return null
    }
  }

  create (userId: string, refreshToken: string): Promise<IToken> {
    return TokenModel.create({
      userId,
      refreshToken
    })
  }

  removeToken (refreshToken: string): Promise<DeleteResult> {
    return TokenModel.deleteOne({ refreshToken })
  }

  findToken (refreshToken: string): Promise<IToken> {
    return TokenModel.findOne({ refreshToken })
  }

  async refreshToken (refreshToken: string, user: User): Promise<AuthTokens> {
    const token = await this.findToken(refreshToken)
    if (!token) {
      throw ApiError.BadRequest('Токена не существует')
    }
    if (user.id !== token.userId.toString()) {
      throw ApiError.BadRequest('Токен не принадлежит пользователю')
    }
    const newTokens = this.generateTokens({ ...user })
    token.refreshToken = newTokens.refreshToken
    await token.save()
    return newTokens
  }
}

export default new TokenService()
