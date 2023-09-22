import { cacheProvider } from '@/lib/cache'
import { messageProvider } from '@/lib/message'
import { testConn as prismaTestConn } from '@/lib/prisma'

interface HealthcheckUseCaseResponse {
	message: string
}

export class HealthcheckUseCase {
	constructor() {}

	async execute(): Promise<HealthcheckUseCaseResponse> {
		await prismaTestConn()
		await cacheProvider.testConn()
		await messageProvider.testConn()

		return { message: 'Server is up.' }
	}
}
