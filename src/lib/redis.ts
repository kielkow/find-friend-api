import { env } from '@/env'
import { createClient } from 'redis'
import redisMock from 'redis-mock'

class RedisClient {
	constructor() {}

	async connect() {
		if (process.env.NODE_ENV === 'test') {
			const client = redisMock.createClient()
			client.disconnect = () => client.quit()
			return client
		}

		const client = createClient({ url: env.REDIS_URL })

		client.on('error', (error) => {
			console.log(error)
			throw new Error('Fail to connect with Redis.')
		})

		await client.connect()

		return client
	}

	async testConn() {
		try {
			const client = createClient({ url: env.REDIS_URL })

			client.on('error', (error) => {
				throw error
			})

			await client.connect()

			await client.setEx('test-connection', 60, '1')

			const result = await client.get('test-connection')
			console.info({
				status: 'Test connection with Redis success.',
				result,
			})

			await client.disconnect()
		} catch (error) {
			console.error({
				status: 'Test connection with Redis fail.',
				error,
			})

			throw error
		}
	}
}

export const redis = new RedisClient()
