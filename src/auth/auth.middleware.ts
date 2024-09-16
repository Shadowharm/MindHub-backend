import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/api-error'
import tokenService from '../tokens/token.service'
import { User } from '../users/user.instance'

const AccessRoutes = [
  '/api/auth/refresh'
]
export default function (req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) return next()

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }
    const userData = tokenService.validateAccessToken(accessToken, {
      ignoreExpiration: AccessRoutes.includes(req.path)
    })
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    res.locals.user = userData
    next()

  } catch (e) {
    next(ApiError.UnauthorizedError())
  }
}