import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    console.log('aqui', request.user.sub)
    await request.jwtVerify()
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized' })
  }
}
