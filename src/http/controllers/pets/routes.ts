import { FastifyInstance } from 'fastify'

import { list } from './list/list'
import { findById } from './findById/findById'
import { register } from './register/register'
import { update } from './update/update'

import { verifyJWT } from '../../middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
	// Authenticated
	app.get('/pets', { onRequest: [verifyJWT] }, list)
	app.get('/pets/:id', { onRequest: [verifyJWT] }, findById)

	app.post('/pets', { onRequest: [verifyJWT] }, register)

	app.put('/pets/:id', { onRequest: [verifyJWT] }, update)
}
