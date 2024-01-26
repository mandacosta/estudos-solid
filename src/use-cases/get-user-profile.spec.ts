import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { IUserRepository } from '@/repositories/interface-users-repository'
import { GetProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: IUserRepository
let getProfileUseCase: GetProfileUseCase

describe('Get User Profile Use-Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository()
    getProfileUseCase = new GetProfileUseCase(userRepository)
  })
  it('should be able to get user profile', async () => {
    // A criação do usuário é feita diretamento com o repositório
    // pois não estamos testando a criação de usuário
    const createdUser = await userRepository.create({
      name: 'Mariazinha',
      email: 'maria@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await getProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(createdUser.id).toEqual(user.id)
  })

  it('should not be able to get user profile with non-existing user id', async () => {
    await expect(() =>
      getProfileUseCase.execute({
        userId: 'idaleatorio',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
