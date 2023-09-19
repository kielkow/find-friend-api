import { hash } from 'bcryptjs'
import { Locale, ORG, Role } from '@prisma/client'

import { OrgsRepository } from '@/repositories/orgs-repository'

import { ResourceNotFoundError } from '@/use-case/errors/resource-not-found-error'
import { OrgAlreadyExistsError } from '@/use-case/errors/org-already-exists-error'

interface UpdateUseCaseRequest {
	id: string
	name?: string
	email?: string
	password?: string
	role?: Role
	address?: string
	phone?: string
	locale?: Locale
}

interface UpdateUseCaseResponse {
	org: ORG
}

export class UpdateUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		id,
		name,
		email,
		password,
		role,
		address,
		phone,
		locale,
	}: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
		const orgExists = await this.orgsRepository.findById(id)
		if (!orgExists) throw new ResourceNotFoundError()

		if (email) {
			const orgEmailExists = await this.orgsRepository.findByEmail(email)

			if (orgEmailExists && orgEmailExists.id !== id) {
				throw new OrgAlreadyExistsError()
			}
		}

		const password_hash = password
			? await hash(password, 6)
			: orgExists.password_hash

		const org = await this.orgsRepository.update({
			id,
			name: name || orgExists.name,
			email: email || orgExists.email,
			password_hash,
			role: role || orgExists.role,
			address: address || orgExists.address,
			phone: phone || orgExists.phone,
			locale: locale || orgExists.locale,
		})
		if (!org) throw new ResourceNotFoundError()

		return { org }
	}
}
