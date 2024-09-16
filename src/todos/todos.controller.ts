import { NextFunction, Request, Response } from 'express'
import { ITodo, Todo } from './todo.instance'
import TodosService from './todos.service'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api-error'
import { v4 as uuidv4 } from 'uuid'
import todosService from './todos.service'

class TodosController {
  async create (req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const todo: ITodo = await TodosService.createTodo(req.cookies.todosToken ?? null, req.body)
      res.status(200).json(new Todo(todo))
    } catch (e) {
      next(e)
    }
  }

  async getAll (req: Request, res: Response, next: NextFunction) {
    try {
      let { todosToken } = req.cookies
      todosToken ??= uuidv4()
      const todos: ITodo[] = await todosService.getAll(todosToken)
      res.status(200).cookie('todosToken', todosToken).json(todos)
    } catch (e) {
      next(e)
    }
  }
}

export default new TodosController()