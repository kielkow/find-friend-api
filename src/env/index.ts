import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	JWT_SECRET: z.string().default('findfriendapi'),

	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
	HOST: z.string().default('0.0.0.0'),

	POSTGRESQL_DATABASE: z.string().default('findfriendapi'),
	POSTGRESQL_USERNAME: z.string().default('postgresql'),
	POSTGRESQL_PASSWORD: z.string().default('postgresql'),

	DATABASE_URL: z
		.string()
		.default(
			'postgresql://postgresql:postgresql@postgresql:5432/findfriendapi?schema=public',
		),

	REDIS_PASSWORD: z.string().default('redis'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	throw new Error(`INVALID ENV VARS!\n ${JSON.stringify(_env.error.format())}`)
}

export const env = _env.data
