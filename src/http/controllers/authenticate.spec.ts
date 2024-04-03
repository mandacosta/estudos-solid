import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

describe('Authentication (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'João das Neves',
      email: 'joaodasneves@email.com',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'joaodasneves@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
