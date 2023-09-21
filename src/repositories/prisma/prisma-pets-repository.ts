import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { cacheProvider } from '@/lib/cache'

import { ListQuery, PetUpdate, PetsRepository } from '../pets-repository'

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

	// TODO: If pet does not exists at cache, set it.
	async findById(id: string) {
		let pet

		pet = await cacheProvider.get(`pet-${id}`)

		if (pet) pet = JSON.parse(pet.toString())
		else pet = await prisma.pet.findUnique({ where: { id } })

		return pet
	}

	async create(data: Prisma.PetUncheckedCreateInput) {
		const pet = await prisma.pet.create({ data })

		await cacheProvider.set(`pet-${pet.id}`, JSON.stringify(pet))

		return pet
	}

	async update(data: PetUpdate) {
		const { id, name, race, size, age, locale, org_id } = data

		const pet = await prisma.pet.update({
			where: { id },
			data: { name, race, size, age, locale, org_id },
		})

		await cacheProvider.set(`pet-${pet.id}`, '')

		return pet
	}
}
