import { Prisma, ORG, Locale, Role } from '@prisma/client'

export interface OrgUpdate {
	id: string
	name: string
	email: string
	password_hash: string
	role: Role
	address: string
	phone: string
	locale: Locale
}

export interface OrgsRepository {
	findById(id: string): Promise<ORG | null>
	findByEmail(email: string): Promise<ORG | null>

	create(data: Prisma.ORGCreateInput): Promise<ORG>

	update(data: OrgUpdate): Promise<ORG | null>
}
