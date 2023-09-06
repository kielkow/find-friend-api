import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FindPetByIdUseCase } from '../../usecases/pets/findById/findById'

export function makeFindPetByIdUseCase() {
	const prismaPetsRepository = new PrismaPetsRepository()
	const findPetByIdUseCase = new FindPetByIdUseCase(prismaPetsRepository)

	return findPetByIdUseCase
}
