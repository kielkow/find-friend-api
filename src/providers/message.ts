import { env } from '@/env'
import amqplib from 'amqplib'

class MessageProvider {
	constructor() {}

	async connect() {
		const connection = await amqplib.connect(env.RABBITMQ_URL)

		return connection
	}

	async publish(queue: string, message: string) {
		const connection = await amqplib.connect(env.RABBITMQ_URL)

		const channel = await connection.createChannel()
		await channel.assertQueue(queue)

		channel.sendToQueue(queue, Buffer.from(message))

		await channel.close()
		await connection.close()
	}

	async consume(queue: string, method: Function) {
		const connection = await amqplib.connect(env.RABBITMQ_URL)

		const channel = await connection.createChannel()
		const q = await channel.assertQueue(queue)
		console.log('QUEUE INFO:', { name: q.queue, messageCount: q.messageCount })

		await channel.consume(
			queue,
			async (msg) => {
				try {
					if (msg !== null) {
						// await method(msg.content.toString())
						console.info(msg.content.toString())
						channel.ack(msg)
					}
				} catch (error) {
					console.error('Error processing message:', error)
				}
			},
			{ noAck: false, consumerTag: 'create-users' },
		)

		await channel.close()
		await connection.close()
	}

	async testConn() {
		try {
			const connection = await amqplib.connect(env.RABBITMQ_URL)

			const channel = await connection.createChannel()
			await channel.assertQueue('test-conn')

			await channel.close()
			await connection.close()

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
