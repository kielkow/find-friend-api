import { FastifyRequest, FastifyReply } from 'fastify'

import { messageProvider } from '@/providers/message'
import { makeRegisterUsecase } from '@/use-case/factories/users/make-register-usecase'

export async function consumeMessages(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const registerUseCase = makeRegisterUsecase()

	await messageProvider.consume('create-users', registerUseCase.execute)

	return reply.status(200).send({ message: 'Messages consumed.' })
}
