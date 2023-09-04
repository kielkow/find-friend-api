import { FastifyInstance } from 'fastify'

import { list } from './list/list'
import { register } from './register/register'

import { verifyJWT } from '../../middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
	// Authenticated
	app.get('/pets', { onRequest: [verifyJWT] }, list)
	app.post('/pets', { onRequest: [verifyJWT] }, register)
}
