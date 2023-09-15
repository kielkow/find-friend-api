import { redis } from '@/lib/redis'
import { testConn as prismaTestConn } from '@/lib/prisma'

interface HealthcheckUseCaseResponse {
	message: string
}

export class HealthcheckUseCase {
	constructor() {}

	async execute(): Promise<HealthcheckUseCaseResponse> {
		await prismaTestConn()
		await redis.testConn()

		return { message: 'Server is up.' }
	}
}
