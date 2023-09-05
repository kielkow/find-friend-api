import { Locale, Pet, Size } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-repository'
import { LocaleMustBeInformed } from '@/use-case/errors/locale-must-be-informed-error'

interface ListPetsUseCaseRequest {
	id?: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale: Locale
	page: number
}

interface ListPetsUseCaseResponse {
	pets: Pet[]
}

export class ListPetsUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute(
		query: ListPetsUseCaseRequest,
	): Promise<ListPetsUseCaseResponse> {
		if (!query.locale) {
			throw new LocaleMustBeInformed()
		}

		const pets = await this.petsRepository.list(query)

		return { pets }
	}
}
