import { expect, describe, it, beforeEach } from 'vitest'
import { ICheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInRepository: ICheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check-In Use-Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository)
  })
  it('should be able to checkin', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym_01',
      userId: 'user_01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
