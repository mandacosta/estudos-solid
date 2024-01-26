import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInRepository: ICheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check-In Use-Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository)

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
    })

    console.log(checkIn)

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym_01',
        userId: 'user_01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice in different days', async () => {
    // Setando o vi aqui o nosso checkin será criado na data especificada.
    vi.setSystemTime(new Date(1994, 9, 24, 0, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    vi.setSystemTime(new Date(1994, 9, 25, 0, 0, 0))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
