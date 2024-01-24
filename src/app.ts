import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes, {
  prefix: '/',
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
