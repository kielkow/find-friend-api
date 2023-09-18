import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { OrgUpdate, OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
	async findById(id: string) {
		let org

		const clientRedis = await redis.connect()
		org = await clientRedis.get(`org-${id}`)
		await clientRedis.disconnect()

		if (org) org = JSON.parse(org)
		else org = await prisma.oRG.findUnique({ where: { id } })

		return org
	}

	async findByEmail(email: string) {
		let org

		const clientRedis = await redis.connect()
		org = await clientRedis.get(`org-${email}`)
		await clientRedis.disconnect()

		if (org) org = JSON.parse(org)
		else org = await prisma.oRG.findUnique({ where: { email } })

		return org
	}

	async create(data: Prisma.ORGCreateInput) {
		const org = await prisma.oRG.create({ data })

		const clientRedis = await redis.connect()
		await clientRedis.set(`org-${org.id}`, JSON.stringify(org))
		await clientRedis.set(`org-${org.email}`, JSON.stringify(org))
		await clientRedis.disconnect()

		return org
	}

	async update(data: OrgUpdate) {
		const { id, name, email, password_hash, address, locale, phone, role } =
			data

		const org = await prisma.oRG.update({
			where: { id },
			data: { name, email, password_hash, address, locale, phone, role },
		})

		const clientRedis = await redis.connect()
		await clientRedis.set(`org-${org.id}`, '')
		await clientRedis.set(`org-${org.email}`, '')
		await clientRedis.disconnect()

		return org
	}
}
