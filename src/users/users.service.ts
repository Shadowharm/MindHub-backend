import UserModel from './user.model'
import { IUser, User } from './user.instance'
import { DeleteResult } from 'mongodb'

type Params = Partial<User>

class UsersService {
  getAll (params: Params = {}): Promise<IUser[]> {
    return UserModel.find(params, { password: 0 }).populate('role')
  }

  getOne (params: Params = {}): Promise<IUser>  {
    return UserModel.findOne(params).populate('role')
  }

  exist (params: Params = {}): Promise<Pick<IUser, '_id'>>  {
    return UserModel.exists(params)
  }

  async create (newUser: User): Promise<IUser>  {
    return UserModel.create(newUser)
  }

  delete (userId: number): Promise<DeleteResult> {
    return UserModel.deleteOne({ _id: userId })
  }
}


export default new UsersService()