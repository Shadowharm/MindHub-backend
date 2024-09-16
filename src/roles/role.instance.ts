import { Document } from 'mongoose'

export interface IRole extends Document {
  code: string
  title: string
  permissions?: string[]
}

export class Role {
  code: string
  title: string
  permissions?: string[]

  constructor ({ code, title, permissions = [] }: IRole) {
    this.code = code
    this.title = title
    this.permissions = permissions
  }
}