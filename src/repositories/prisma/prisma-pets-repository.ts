import { redis } from '@/lib/redis'
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
		let pet

		const clientRedis = await redis.connect()
		pet = await clientRedis.get(`pet-${id}`)
		await clientRedis.disconnect()

		if (pet) pet = JSON.parse(pet)
		else pet = await prisma.pet.findUnique({ where: { id } })

		return pet
	}

	async create(data: Prisma.PetUncheckedCreateInput) {
		const pet = await prisma.pet.create({ data })

		const clientRedis = await redis.connect()
		await clientRedis.set(`pet-${pet.id}`, JSON.stringify(pet))
		await clientRedis.disconnect()

		return pet
	}
}
