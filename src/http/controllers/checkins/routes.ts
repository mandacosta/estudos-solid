import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { make } from './make'
import { validate } from './validate'
import { history } from './history'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/make', make)
  app.post('/validate', validate)
  app.post('/history', history)
}
