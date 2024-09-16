import { Request, Response, NextFunction } from 'express'
import logsService from './logs.service'

class LogsController {
  async getAll (req: Request, res: Response, next: NextFunction) {
    try {
      res.json(await logsService.getAll({ onlyErrors: req.query.onlyErrors === '1' }))
    } catch (e) {
      next(e)
    }
  }
}

export default new LogsController()