import { rabbitmq } from '@/lib/rabbitmq'
import { cacheProvider } from '@/lib/cache'
import { testConn as prismaTestConn } from '@/lib/prisma'

interface HealthcheckUseCaseResponse {
	message: string
}

export class HealthcheckUseCase {
	constructor() {}

	async execute(): Promise<HealthcheckUseCaseResponse> {
		await prismaTestConn()
		await rabbitmq.testConn()
		await cacheProvider.testConn()

		return { message: 'Server is up.' }
	}
}
