import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('User (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user metrics', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gym_ = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Perto fit',
        phone: '40028922',
        description: null,
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const gymId = gym_.body.id

    const checkin = await request(app.server)
      .post(`/checkin/gyms/${gymId}/checkin`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    const checkinId = checkin.body.id

    await request(app.server)
      .patch(`/checkin/validate/${checkinId}`)
      .set('Authorization', `Bearer ${token}`)

    const response = await request(app.server)
      .get(`/metrics`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.checkInsCount).toEqual(1)
  })
})
