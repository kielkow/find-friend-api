import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('PETS LIST CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list pets', async () => {
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

		await request(app.server)
			.post('/pets')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Thor',
				race: 'Pitbull',
				size: 'MEDIUM',
				age: 2,
				locale: 'MG',
			})

		const response = await request(app.server)
			.get('/pets')
			.set('Authorization', `Bearer ${token}`)
			.query({
				locale: 'SP',
			})
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.pets).toHaveLength(1)
		expect(response.body.pets).toEqual([
			expect.objectContaining({ name: 'Lucky' }),
		])
	})

	it('should not be able to list pets without locale', async () => {
		const { token } = await createAuthenticateUser(
			app,
			false,
			'Jonh Doe Jr.',
			'jonhdoejr@example.com',
		)

		const response = await request(app.server)
			.get('/pets')
			.set('Authorization', `Bearer ${token}`)
			.query({})
			.send()

		expect(response.statusCode).toEqual(400)
	})
})
