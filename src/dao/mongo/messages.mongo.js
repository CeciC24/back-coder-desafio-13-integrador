import MessagesRepository from '../../repositories/messages.repository.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'

export default class MessagesManager {
	constructor() {
		this.repository = new MessagesRepository()
	}

	async create(newMessage) {
		try {
			return await this.repository.create(newMessage)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear mensaje',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async get() {
		try {
			return await this.repository.find()
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener mensajes',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async getById(id) {
		try {
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener mensaje de ID ' + id,
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}
}
