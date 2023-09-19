import { app } from '@/app'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

describe('ORG UPDATE CONTROLLER', () => {
	let prismaOrgsRepository: PrismaOrgsRepository

	beforeAll(async () => {
		prismaOrgsRepository = new PrismaOrgsRepository()

		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update an org', async () => {
		const { id: orgId } = await prismaOrgsRepository.create({
			name: 'Pets Org',
			email: 'pets@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const authResponse = await request(app.server).post('/orgs/sessions').send({
			email: 'pets@org.com',
			password: '123456',
		})

		const { token } = authResponse.body

		const response = await request(app.server)
			.put(`/orgs/${orgId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Pets Org Update',
				email: 'petsupdate@org.com',
				password: '123457',
				address: 'Street Pets Org, 267',
				phone: '9090-9090',
				locale: 'SP',
			})

		expect(response.statusCode).toEqual(204)
	})
})
