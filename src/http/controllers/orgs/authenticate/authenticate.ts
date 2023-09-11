import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { InvalidCredentialsError } from '@/use-case/errors/invalid-credentials-error'

import { makeAuthenticateUseCase } from '@/use-case/factories/orgs/make-authenticate-usecase'

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const registerBodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = registerBodySchema.parse(request.body)

	try {
		const authenticateUseCase = makeAuthenticateUseCase()

		const { org } = await authenticateUseCase.execute({ email, password })

		const token = await reply.jwtSign(
			{ role: 'ADMIN' },
			{ sign: { sub: org.id } },
		)

		const refreshToken = await reply.jwtSign(
			{ role: 'ADMIN' },
			{ sign: { sub: org.id, expiresIn: '7d' } },
		)

		return reply
			.setCookie('refreshToken', refreshToken, {
				path: '/',
				secure: true,
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({ token })
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			return reply.status(400).send({ message: error.message })
		}

		throw error
	}
}
