import { randomUUID } from 'crypto'
import { Locale, Pet, Prisma, Size } from '@prisma/client'

import { ListQuery, PetsRepository } from '../pets-repository'

interface Query {
	id?: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale: Locale
}

export class InMemoryPetsRepository implements PetsRepository {
	public pets: Pet[] = []

	async list(query: ListQuery) {
		const fields = Object.keys(query).filter((key) => key !== 'page')

		const pets = this.pets
			.filter((pet) => {
				for (const field of fields) {
					const petField = pet[field as keyof Query]
					const queryField = query[field as keyof Query]

					if (petField !== queryField) return false
				}

				return pet
			})
			.slice((query.page - 1) * 20, query.page * 20)

		return pets
	}

	async findById(id: string) {
		const pet = this.pets.find((pet) => pet.id === id)

		if (!pet) return null

		return pet
	}

	async create(data: Prisma.PetUncheckedCreateInput) {
		const { name, race, size, age, locale, org_id } = data

		const pet = {
			id: randomUUID(),
			name,
			race,
			size,
			age,
			locale,
			created_at: new Date(),
			org_id,
		}

		this.pets.push(pet)

		return pet
	}
}
