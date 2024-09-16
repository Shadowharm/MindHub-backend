import { Document } from 'mongoose'

export interface ITodo extends Document {
  title: string,
  description: string,
  completed: boolean,
  todosToken: string
}

export class Todo {
  title: string
  description: string
  completed: boolean
  todosToken: string
  id: string

  constructor ({ title, description, completed, todosToken, id }: ITodo) {
    this.title = title
    this.description = description
    this.completed = completed
    this.todosToken = todosToken
    this.id = id
  }
}