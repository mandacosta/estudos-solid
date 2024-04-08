import { FastifyRequest, FastifyReply } from 'fastify'

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  console.log('*******')
  try {
    await request.jwtVerify()
  } catch (error) {
    console.log('ERRO', error)
    reply.status(401).send({ message: 'Unauthorized' })
  }
}
