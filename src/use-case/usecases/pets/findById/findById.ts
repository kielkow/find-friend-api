import { Pet } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-repository'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

interface FindPetByIdUseCaseRequest {
	petId: string
}

interface FindPetByIdUseCaseResponse {
	pet: Pet
}

export class FindPetByIdUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute({
		petId,
	}: FindPetByIdUseCaseRequest): Promise<FindPetByIdUseCaseResponse> {
		const pet = await this.petsRepository.findById(petId)

		if (!pet) throw new ResourceNotFoundError()

		return { pet }
	}
}
