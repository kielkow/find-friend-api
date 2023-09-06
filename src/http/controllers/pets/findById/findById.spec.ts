import { app } from '@/app'
import request from 'supertest'
import { randomUUID } from 'crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('PETS FIND BY ID CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to find pet by ID', async () => {
		const { token } = await createAuthenticateUser(app)

		await request(app.server)
			.post('/pets')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Lucky',
				race: 'Border Collie',
				size: 'MEDIUM',
				age: 1,
				locale: 'SP',
			})

		const responseList = await request(app.server)
			.get('/pets')
			.set('Authorization', `Bearer ${token}`)
			.query({
				name: 'Lucky',
				locale: 'SP',
			})
			.send()

		const { id: petId } = responseList.body.pets[0]

		const response = await request(app.server)
			.get(`/pets/${petId}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pet).toEqual(
			expect.objectContaining({ id: petId, name: 'Lucky' }),
		)
	})

	it('should not be able find pet by invalid ID', async () => {
		const { token } = await createAuthenticateUser(
			app,
			false,
			'Jonh Doe Jr.',
			'jonhdoejr@example.com',
		)

		const uuid = randomUUID()

		const response = await request(app.server)
			.get(`/pets/${uuid}`)
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(409)
	})
})
