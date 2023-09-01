import { Locale, Pet, Size } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-repository'

interface ListPetsUseCaseRequest {
	id?: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale?: Locale
}

interface ListPetsUseCaseResponse {
	pets: Pet[]
}

export class ListPetsUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute(
		query: ListPetsUseCaseRequest,
	): Promise<ListPetsUseCaseResponse> {
		const pets = await this.petsRepository.list(query)

		return { pets }
	}
}
