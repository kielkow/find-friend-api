import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { UpdateUseCase } from '../../usecases/orgs/update/update'

export function makeUpdateUsecase() {
	const prismaOrgsRepository = new PrismaOrgsRepository()
	const updateUseCase = new UpdateUseCase(prismaOrgsRepository)

	return updateUseCase
}
