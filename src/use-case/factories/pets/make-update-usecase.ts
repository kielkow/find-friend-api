import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'

import { UpdateUseCase } from '../../usecases/pets/update/update'

export function makeUpdateUsecase() {
	const prismaPetsRepository = new PrismaPetsRepository()
	const prismaOrgsRepository = new PrismaOrgsRepository()

	const updateUseCase = new UpdateUseCase(
		prismaPetsRepository,
		prismaOrgsRepository,
	)

	return updateUseCase
}
