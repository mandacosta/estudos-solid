import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)
    console.log('token', token)

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        id: expect.any(String),
        name: 'João das Neves',
        email: 'joaodasneves@email.com',
      }),
    })
  })
})
