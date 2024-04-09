import { prisma } from '@/libs/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'João das Neves',
      email: 'joaodasneves@email.com',
      role: isAdmin ? 'ADMIN' : 'MEMBER',
      password_hash: await hash('123456', 6),
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'joaodasneves@email.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
