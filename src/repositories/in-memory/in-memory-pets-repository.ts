import { randomUUID } from 'crypto'
import { Pet, Prisma } from '@prisma/client'

import { ListQuery, PetsRepository } from '../pets-repository'

export class InMemoryPetsRepository implements PetsRepository {
	public pets: Pet[] = []

	async list(query: ListQuery) {
		const fields = Object.keys(query)

		const pets = this.pets.filter((pet) => {
			for (const field of fields) {
				const petField = pet[field as keyof ListQuery]
				const queryField = query[field as keyof ListQuery]

				if (petField !== queryField) return false
			}

			return pet
		})

		return pets
	}

	async findById(id: string) {
		const pet = this.pets.find((pet) => pet.id === id)

		if (!pet) return null

		return pet
	}

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
