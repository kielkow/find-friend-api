import { env } from '@/env'
import amqplib from 'amqplib'

class MessageProvider {
	constructor() {}

	async connect() {
		const connection = await amqplib.connect(env.RABBIT_URL)

		return connection
	}

	async publish(queue: string, message: string) {
		const connection = await amqplib.connect(env.RABBIT_URL)

		const channel = await connection.createChannel()
		await channel.assertQueue(queue)

		channel.sendToQueue(queue, Buffer.from(message))

		channel.close()
		connection.close()
	}

	async consume(queue: string, method: Function) {
		const connection = await amqplib.connect(env.RABBIT_URL)

		const channel = await connection.createChannel()
		await channel.assertQueue(queue)

		await channel.consume(queue, async (msg) => {
			if (msg !== null) {
				await method(msg.content.toString())
				channel.ack(msg)
			}
		})

		channel.close()
		connection.close()
	}

	async testConn() {
		try {
			const connection = await amqplib.connect(env.RABBIT_URL)

			const channel = await connection.createChannel()
			await channel.assertQueue('test-conn')

			channel.close()
			connection.close()

			console.info({
				status: 'Test connection with RabbitMQ success.',
				result: true,
			})
		} catch (error) {
			console.error({
				status: 'Test connection with Rabbit fail.',
				error,
			})

			throw error
		}
	}
}

export const messageProvider = new MessageProvider()
