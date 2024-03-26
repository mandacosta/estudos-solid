import { makegetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const getUserProfileUseCase = makegetUserProfileUseCase()
  const { user } = await getUserProfileUseCase.execute({
    userId,
  })
  console.log(userId)
  return reply.status(200).send({
    user,
  })
}
