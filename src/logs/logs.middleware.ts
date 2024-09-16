import logsService from './logs.service'
import { Request, Response } from 'express'
export default async function (req: Request, res: Response) {
  try {
    await logsService.saveLog(req.url, res.statusCode, res.locals.error ?? null)
  } catch (e) {
    console.error(e)
  }
}