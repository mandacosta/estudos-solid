import { IUserRepository } from '@/repositories/interface-users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface UserRegister {
  name: string
  email: string
  password: string
}

export class RegisterUsersCase {
  constructor(private UsersRepository: IUserRepository) {}

  async execute({ name, email, password }: UserRegister) {
    const userWithSameEmail = await this.UsersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    const password_hash = await hash(password, 6)

    await this.UsersRepository.create({ name, email, password_hash })
  }
}
