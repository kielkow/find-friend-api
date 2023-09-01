import { beforeEach, describe, expect, it } from 'vitest'

import { ListPetsUseCase } from './listPets'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

describe('PETS - LIST PETS USE CASE', () => {
	let inMemoryPetsRepository: InMemoryPetsRepository, sut: ListPetsUseCase

	beforeEach(() => {
		inMemoryPetsRepository = new InMemoryPetsRepository()
		sut = new ListPetsUseCase(inMemoryPetsRepository)
	})

	it('should be able list pets', async () => {
		await inMemoryPetsRepository.create({
			name: 'Lucky',
			race: 'Border Collie',
			size: 'MEDIUM',
			age: 1,
			locale: 'SP',
		})

		await inMemoryPetsRepository.create({
			name: 'Thor',
			race: 'Pitbull',
			size: 'MEDIUM',
			age: 1,
			locale: 'MG',
		})

		const { pets } = await sut.execute({ locale: 'SP' })

		expect(pets).toHaveLength(1)
		expect(pets).toEqual([expect.objectContaining({ name: 'Lucky' })])
	})
})
