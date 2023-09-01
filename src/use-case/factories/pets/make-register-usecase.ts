import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { RegisterUseCase } from '../../usecases/pets/register/register'

export function makeRegisterUsecase() {
	const prismaPetsRepository = new PrismaPetsRepository()
	const registerUseCase = new RegisterUseCase(prismaPetsRepository)

	return registerUseCase
}
