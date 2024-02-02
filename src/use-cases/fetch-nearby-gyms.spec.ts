import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchGymsNearbyUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchGymsNearbyUseCase

describe('Fetch nearby gyms Use-Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchGymsNearbyUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near', // Na rua do metro bresser
      description: null,
      phone: null,
      latitude: -23.5474208,
      longitude: -46.6110066,
    })

    await gymsRepository.create({
      title: 'Far', // Em itaqua
      description: null,
      phone: null,
      latitude: -23.5025617,
      longitude: -46.3149029,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.5474208, // Na rua de casa
      userLongitude: -46.6110066,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near' })])
  })
})
