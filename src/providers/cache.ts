import { env } from '@/env'
import redisMock from 'redis-mock'
import { createClient } from 'redis'

class CacheProvider {
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

	async set(key: string, value: string) {
		const client = await this.connect()
		await client.set(key, value)
		await client.disconnect()
	}

	async get(key: string) {
		const client = await this.connect()
		const value = await client.get(key)
		await client.disconnect()
		return value
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

export const cacheProvider = new CacheProvider()
