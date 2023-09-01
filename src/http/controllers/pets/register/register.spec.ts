import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('PETS REGISTER CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register a new pet', async () => {
		const { token } = await createAuthenticateUser(app)

		const response = await request(app.server)
			.post('/pets')
			.set('Authorization', `Bearer ${token}`)
			.send({
				name: 'Lucky',
				race: 'Border Collie',
				size: 'MEDIUM',
				age: 1,
				locale: 'SP',
			})

		expect(response.statusCode).toEqual(201)
	})
})
