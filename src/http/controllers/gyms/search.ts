import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { query, page } = schema.parse(request.body)

  const useCase = makeSearchGymsUseCase()
  const { gyms } = await useCase.execute({ query, page })
  return reply.status(201).send(gyms)
}
