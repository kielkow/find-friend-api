import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { ListQuery, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
	async list(query: ListQuery) {
		const pets = await prisma.pet.findMany({
			where: {
				...query,
			},
		})

		return pets
	}

	async create(data: Prisma.PetCreateInput) {
		const pet = await prisma.pet.create({ data })
		return pet
	}
}
