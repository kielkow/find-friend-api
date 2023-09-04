import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { ListPetsUseCase } from '../../usecases/pets/listPets/listPets'

export function makeListPetsUsecase() {
	const prismaPetsRepository = new PrismaPetsRepository()
	const listPetsUseCase = new ListPetsUseCase(prismaPetsRepository)

	return listPetsUseCase
}
