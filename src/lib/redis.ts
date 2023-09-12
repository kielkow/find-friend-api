import { env } from '@/env'
import { createClient } from 'redis'

class RedisClient {
	constructor() {}

	async connect() {
		const client = createClient({ url: env.REDIS_URL })

		client.on('error', (error) => {
			console.log(error)
			throw new Error('Fail to connect with Redis.')
		})

		await client.connect()

		return client
	}
}

export const redis = new RedisClient()
