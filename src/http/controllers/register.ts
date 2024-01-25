import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserSchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerUsersCase = new RegisterUseCase(usersRepository)
    await registerUsersCase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    // Se der algum erro não mapeado, lance ele na aplicação
    // que o handler global cuida
    throw error
  }
  return reply.status(201).send()
}
