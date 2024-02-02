import { Gym, Prisma } from '@prisma/client'
import {
  IFindManyNearByRequest,
  IGymRepository,
} from '../interface-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements IGymRepository {
  public repository: Gym[] = []

  async findManyNearBy(data: IFindManyNearByRequest) {
    return this.repository.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: data.latitude, longitude: data.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )
      return distance < 10
    })
  }

  async searchMany(query: string, page: number) {
    return this.repository
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    // O prisma não aceita undefined
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    }
    this.repository.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.repository.find((gym) => gym.id === id)
    if (gym) {
      return gym
    }

    return null
  }
}
