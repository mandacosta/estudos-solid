import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { IUserRepository } from '@/repositories/interface-users-repository'

let userRepository: IUserRepository
let registerUseCase: RegisterUseCase

describe('Register Use-Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(userRepository)
  })
  it("should properly hash the user's password", async () => {
    const user_ = {
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(user_)

    const isPasswordProperlyHashed = await compare(
      user_.password,
      user.password_hash,
    )

    expect(isPasswordProperlyHashed).toBe(true)
  })

  it('should not allow email duplicity', async () => {
    const user1 = {
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password: '123456',
    }

    await registerUseCase.execute(user1)

    await expect(() => registerUseCase.execute(user1)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })

  it('should register user', async () => {
    const user_ = {
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password: '123456',
    }

    const { user } = await registerUseCase.execute(user_)

    expect(user.id).toEqual(expect.any(String))
  })
})
