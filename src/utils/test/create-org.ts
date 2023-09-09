import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function createOrg(app: FastifyInstance) {
	const org = await prisma.oRG.create({
		data: {
			name: 'New Org',
			email: 'new@org.com',
			password_hash: await hash('123456', 7),
			role: 'ADMIN',
			address: 'Street New Org 234',
			locale: 'SP',
			phone: '9090-9090',
		},
	})

	return { org }
}
