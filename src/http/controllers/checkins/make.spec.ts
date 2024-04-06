import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Checkin (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to make checkin', async () => {
    const { token } = await createAndAuthenticateUser(app)

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

    const response = await request(app.server)
      .post(`/checkin/gyms/${gymId}/checkin`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      })

    console.log(response.body)

    expect(response.statusCode).toBe(201)
    // expect(response.body.gyms).toHaveLength(1)
  })
})
