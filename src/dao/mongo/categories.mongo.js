import CategoriesRepository from '../../repositories/categories.repository.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'

export default class CategoryManager {
	constructor() {
		this.repository = new CategoriesRepository()
	}

	async get() {
		try {
			return await this.repository.find()
		} catch (error) {
			CustomError.createError({
				name: 'Error al obtener categorías',
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
				name: 'Error al obtener categoría',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async create(newCategory) {
		try {
			const search = await this.repository.findOne(newCategory.name)

			if (search) {
				CustomError.createError({
					name: 'Error al crear categoría',
					code: ErrorTypes.ERROR_DATA,
					cause: 'La categoría ya existe',
				})
			}

			return await this.repository.create(newCategory)
		} catch (error) {
			CustomError.createError({
				name: 'Error al crear categoría',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async update(id, categoryData) {
		try {
			await this.repository.updateOne(id, categoryData)
			return await this.repository.findById(id)
		} catch (error) {
			CustomError.createError({
				name: 'Error al actualizar categoría',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}

	async delete(id) {
		try {
			const response = await this.repository.findByIdAndDelete(id)
			if (!response) {
				CustomError.createError({
					name: 'Error al eliminar categoría',
					code: ErrorTypes.ERROR_INTERNAL_ERROR,
					cause: 'No se pudo eliminar la categoría',
				})
			}
			return response
		} catch (error) {
			CustomError.createError({
				name: 'Error al eliminar categoría',
				message: error.message,
				code: ErrorTypes.ERROR_INTERNAL_ERROR,
			})
		}
	}
}
