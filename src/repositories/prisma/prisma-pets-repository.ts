import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { ListQuery, PetsRepository } from '../pets-repository'

export class PrismaPetsRepository implements PetsRepository {
	async list(query: ListQuery) {
		const filters = Object.entries(query)
			.filter(([key, value]) => key !== 'page')
			.reduce((res, [key, value]) => ({ ...res, [key]: value }), {})

		const pets = await prisma.pet.findMany({
			where: {
				...filters,
			},
			take: 20,
			skip: (query.page - 1) * 20,
		})

		return pets
	}

	async findById(id: string) {
		const pet = await prisma.pet.findUnique({
			where: {
				id,
			},
		})

		return pet
	}

	async create(data: Prisma.PetUncheckedCreateInput) {
		const pet = await prisma.pet.create({ data })
		return pet
	}
}
