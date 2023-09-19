import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'
import { refresh } from './refresh/refresh'
import { update } from './update/update'

export async function orgsRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.post('/orgs', register)
	app.post('/orgs/sessions', authenticate)

	app.patch('/orgs/token/refresh', refresh)

	// Authenticated
	app.put('/orgs/:id', { onRequest: [verifyJWT] }, update)
}
