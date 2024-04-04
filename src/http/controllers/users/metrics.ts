import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    userId: z.string(),
  })

  const { userId } = schema.parse(request.body)

  const useCase = makeGetUserMetricsUseCase()
  const { checkInsCount } = await useCase.execute({
    userId,
  })
  return reply.status(201).send(checkInsCount)
}
