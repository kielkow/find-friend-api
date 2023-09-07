import { hash } from 'bcryptjs'
import { Locale, ORG } from '@prisma/client'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { OrgAlreadyExistsError } from '../../../errors/org-already-exists-error'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
	address: string
	phone: string
	locale: Locale
}

interface RegisterUseCaseResponse {
	org: ORG
}

export class RegisterUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		name,
		email,
		password,
		address,
		phone,
		locale,
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const orgExists = await this.orgsRepository.findByEmail(email)

		if (orgExists) throw new OrgAlreadyExistsError()

		const password_hash = await hash(password, 6)

		const org = await this.orgsRepository.create({
			name,
			email,
			password_hash,
			address,
			phone,
			locale,
		})

		return { org }
	}
}
