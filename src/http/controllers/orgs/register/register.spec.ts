import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('ORGS REGISTER CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to register a new org', async () => {
		const response = await request(app.server).post('/orgs').send({
			name: 'Pets Org',
			email: 'pets@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		expect(response.statusCode).toEqual(201)
	})
})
