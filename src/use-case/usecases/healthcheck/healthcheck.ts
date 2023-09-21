import { redis } from '@/lib/redis'
import { rabbitmq } from '@/lib/rabbitmq'
import { testConn as prismaTestConn } from '@/lib/prisma'

interface HealthcheckUseCaseResponse {
	message: string
}

export class HealthcheckUseCase {
	constructor() {}

	async execute(): Promise<HealthcheckUseCaseResponse> {
		await prismaTestConn()
		await redis.testConn()
		await rabbitmq.testConn()

		return { message: 'Server is up.' }
	}
}
