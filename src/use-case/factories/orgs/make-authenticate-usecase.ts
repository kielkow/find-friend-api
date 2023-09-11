import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { AuthenticateUseCase } from '../../usecases/orgs/authenticate/authenticate'

export function makeAuthenticateUseCase() {
	const prismaOrgsRepository = new PrismaOrgsRepository()
	const authenticateUseCase = new AuthenticateUseCase(prismaOrgsRepository)

	return authenticateUseCase
}
