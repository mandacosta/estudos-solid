import { Prisma, Gym } from '@prisma/client'

export interface IFindManyNearByRequest {
  latitude: number
  longitude: number
}

export interface IGymRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[] | []>
  findManyNearBy(data: IFindManyNearByRequest): Promise<Gym[] | []>
}
