import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeRegisterUsecase } from '@/use-case/factories/pets/make-register-usecase'

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const registerBodySchema = z.object({
		name: z.string().nonempty(),
		race: z.string().nonempty(),
		size: z.enum(['SMALL', 'MEDIUM', 'BIG']),
		age: z.coerce.number().nonnegative(),
		locale: z.enum(['SP', 'RJ', 'MG']),
		org_id: z.string().uuid().nonempty(),
	})

	const { name, race, size, age, locale, org_id } = registerBodySchema.parse(
		request.body,
	)

	const registerUseCase = makeRegisterUsecase()

	await registerUseCase.execute({ name, race, size, age, locale, org_id })

	return reply.status(201).send()
}
