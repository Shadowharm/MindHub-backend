import { Document, Types } from 'mongoose'
import { Role } from '../roles/role.instance'

export interface IUser extends Document {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink?: string;
  role: Types.ObjectId;
  todosToken: string;
}

export class User {
  email: string
  isActivated?: boolean
  activationLink: string
  role: Types.ObjectId | Role
  todosToken: string
  password: string
  id?: string


  constructor ({ email, isActivated = false, role, todosToken, password, id, activationLink }: IUser) {
    this.email = email
    this.isActivated = isActivated
    this.role = role
    this.todosToken = todosToken
    this.password = password
    this.id = id
    this.activationLink = activationLink
  }
}
