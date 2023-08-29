import { FastifyRequest, FastifyReply } from 'fastify'

import { makeGetUserProfileUsecase } from '@/use-case/factories/users/make-get-user-profile-usecase'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	const getUserProfile = makeGetUserProfileUsecase()

	const { user } = await getUserProfile.execute({ userId: request.user.sub })

	return reply.status(200).send({
		user: {
			...user,
			password_hash: undefined,
		},
	})
}
