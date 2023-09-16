import { Locale, Pet, Size } from '@prisma/client'

import { PetsRepository } from '@/repositories/pets-repository'
import { OrgsRepository } from '@/repositories/orgs-repository'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'

interface UpdateUseCaseRequest {
	id: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale?: Locale
	org_id?: string
}

interface UpdateUseCaseResponse {
	pet: Pet
}

export class UpdateUseCase {
	constructor(
		private petsRepository: PetsRepository,
		private orgsRepository: OrgsRepository,
	) {}

	async execute({
		id,
		name,
		race,
		size,
		age,
		locale,
		org_id,
	}: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
		const petExists = await this.petsRepository.findById(id)
		if (!petExists) throw new ResourceNotFoundError()

		if (org_id) {
			const orgExists = await this.orgsRepository.findById(org_id)
			if (!orgExists) throw new ResourceNotFoundError()
		}

		const pet = await this.petsRepository.update({
			id,
			name: name || petExists.name,
			race: race || petExists.race,
			size: size || petExists.size,
			age: age || petExists.age,
			locale: locale || petExists.locale,
			org_id: org_id || petExists.org_id,
		})
		if (!pet) throw new ResourceNotFoundError()

		return { pet }
	}
}
