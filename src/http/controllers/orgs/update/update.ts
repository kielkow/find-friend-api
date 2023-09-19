import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

import { makeUpdateUsecase } from '@/use-case/factories/orgs/make-update-usecase'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { OrgAlreadyExistsError } from '@/use-case/errors/org-already-exists-error'

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const updateParamsSchema = z.object({ id: z.string().uuid() })
	const updateBodySchema = z.object({
		name: z.string().optional(),
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
		role: z.enum(['MEMBER', 'ADMIN']).optional(),
		address: z.string().optional(),
		phone: z.string().optional(),
		locale: z.enum(['SP', 'RJ', 'MG']).optional(),
	})

	const { id } = updateParamsSchema.parse(request.params)
	const { name, email, password, role, address, phone, locale } =
		updateBodySchema.parse(request.body)

	try {
		const updateUseCase = makeUpdateUsecase()

		await updateUseCase.execute({
			id,
			name,
			email,
			password,
			role,
			address,
			phone,
			locale,
		})
	} catch (error) {
		if (error instanceof ResourceNotFoundError) {
			return reply.status(409).send({ message: error.message })
		}

		if (error instanceof OrgAlreadyExistsError) {
			return reply.status(409).send({ message: error.message })
		}

		throw error
	}

	return reply.status(204).send()
}
