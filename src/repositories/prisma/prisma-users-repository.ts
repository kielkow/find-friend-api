import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { cacheProvider } from '@/lib/cache'

import { UserUpdate, UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
	async findById(id: string) {
		let user

		user = await cacheProvider.get(`user-${id}`)

		if (user) user = JSON.parse(user.toString())
		else user = await prisma.user.findUnique({ where: { id } })

		return user
	}

	async findByEmail(email: string) {
		let user

		user = await cacheProvider.get(`user-${email}`)

		if (user) user = JSON.parse(user.toString())
		else user = await prisma.user.findUnique({ where: { email } })

		return user
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({ data })

		await cacheProvider.set(`user-${user.id}`, JSON.stringify(user))
		await cacheProvider.set(`user-${user.email}`, JSON.stringify(user))

		return user
	}

	async update(data: UserUpdate) {
		const { id, name, email, password_hash } = data

		const user = await prisma.user.update({
			where: { id },
			data: { name, email, password_hash },
		})

		await cacheProvider.set(`user-${user.id}`, '')
		await cacheProvider.set(`user-${user.email}`, '')

		return user
	}
}
