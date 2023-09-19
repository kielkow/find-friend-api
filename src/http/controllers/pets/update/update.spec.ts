import { app } from '@/app'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

describe('PET UPDATE CONTROLLER', () => {
	let prismaPetsRepository: PrismaPetsRepository,
		prismaOrgsRepository: PrismaOrgsRepository

	beforeAll(async () => {
		prismaPetsRepository = new PrismaPetsRepository()
		prismaOrgsRepository = new PrismaOrgsRepository()

		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to update an pet', async () => {
		const { token } = await createAuthenticateUser(app)

		const original_org = await prismaOrgsRepository.create({
			name: 'Pets Org Original',
			email: 'petsoriginal@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const update_org = await prismaOrgsRepository.create({
			name: 'Pets Org Update',
			email: 'petsupdate@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const { id: petId } = await prismaPetsRepository.create({
			name: 'Lucky',
			race: 'Border Collie',
			size: 'MEDIUM',
			age: 1,
			locale: 'SP',
			org_id: original_org.id,
		})

		const response = await request(app.server)
			.put(`/pets/${petId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Lucky Jr.',
				race: 'Border Collie Small',
				size: 'SMALL',
				age: 2,
				locale: 'MG',
				org_id: update_org.id,
			})

		expect(response.statusCode).toEqual(204)
	})
})
