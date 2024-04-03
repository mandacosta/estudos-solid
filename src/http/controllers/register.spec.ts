import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'João das Neves',
      email: 'joaodasneves@email.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
  })
})
