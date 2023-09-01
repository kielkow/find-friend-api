import { Prisma, Pet, Locale, Size } from '@prisma/client'

export interface ListQuery {
	id?: string
	name?: string
	race?: string
	size?: Size
	age?: number
	locale?: Locale
}

export interface PetsRepository {
	list(query: ListQuery): Promise<Pet[]>
	create(data: Prisma.PetCreateInput): Promise<Pet>
}
