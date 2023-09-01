import { FastifyInstance } from 'fastify'

import { register } from './register/register'

import { verifyJWT } from '../../middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
	// Authenticated
	app.post('/pets', { onRequest: [verifyJWT] }, register)
}
