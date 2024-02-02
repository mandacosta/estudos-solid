import { Gym } from '@prisma/client'
import { IGymRepository } from '@/repositories/interface-gyms-repository'

interface FetchGymsNearbyUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchGymsNearbyUseCaseResponse {
  gyms: Gym[]
}

export class FetchGymsNearbyUseCase {
  constructor(private gymsRepository: IGymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchGymsNearbyUseCaseRequest): Promise<FetchGymsNearbyUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
