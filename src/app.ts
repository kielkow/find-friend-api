import fastify from 'fastify'
import { ZodError } from 'zod'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import * as Sentry from '@sentry/node'
import { ProfilingIntegration } from '@sentry/profiling-node'

import { env } from './env'

import { usersRoutes } from './http/controllers/users/routes'
import { petsRoutes } from './http/controllers/pets/routes'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { healthcheckRoutes } from './http/controllers/healthcheck/routes'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	sign: {
		expiresIn: '1d',
	},
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
})

app.register(fastifyCookie)

app.register(fastifyCors, {
	origin: true,
	credentials: true,
})

app.register(usersRoutes)
app.register(petsRoutes)
app.register(orgsRoutes)
app.register(healthcheckRoutes)

if (env.NODE_ENV === 'prod') {
	Sentry.init({
		dsn: env.SENTRY_DSN_URL,
		integrations: [new ProfilingIntegration()],
		tracesSampleRate: 1.0,
		profilesSampleRate: 1.0,
	})
}

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.format() })
	}

	if (env.NODE_ENV !== 'prod') {
		console.error(error)
	} else {
		const transaction = Sentry.startTransaction({
			op: 'ERROR-API',
			name: 'INTERNAL-SERVER-ERROR',
		})

		Sentry.captureException(error)

		transaction.finish()
	}

	return reply.status(500).send({ message: 'Internal server error' })
})
