import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

import { OrgAlreadyExistsError } from '../../../errors/org-already-exists-error'

describe('ORG REGISTER USE CASE', () => {
	let inMemoryOrgsRepository, sut: RegisterUseCase

	beforeEach(() => {
		inMemoryOrgsRepository = new InMemoryOrgsRepository()
		sut = new RegisterUseCase(inMemoryOrgsRepository)
	})

	it('should be able register a new org', async () => {
		const { org } = await sut.execute({
			name: 'Pets Org',
			email: 'pets@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		expect(org.id).toEqual(expect.any(String))
	})

	it('should hash org password upon registration', async () => {
		const { org } = await sut.execute({
			name: 'Pets Org',
			email: 'pets@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const isPasswordCorrectlyHashed = await compare('123456', org.password_hash)

		expect(isPasswordCorrectlyHashed).toBeTruthy()
	})

	it('should not be able to register with same email twice', async () => {
		await sut.execute({
			name: 'Pets Org',
			email: 'pets@org.com',
			password: '123456',
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		await expect(() =>
			sut.execute({
				name: 'Second Pets Org',
				email: 'pets@org.com',
				password: '123456',
				address: 'Street Pets Org 2, 267',
				phone: '9090-9091',
				locale: 'RJ',
			}),
		).rejects.toBeInstanceOf(OrgAlreadyExistsError)
	})
})
