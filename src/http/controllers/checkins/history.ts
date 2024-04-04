import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheInsHIstoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    userId: z.string(),
    page: z.number().min(1).default(1),
  })

  const { userId, page } = schema.parse(request.body)

  const useCase = makeFetchUserCheInsHIstoryUseCase()
  const { checkIns } = await useCase.execute({
    userId,
    page,
  })
  return reply.status(201).send(checkIns)
}
