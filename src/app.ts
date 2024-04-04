import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/checkins/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(userRoutes)

app.register(gymsRoutes, {
  prefix: '/gyms',
})

app.register(checkInsRoutes, {
  prefix: '/checkin',
})

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', error: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // Integrar com uma ferramenta de observabilidade
    // TODO: log datadog, newrelix, sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error !' })
})
