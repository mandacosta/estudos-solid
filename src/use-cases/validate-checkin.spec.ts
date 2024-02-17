import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-checkin'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-checkin-validation-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate checkin Use-Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    // Antes de cada teste, o Vitest vai mockar os dados referentes a datas.
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Depois de cada teste, o Vitest vai voltar a utlizar as datas reais.
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const checkin = await checkInRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    })

    const validatedCheckIn = await sut.execute({
      checkInId: checkin.id,
    })

    expect(validatedCheckIn.checkIn.validated_at).toEqual(expect.any(Date))
  })

  it('should be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistentId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    const twentyOneMinutesInMs = 1000 * 60 * 21
    // Simulando um horário de criação do checkin
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))
    const checkin = await checkInRepository.create({
      gym_id: 'gym01',
      user_id: 'user01',
    })

    // Simulando um horário 21 minutos após a criação de checkin e em seguida tentando validá-lo
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: checkin.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
// //
