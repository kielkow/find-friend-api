import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string) {
		let user

		const clientRedis = await redis.connect()
		user = await clientRedis.get(`user-${id}`)
		await clientRedis.disconnect()

		if (user) user = JSON.parse(user)
		else user = await prisma.user.findUnique({ where: { id } })

		return user
	}

	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({ where: { email } })
		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({ data })

		const clientRedis = await redis.connect()
		await clientRedis.set(`user-${user.id}`, JSON.stringify(user))
		await clientRedis.disconnect()

		return user
	}
}
