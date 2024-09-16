import UserModel from './users/user.model'
import roleService from './roles/role.service'
import usersService from './users/users.service'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { IRole } from './roles/role.instance'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'

export default async function () {
  try {
    await roleService.userRole()
    const adminRole: IRole = await roleService.adminRole()
    const adminExists = await UserModel.exists({ role: adminRole._id })
    if (adminExists) { return }
    const hashPassword = await bcrypt.hash(ADMIN_PASSWORD, 3)
    await usersService.create({
      email: ADMIN_EMAIL,
      password: hashPassword,
      activationLink: uuidv4(),
      role: adminRole.id,
      todosToken: uuidv4(),
      isActivated: true
    })
  } catch (e) {
    console.error(e)
  }
}
