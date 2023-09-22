import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { cacheProvider } from '@/lib/cache'

import { OrgUpdate, OrgsRepository } from '../orgs-repository'

export class PrismaOrgsRepository implements OrgsRepository {
	async findById(id: string) {
		let org

		org = await cacheProvider.get(`org-${id}`)

		if (org) {
			org = JSON.parse(org.toString())
		} else {
			org = await prisma.oRG.findUnique({ where: { id } })

			if (org) await cacheProvider.set(`org-${id}`, JSON.stringify(org))
		}

		return org
	}

	async findByEmail(email: string) {
		let org

		org = await cacheProvider.get(`org-${email}`)

		if (org) {
			org = JSON.parse(org.toString())
		} else {
			org = await prisma.oRG.findUnique({ where: { email } })

			if (org) await cacheProvider.set(`org-${email}`, JSON.stringify(org))
		}

		return org
	}

	async create(data: Prisma.ORGCreateInput) {
		const org = await prisma.oRG.create({ data })

		await cacheProvider.set(`org-${org.id}`, JSON.stringify(org))
		await cacheProvider.set(`org-${org.email}`, JSON.stringify(org))

		return org
	}

	async update(data: OrgUpdate) {
		const { id, name, email, password_hash, address, locale, phone, role } =
			data

		const org = await prisma.oRG.update({
			where: { id },
			data: { name, email, password_hash, address, locale, phone, role },
		})

		await cacheProvider.set(`org-${org.id}`, '')
		await cacheProvider.set(`org-${org.email}`, '')

		return org
	}
}
