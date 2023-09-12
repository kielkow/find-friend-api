import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string) {
		const user = await prisma.user.findUnique({ where: { id } })
		return user
	}

	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({ where: { email } })
		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({ data })

		const client = await redis.connect()
		await client.set(`user-${user.id}`, JSON.stringify(user))
		await client.disconnect()

		return user
	}
}
