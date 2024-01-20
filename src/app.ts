import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const app = fastify()

const prisma = new PrismaClient()

const user = prisma.user.create({
  data: {
    name: 'Amanda Costa',
    email: 'mandacosta94@gmail.com',
  },
})
