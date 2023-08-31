import { randomUUID } from 'crypto'
import { Pet, Prisma } from '@prisma/client'

import { PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
	public pets: Pet[] = []

	async create(data: Prisma.PetCreateInput) {
		const { name, race, size, age, locale } = data

		const pet = {
			id: randomUUID(),
			name,
			race,
			size,
			age,
			locale,
			created_at: new Date(),
		}

		this.pets.push(pet)

		return pet
	}
}
