import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {},
    {
      sub: request.user.sub,
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sub: request.user.sub,
      expiresIn: '7d',
    },
  )
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/', // Quais rotas da aplicação tem acesso ao cookie
      secure: true, // Apenas rotas https podem usar essa informação
      sameSite: true, // apenas essa api terá acesso
      httpOnly: true, // apenas http
    })
    .status(200)
    .send({
      token,
    })
}
