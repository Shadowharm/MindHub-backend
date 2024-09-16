import authService from './auth.service'
import {
  Request,
  Response,
  NextFunction
} from 'express'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error'
import { v4 as uuidv4 } from 'uuid'
import tokenService from '../tokens/token.service'
class AuthController {
  async signup (req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const { email, password } = req.body
      const { todosToken } = req.cookies
      const userData = await authService.signup({ email, password, todosToken })
      return res.json(userData)
    } catch (e) {
      return next(e)
    }
  }

  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const userData = await authService.login(email, password)
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout (req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies
      if (refreshToken) {
        await tokenService.removeToken(refreshToken)
      }
      return res.status(200).cookie('todosToken', uuidv4())
    } catch (e) {
      return next(e)
    }
  }

  async activate (req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link
      await authService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      return next(e)
    }
  }

  async refresh (req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = res.locals
      const { refreshToken } = req.cookies
      const tokens = await tokenService.refreshToken(refreshToken, user)
      res.status(200).json(tokens)
    } catch (e) {
      return next(e)
    }
  }
}

export default new AuthController()