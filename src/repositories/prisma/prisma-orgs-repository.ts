import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
	async findById(id: string) {
		const org = await prisma.oRG.findUnique({ where: { id } })
		return org
	}

	async findByEmail(email: string) {
		const org = await prisma.oRG.findUnique({ where: { email } })
		return org
	}

	async create(data: Prisma.ORGCreateInput) {
		const org = await prisma.oRG.create({ data })

		const client = await redis.connect()
		await client.set(`org-${org.id}`, JSON.stringify(org))
		await client.disconnect()

		return org
	}
}
