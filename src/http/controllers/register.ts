import { prisma } from '@/libs/prisma'
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserSchema.parse(request.body)
  const userSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userSameEmail) {
    return reply.status(409).send()
  }
  const password_hash = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })

  return reply.status(201).send()
}
