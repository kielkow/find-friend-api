import { randomUUID } from 'crypto'

import { beforeEach, describe, expect, it } from 'vitest'

import { RegisterUseCase } from './register'

import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

describe('PETS - REGISTER USE CASE', () => {
	let inMemoryPetsRepository: InMemoryPetsRepository, sut: RegisterUseCase

	beforeEach(() => {
		inMemoryPetsRepository = new InMemoryPetsRepository()
		sut = new RegisterUseCase(inMemoryPetsRepository)
	})

	it('should be able register a new pet', async () => {
		const { pet } = await sut.execute({
			name: 'Lucky',
			race: 'Border Collie',
			size: 'MEDIUM',
			age: 1,
			locale: 'SP',
			org_id: randomUUID(),
		})

		expect(pet.id).toEqual(expect.any(String))
	})
})
