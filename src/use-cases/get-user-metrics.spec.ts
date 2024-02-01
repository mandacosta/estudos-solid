import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let getUserMetricsUseCase: GetUserMetricsUseCase

describe('Get user metrics Use-Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInRepository)
  })

  it("should be able to fetch user's metrics", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user_01',
      })
    }
    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: 'user_01',
    })

    expect(checkInsCount).toEqual(22)
  })
})
