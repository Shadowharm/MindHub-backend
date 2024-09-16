import RoleModel from './role.model'
import { IRole, Role } from './role.instance'


const ADMIN_ROLE = process.env.ADMIN_ROLE || 'admin'
const USER_ROLE = process.env.USER_ROLE || 'user'

class RoleService {

  getAll (params: Partial<Role> = {}): Promise<IRole[]> {
    return RoleModel.find(params)
  }

  async adminRole (): Promise<IRole> {
    let adminRole: IRole = await this.getByCode(ADMIN_ROLE)
    if (!adminRole) {
      adminRole = await this.create({ code: ADMIN_ROLE, title: 'Администратор', permissions: ['logs'] })
    }
    return adminRole
  }

  async userRole (): Promise<IRole> {
    let userRole: IRole = await this.getByCode(USER_ROLE)
    if (!userRole) {
      userRole = await this.create({ code: USER_ROLE, title: 'Пользователь' })
    }
    return userRole
  }

  getByCode (code: string): Promise<IRole> {
    return RoleModel.findOne({ code })
  }

  create (newRole: Role): Promise<IRole> {
    return RoleModel.create(newRole)
  }
}

export default new RoleService()