import { Gym, Prisma } from '@prisma/client'
import { IGymRepository } from '../interface-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements IGymRepository {
  public repository: Gym[] = []

  //   async create(data: Prisma.GymCreateWithoutCheckInsInput) {
  //     this.repository.push({
  //       id: randomUUID(),
  //       title: data.title,
  //       description: data.description,
  //       phone: data.phone,
  //       latitude: data.latitude,
  //       longitude: data.longitude,
  //     })

  //   }

  async findById(id: string) {
    const gym = this.repository.find((gym) => gym.id === id)
    if (gym) {
      return gym
    }

    return null
  }
}
