import { Gym } from '@prisma/client'
import { IGymRepository } from '@/repositories/interface-gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    console.log('query', query)
    console.log('page', page)
    const gyms = await this.gymsRepository.searchMany(query, page)

    return { gyms }
  }
}
