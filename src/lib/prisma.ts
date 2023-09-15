import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
	log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

export async function testConn() {
	const prisma = new PrismaClient({
		log: env.NODE_ENV === 'dev' ? ['query'] : [],
	})

	try {
		await prisma.$connect()

		const result = await prisma.$executeRawUnsafe('SELECT 1')
		console.info({
			status: 'Test connection with Database success.',
			result,
		})

		await prisma.$disconnect()
	} catch (error) {
		console.error({
			status: 'Test connection with Database fail.',
			error,
		})

		throw error
	}
}
