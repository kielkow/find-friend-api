import { beforeEach, describe, expect, it } from 'vitest'

import { FindPetByIdUseCase } from './findById'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

describe('PETS - FIND BY ID USE CASE', () => {
	let inMemoryPetsRepository: InMemoryPetsRepository, sut: FindPetByIdUseCase

	beforeEach(() => {
		inMemoryPetsRepository = new InMemoryPetsRepository()
		sut = new FindPetByIdUseCase(inMemoryPetsRepository)
	})

	it('should be able find pet by id', async () => {
		await inMemoryPetsRepository.create({
			name: 'Lucky',
			race: 'Border Collie',
			size: 'MEDIUM',
			age: 1,
			locale: 'SP',
		})

		const petId = inMemoryPetsRepository.pets[0].id

		const { pet } = await sut.execute({ petId })

		expect(pet).toEqual(expect.objectContaining({ name: 'Lucky' }))
	})
})
