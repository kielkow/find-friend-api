import { compare, hash } from 'bcryptjs'

import { beforeEach, describe, it, expect } from 'vitest'

import { UpdateUseCase } from './update'

import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

describe('ORG UPDATE USE CASE', () => {
	let inMemoryOrgsRepository: InMemoryOrgsRepository, sut: UpdateUseCase

	beforeEach(() => {
		inMemoryOrgsRepository = new InMemoryOrgsRepository()
		sut = new UpdateUseCase(inMemoryOrgsRepository)
	})

	it('should be able update an org', async () => {
		const { id } = await inMemoryOrgsRepository.create({
			name: 'Pets Org',
			email: 'pets@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const { org } = await sut.execute({
			id,
			name: 'Pets Org Update',
			email: 'petsupdate@org.com',
			password: '123457',
			address: 'Street Pets Org, 287',
			phone: '9090-9091',
			locale: 'MG',
		})

		const isPasswordCorrectlyHashed = await compare('123457', org.password_hash)

		expect(org.id).toEqual(id)
		expect(org.name).toEqual('Pets Org Update')
		expect(org.email).toEqual('petsupdate@org.com')
		expect(isPasswordCorrectlyHashed).toBeTruthy()
		expect(org.address).toEqual('Street Pets Org, 287')
		expect(org.phone).toEqual('9090-9091')
		expect(org.locale).toEqual('MG')
	})
})
