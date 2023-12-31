import { Locale, Pet, Size } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-repository'

interface RegisterUseCaseRequest {
	name: string
	race: string
	size: Size
	age: number
	locale: Locale
	org_id: string
}

interface RegisterUseCaseResponse {
	pet: Pet
}

export class RegisterUseCase {
	constructor(private petsRepository: PetsRepository) {}

	async execute({
		name,
		race,
		size,
		age,
		locale,
		org_id,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const pet = await this.petsRepository.create({
			name,
			race,
			size,
			age,
			locale,
			org_id,
		})

		return { pet }
	}
}
