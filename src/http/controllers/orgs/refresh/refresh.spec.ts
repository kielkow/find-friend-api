import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('ORG REFRESH TOKEN CONTROLLER', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh a token', async () => {
		await request(app.server).post('/orgs').send({
			name: 'New Org Institute',
			email: 'institute@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const authResponse = await request(app.server).post('/orgs/sessions').send({
			email: 'institute@org.com',
			password: '123456',
		})

		const cookies = authResponse.get('Set-Cookie')

		const response = await request(app.server)
			.patch('/orgs/token/refresh')
			.set('Cookie', cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			token: expect.any(String),
		})
		expect(response.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken='),
		])
	})
})
