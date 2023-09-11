import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('ORG AUTHENTICATE CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to authenticate an org', async () => {
		await request(app.server).post('/orgs').send({
			name: 'New Org Institute',
			email: 'institute@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const response = await request(app.server).post('/orgs/sessions').send({
			email: 'institute@org.com',
			password: '123456',
		})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
	})
})
