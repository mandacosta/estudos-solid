import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fecth-nearby-gyms-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = schema.parse(request.query)

  const useCase = makeFetchNearbyGymsUseCase()
  const { gyms } = await useCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return reply.status(201).send(gyms)
}
