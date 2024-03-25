import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheInsHIstoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const makeFetchUserCheInsHIstory = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository,
  )

  return makeFetchUserCheInsHIstory
}
