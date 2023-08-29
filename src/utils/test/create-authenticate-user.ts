import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false,
) {
	await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'jonhdoe@example.com',
			password_hash: await hash('123456', 7),
			role: isAdmin ? 'ADMIN' : 'MEMBER',
		},
	})

	const authResponse = await request(app.server).post('/sessions').send({
		email: 'jonhdoe@example.com',
		password: '123456',
	})

	const { token } = authResponse.body

	const profileResponse = await request(app.server)
		.get('/me')
		.set('Authorization', `Bearer ${token}`)
		.send()

	return { token, ...profileResponse.body.user }
}
