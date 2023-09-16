import { Prisma, Pet, Locale, Size } from '@prisma/client'

export interface ListQuery {
	id?: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale: Locale
	page: number
}

export interface PetUpdate {
	id: string
	name: string
	race: string
	size: Size
	age: number
	locale: Locale
	org_id: string
}

export interface PetsRepository {
	list(query: ListQuery): Promise<Pet[]>
	findById(id: string): Promise<Pet | null>

	create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>

	update(data: PetUpdate): Promise<Pet | null>
}
