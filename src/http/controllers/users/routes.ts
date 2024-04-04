import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { metrics } from './metrics'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Rotas autenticadas
  app.get('/me', { onRequest: [verifyJwt] }, profile)
  app.get('/metrics', { onRequest: [verifyJwt] }, metrics)
}
