import { randomUUID } from 'crypto'
import { Prisma, Role, ORG } from '@prisma/client'

import { OrgUpdate, OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
	public orgs: ORG[] = []

	async findById(id: string) {
		const org = this.orgs.find((org) => org.id === id)

		if (!org) return null

		return org
	}

	async findByEmail(email: string) {
		const org = this.orgs.find((org) => org.email === email)

		if (!org) return null

		return org
	}

	async create(data: Prisma.ORGCreateInput) {
		const { name, email, password_hash, address, locale, phone } = data

		const org = {
			id: randomUUID(),
			name,
			email,
			password_hash,
			address,
			locale,
			phone,
			role: Role.ADMIN,
			created_at: new Date(),
		}

		this.orgs.push(org)

		return org
	}

	async update(data: OrgUpdate) {
		const { id, name, email, password_hash, address, locale, phone, role } =
			data

		let org = this.orgs.find((org) => org.id === id)

		if (!org) return null

		org = { ...org, name, email, password_hash, address, locale, phone, role }

		return org
	}
}
