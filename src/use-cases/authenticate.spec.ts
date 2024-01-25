import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { IUserRepository } from '@/repositories/interface-users-repository'

let userRepository: IUserRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use-Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepository)
  })
  it('should be able to authenticate', async () => {
    await userRepository.create({
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'maria@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      authenticateUseCase.execute({
        email: 'maria@gmail.com',
        password: '64321',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateUseCase.execute({
        email: 'joao@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
