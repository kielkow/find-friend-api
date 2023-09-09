import { compare } from 'bcryptjs'
import { ORG } from '@prisma/client'

import { OrgsRepository } from '@/repositories/orgs-repository'
import { InvalidCredentialsError } from '../../../errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

interface AuthenticateUseCaseResponse {
	org: ORG
}

export class AuthenticateUseCase {
	constructor(private orgsRepository: OrgsRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const org = await this.orgsRepository.findByEmail(email)

		if (!org) throw new InvalidCredentialsError()

		const passwordMatch = await compare(password, org.password_hash)

		if (!passwordMatch) throw new InvalidCredentialsError()

		return { org }
	}
}
