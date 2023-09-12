import { env } from '@/env'
import { createClient } from 'redis'

const client = createClient({ url: env.REDIS_URL })

client.on('error', (error) => {
	console.log(error)
	throw new Error('Fail to connect with Redis.')
})

client.on('connect', () => {})

export const redis = client
