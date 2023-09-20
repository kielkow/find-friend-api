import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { UserUpdate, UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string) {
		let user

		const clientRedis = await redis.connect()
		user = await clientRedis.get(`user-${id}`)
		await clientRedis.disconnect()

		if (user) user = JSON.parse(user.toString())
		else user = await prisma.user.findUnique({ where: { id } })

		return user
	}

	async findByEmail(email: string) {
		let user

		const clientRedis = await redis.connect()
		user = await clientRedis.get(`user-${email}`)
		await clientRedis.disconnect()

		if (user) user = JSON.parse(user.toString())
		else user = await prisma.user.findUnique({ where: { email } })

		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({ data })

		const clientRedis = await redis.connect()
		await clientRedis.set(`user-${user.id}`, JSON.stringify(user))
		await clientRedis.set(`user-${user.email}`, JSON.stringify(user))
		await clientRedis.disconnect()

		return user
	}

	async update(data: UserUpdate) {
		const { id, name, email, password_hash } = data

		const user = await prisma.user.update({
			where: { id },
			data: { name, email, password_hash },
		})

		const clientRedis = await redis.connect()
		await clientRedis.set(`user-${user.id}`, '')
		await clientRedis.set(`user-${user.email}`, '')
		await clientRedis.disconnect()

		return user
	}
}
