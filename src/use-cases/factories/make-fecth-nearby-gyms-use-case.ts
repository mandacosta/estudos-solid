import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchGymsNearbyUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const makeFetchNearbyGyms = new FetchGymsNearbyUseCase(gymsRepository)

  return makeFetchNearbyGyms
}
