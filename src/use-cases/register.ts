import { hash } from 'bcryptjs'

interface UserRegister {
  name: string
  email: string
  password: string
}

export class RegisterUsersCase {
  constructor(private UsersRepository: any) {}

  async execute({ name, email, password }: UserRegister) {
    const userWithSameEmail = await this.UsersRepository.findUnique(email)

    if (userWithSameEmail) {
      throw new Error('Email already being used.')
    }
    const password_hash = await hash(password, 6)

    await this.UsersRepository.create({ name, email, password_hash })
  }
}
