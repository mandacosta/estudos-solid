import { Prisma, User } from '@prisma/client'
import { IUserRepository } from '../interface-users-repository'

export class InMemoryUsersRepository implements IUserRepository {
  public repository: User[] = []
  async create(data: Prisma.UserCreateInput) {
    const { name, email, password_hash } = data
    const user = {
      id: 'userid',
      name,
      email,
      password_hash,
      created_at: new Date(),
    }
    this.repository.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.repository.find((user) => user.email === email)

    // Verificação porque o método find retorna undefined se não encontra
    // e não null
    if (user) {
      return user
    }

    return null
  }
}
