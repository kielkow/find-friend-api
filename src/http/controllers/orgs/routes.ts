import { FastifyInstance } from 'fastify'

import { register } from './register/register'

export async function orgsRoutes(app: FastifyInstance) {
	// Not Authenticated
	app.post('/orgs', register)
}
