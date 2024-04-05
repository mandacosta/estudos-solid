import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-ins-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-cases/errors/late-checkin-validation-error'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const schema = z.object({
      checkinId: z.string().uuid(),
    })

    const { checkinId } = schema.parse(request.params)

    const useCase = makeValidateCheckInUseCase()
    const { checkIn } = await useCase.execute({
      checkInId: checkinId,
    })
    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof LateCheckInValidationError) {
      return reply.status(403).send({ message: error.message })
    }

    throw error
  }
}
