import { Schema, model } from 'mongoose'
import { ITodo } from './todo.instance'

const TodoModel:Schema<ITodo> = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  todosToken: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform (_, ret){
      ret.id = ret._id
      delete ret._id
    }
  }
})

export default model<ITodo>('Todo', TodoModel)