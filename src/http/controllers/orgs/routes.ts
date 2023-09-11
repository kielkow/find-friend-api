import { FastifyInstance } from 'fastify'

import { register } from './register/register'
import { authenticate } from './authenticate/authenticate'

export async function orgsRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.post('/orgs', register)
	app.post('/orgs/sessions', authenticate)
}
