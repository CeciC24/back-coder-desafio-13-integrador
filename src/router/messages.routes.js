import { Router } from 'express'
import MessagesManager from '../dao/mongo/messages.mongo.js'
import MessageDTO from '../dao/DTOs/message.dto.js'

import { authorization } from '../middlewares/auth.middleware.js'
import { passportCall } from '../utils/jwt.utils.js'

import Validate from '../utils/validate.utils.js'

const MsgManager = new MessagesManager()
const MessagesRouter = Router()

MessagesRouter.get('/', async (req, res, next) => {
	try {
		res.status(200).send(await MsgManager.get())
	} catch (error) {
		next(error)
	}
})

MessagesRouter.get('/:mid', async (req, res, next) => {
	let mid = req.params.mid

	try {
		Validate.id(mid, 'mensaje')
		await Validate.existID(mid, MsgManager, 'mensaje')
		res.status(200).send(await MsgManager.getById(mid))
	} catch (error) {
		next(error)
	}
})

MessagesRouter.post('/', passportCall('current'), authorization('user'), async (req, res, next) => {
	let messageData = req.body

	try {
		const newMessage = new MessageDTO(messageData)
		res.status(200).send(await MsgManager.create(newMessage))
	} catch (error) {
		next(error)
	}
})

export default MessagesRouter
