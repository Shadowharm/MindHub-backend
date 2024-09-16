import {
  Request,
  Response,
  NextFunction
} from 'express'
import usersService from './users.service'

class UserController {
  async getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.json(await usersService.getAll())
      next()
    } catch (e) {
      return next(e)
    }
  }
}

export default new UserController()