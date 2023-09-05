import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeListPetsUsecase } from '@/use-case/factories/pets/make-list-pets-usecase'

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listQuerySchema = z.object({
		name: z.string().optional(),
		race: z.string().optional(),
		size: z.enum(['SMALL', 'MEDIUM', 'BIG']).optional(),
		age: z.coerce.number().nonnegative().optional(),
		locale: z.enum(['SP', 'RJ', 'MG']),
		page: z.coerce.number().min(1).default(1),
	})

	const query = listQuerySchema.parse(request.query)

	const listPetsUseCase = makeListPetsUsecase()

	const { pets } = await listPetsUseCase.execute({ ...query })

	return reply.status(200).send({ pets })
}
