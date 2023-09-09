import { hash } from 'bcryptjs'

import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateUseCase } from './authenticate'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { InvalidCredentialsError } from '../../../errors/invalid-credentials-error'

describe('ORG AUTHENTICATE USE CASE', () => {
	let inMemoryOrgsRepository: OrgsRepository, sut: AuthenticateUseCase

	beforeEach(() => {
		inMemoryOrgsRepository = new InMemoryOrgsRepository()
		sut = new AuthenticateUseCase(inMemoryOrgsRepository)
	})

	it('should be able authenticate an org', async () => {
		await inMemoryOrgsRepository.create({
			name: 'New Org Institute',
			email: 'institute@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const { org } = await sut.execute({
			email: 'institute@org.com',
			password: '123456',
		})

		expect(org.id).toEqual(expect.any(String))
	})

	it('should not be able authenticate with wrong e-mail', async () => {
		await expect(() =>
			sut.execute({
				email: 'institute@org.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able authenticate with wrong password', async () => {
		await inMemoryOrgsRepository.create({
			name: 'New Org Institute',
			email: 'institute@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		await expect(() =>
			sut.execute({
				email: 'institute@org.com',
				password: 'wrong-password',
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
