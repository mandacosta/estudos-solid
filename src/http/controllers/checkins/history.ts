import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheInsHIstoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    page: z.number().min(1).default(1),
  })

  const { page } = schema.parse(request.query)

  const useCase = makeFetchUserCheInsHIstoryUseCase()
  const { checkIns } = await useCase.execute({
    userId: request.user.sub,
    page,
  })
  return reply.status(200).send(checkIns)
}
