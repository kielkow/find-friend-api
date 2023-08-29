import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
	HOST: z.string().default('0.0.0.0'),
	JWT_SECRET: z.string().default('apisolid'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	throw new Error(`INVALID ENV VARS!\n ${JSON.stringify(_env.error.format())}`)
}

export const env = _env.data
