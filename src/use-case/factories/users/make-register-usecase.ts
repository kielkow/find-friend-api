import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../../usecases/register/register'

export function makeRegisterUsecase() {
	const prismaUsersRepository = new PrismaUsersRepository()
	const registerUseCase = new RegisterUseCase(prismaUsersRepository)

	return registerUseCase
}
