import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { RegisterUseCase } from '../../usecases/orgs/register/register'

export function makeRegisterUsecase() {
	const prismaOrgsRepository = new PrismaOrgsRepository()
	const registerUseCase = new RegisterUseCase(prismaOrgsRepository)

	return registerUseCase
}
