import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetProfileUseCase } from '../get-user-profile'

export function makegetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
