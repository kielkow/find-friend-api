import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeUpdateUsecase } from '@/use-case/factories/pets/make-update-usecase'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updateParamsSchema = z.object({ id: z.string().uuid() })
	const updateBodySchema = z.object({
		name: z.string(),
		race: z.string(),
		size: z.enum(['SMALL', 'MEDIUM', 'BIG']),
		age: z.coerce.number().int(),
		locale: z.enum(['SP', 'RJ', 'MG']),
		org_id: z.string(),
	})

	const { id } = updateParamsSchema.parse(request.params)
	const { name, race, size, age, locale, org_id } = updateBodySchema.parse(
		request.body,
	)

	try {
		const updateUseCase = makeUpdateUsecase()

		await updateUseCase.execute({ id, name, race, size, age, locale, org_id })
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(204).send()
}
