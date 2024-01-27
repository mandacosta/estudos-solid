import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ICheckInsRepository } from '@/repositories/interface-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { IGymRepository } from '@/repositories/interface-gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-In Use-Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.repository.push({
      id: 'gym_01',
      title: 'Academia das maravilhas',
      description: '',
      phone: '',
      latitude: new Decimal(1),
      longitude: new Decimal(1),
    })

    // Antes de cada teste, o Vitest vai mockar os dados referentes a datas.
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Depois de cada teste, o Vitest vai voltar a utlizar as datas reais.
    vi.useRealTimers()
  })
  it('should be able to checkin', async () => {
    vi.setSystemTime(new Date(1994, 9, 24, 0, 15, 0))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 1,
      userLongitude: 1,
    })

    // Esse new Date será criado com a data setada acima no vi.setSystemTime
    // console.log(new Date())

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in a day', async () => {
    // Setando o vi aqui o nosso checkin será criado na data especificada.
    vi.setSystemTime(new Date(1994, 9, 24, 0, 15, 0))
    const checkIn = await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 1,
      userLongitude: 1,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym_01',
        userId: 'user_01',
        userLatitude: 1,
        userLongitude: 1,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    // Setando o vi aqui o nosso checkin será criado na data especificada.
    vi.setSystemTime(new Date(1994, 9, 24, 0, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 1,
      userLongitude: 1,
    })

    vi.setSystemTime(new Date(1994, 9, 25, 0, 0, 0))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
      userLatitude: 1,
      userLongitude: 1,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
