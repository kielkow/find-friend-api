import { hash } from 'bcryptjs'

import { beforeEach, describe, it, expect } from 'vitest'

import { UpdateUseCase } from './update'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'

describe('PET UPDATE USE CASE', () => {
	let inMemoryPetsRepository: InMemoryPetsRepository,
		inMemoryOrgsRepository: InMemoryOrgsRepository,
		sut: UpdateUseCase

	beforeEach(() => {
		inMemoryPetsRepository = new InMemoryPetsRepository()
		inMemoryOrgsRepository = new InMemoryOrgsRepository()
		sut = new UpdateUseCase(inMemoryPetsRepository, inMemoryOrgsRepository)
	})

	it('should be able update an pet', async () => {
		const original_org = await inMemoryOrgsRepository.create({
			name: 'Pets Org Original',
			email: 'petsoriginal@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const update_org = await inMemoryOrgsRepository.create({
			name: 'Pets Org Update',
			email: 'petsupdate@org.com',
			password_hash: await hash('123456', 6),
			address: 'Street Pets Org, 267',
			phone: '9090-9090',
			locale: 'SP',
		})

		const { id: petId } = await inMemoryPetsRepository.create({
			name: 'Lucky',
			race: 'Border Collie',
			size: 'MEDIUM',
			age: 1,
			locale: 'SP',
			org_id: original_org.id,
		})

		const { pet } = await sut.execute({
			id: petId,
			name: 'Lucky Jr.',
			race: 'Border Collie Small',
			size: 'SMALL',
			age: 1.5,
			locale: 'MG',
			org_id: update_org.id,
		})

		expect(pet.id).toEqual(petId)
		expect(pet.name).toEqual('Lucky Jr.')
		expect(pet.race).toEqual('Border Collie Small')
		expect(pet.size).toEqual('SMALL')
		expect(pet.age).toEqual(1.5)
		expect(pet.locale).toEqual('MG')
		expect(pet.org_id).toEqual(update_org.id)
	})
})
