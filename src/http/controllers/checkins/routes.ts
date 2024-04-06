import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { make } from './make'
import { validate } from './validate'
import { history } from './history'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/checkin', make)
  app.patch('/validate/:checkinId', validate)
  app.get('/history', history)
}
