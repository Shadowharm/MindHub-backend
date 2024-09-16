import { NextFunction, Request, Response } from 'express'
import ApiError from '../exceptions/api-error'

export default function (code: string) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals
      if (user?.role?.permissions?.includes(code)) {
        return next()
      }
      return next(ApiError.Forbidden())

    } catch (e) {
      next(ApiError.Forbidden())
    }
  }
}