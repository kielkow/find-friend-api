import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { OrgAlreadyExistsError } from '@/use-case/errors/org-already-exists-error'
import { makeRegisterUsecase } from '@/use-case/factories/orgs/make-register-usecase'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		address: z.string(),
		phone: z.string(),
		locale: z.enum(['SP', 'RJ', 'MG']),
	})

	const { name, email, password, address, phone, locale } =
		registerBodySchema.parse(request.body)

	try {
		const registerUseCase = makeRegisterUsecase()

		await registerUseCase.execute({
			name,
			email,
			password,
			address,
			phone,
			locale,
		})
	} catch (error) {
		if (error instanceof OrgAlreadyExistsError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(201).send()
}
