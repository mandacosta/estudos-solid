import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { make } from './make'
import { validate } from './validate'
import { history } from './history'
import { verifyUserRole } from '@/http/middlewares/only-admin'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms/:gymId/checkin', make)
  app.patch(
    '/validate/:checkinId',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
  app.get('/history', history)
}
