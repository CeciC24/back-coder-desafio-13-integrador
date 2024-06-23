import UsersModel from '../mongo/models/users.model.js'
import { generateToken } from '../../utils/jwt.utils.js'
import { isValidPassword } from '../../utils/bcrypt.utils.js'
import UserManager from '../mongo/users.mongo.js'
import config from '../../config/environment.config.js'
import CustomError from '../../utils/customError.utils.js'
import ErrorTypes from '../../utils/errorTypes.utils.js'

const userMngr = new UserManager()

export default class AuthManager {
	constructor() {}

	async login({ email, password }) {
		if (!email || !password) {
			CustomError.createError({
				name: 'Error de autenticacion',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se han enviado todos los datos necesarios',
			})
		}

		if (email === config.adminEmail && password === config.adminPassword) {
			const admin = {
				first_name: 'Coder',
				last_name: 'House',
				email: email,
				age: 10,
				role: 'admin',
			}
			const token = generateToken(admin)
			return { message: 'Autenticacion exitosa', token }
		}

		const user = await UsersModel.findOne({ email })
		if (!user) {
			CustomError.createError({
				name: 'Error de credenciales',
				code: ErrorTypes.ERROR_DATA,
			})
		}

		const valid = isValidPassword(user, password)
		if (!valid) {
			CustomError.createError({
				name: 'Error de credenciales',
				code: ErrorTypes.ERROR_DATA,
			})
		}

		const token = generateToken(user)
		return { message: 'Autenticacion exitosa', token }
	}

	async register({ first_name, last_name, email, age, password }) {
		if (!first_name || !last_name || !email || !age || !password) {
			CustomError.createError({
				name: 'Error al registrar usuario',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se han enviado todos los datos necesarios',
			})
		}

		const user = await UsersModel.findOne({ email })
		if (user) {
			CustomError.createError({
				name: 'Error al registrar usuario',
				code: ErrorTypes.ERROR_DATA,
				cause: 'El correo ya se encuentra registrado',
			})
		}

		const newUser = {
			first_name,
			last_name,
			email,
			age,
			password,
		}

		const userCreated = await userMngr.create(newUser)

		const token = generateToken(userCreated)
		return { message: 'Registro exitoso', token }
	}

	async restore({ email, password }) {
		if (!email || !password) {
			CustomError.createError({
				name: 'Error al restaurar contraseña',
				message: 'Faltan datos',
				code: ErrorTypes.ERROR_DATA,
				cause: 'No se han enviado todos los datos necesarios',
			})
		}

		const user = await UsersModel.findOne({ email })
		if (!user) {
			CustomError.createError({
				name: 'Error de credenciales',
				code: ErrorTypes.ERROR_DATA,
			})
		}

		const updatedUser = await userMngr.update(user._id, { password: password })
		const token = generateToken(updatedUser)
		return { message: 'Contraseña restaurada', token }
	}
}
