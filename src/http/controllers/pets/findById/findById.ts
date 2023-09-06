import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeFindPetByIdUseCase } from '@/use-case/factories/pets/make-findById-usecase'
import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

export async function findById(request: FastifyRequest, reply: FastifyReply) {
	const findByIdParamSchema = z.object({
		id: z.string().uuid(),
	})

	const { id: petId } = findByIdParamSchema.parse(request.params)

	try {
		const findPetByIdUseCase = makeFindPetByIdUseCase()

		const { pet } = await findPetByIdUseCase.execute({ petId })

		return reply.status(200).send({ pet })
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}
}
