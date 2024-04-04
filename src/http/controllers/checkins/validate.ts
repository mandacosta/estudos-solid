import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-ins-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { LateCheckInValidationError } from '@/use-cases/errors/late-checkin-validation-error'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const schema = z.object({
      checkInId: z.string(),
    })

    const { checkInId } = schema.parse(request.body)

    const useCase = makeValidateCheckInUseCase()
    const { checkIn } = await useCase.execute({
      checkInId,
    })
    return reply.status(201).send(checkIn)
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
