import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'
import { MaxNumberOfCheckins } from '@/use-cases/errors/max-number-of-check-ins-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'

export async function make(request: FastifyRequest, reply: FastifyReply) {
  try {
    const paramSchema = z.object({
      gymId: z.string().uuid(),
    })
    const schema = z.object({
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180
      }),
    })

    const { latitude, longitude } = schema.parse(request.body)
    const { gymId } = paramSchema.parse(request.params)

    const useCase = makeCheckInUseCase()
    const { checkIn } = await useCase.execute({
      userId: request.user.sub,
      gymId,
      userLatitude: latitude,
      userLongitude: longitude,
    })
    return reply.status(201).send(checkIn)
  } catch (error) {
    if (
      error instanceof MaxNumberOfCheckins ||
      error instanceof MaxDistanceError
    ) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
