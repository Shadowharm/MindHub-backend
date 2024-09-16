import { StatusCodes } from 'http-status-codes'
import { ValidationError } from 'express-validator'

export default class ApiError extends Error {
  status
  errors

  constructor (status: number, message: string, errors: ValidationError[] = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError () {
    return new ApiError(StatusCodes.UNAUTHORIZED, 'Пользователь не авторизован')
  }

  static Forbidden () {
    return new ApiError(StatusCodes.FORBIDDEN, 'У вас нет прав для совершения действия')
  }

  static BadRequest (message: string, errors: ValidationError[] = []) {
    return new ApiError(StatusCodes.BAD_REQUEST, message, errors)
  }
}