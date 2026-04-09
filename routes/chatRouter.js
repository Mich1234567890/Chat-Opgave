import express from 'express'
import ChatController from "../controller/chatcontroller.js"
import UserController from "../controller/usercontroller.js"
import { getMessagesByChatId } from '../model/message.js'

const router = express.Router()

router.get('/', ChatController.getAllChats)

router.post('/', ChatController.createChat)

router.get('/:id/messages', (req, res) => {
    const id = Number(req.params.id)

    const messages = getMessagesByChatId(id)

    res.json(messages)
})

router.get('/:id/view', (req, res) => {
    const id = Number(req.params.id)
    const chat = UserController.chats.find(c => c.id === id)

    if (!chat) {
        return res.status(404).send("Chat not found")
    }

    const user = req.session.user
    res.render('chat', { chat, user })
})

router.post('/:id/messages', ChatController.createMessage)

router.get('/:chatId/messages/:id', (req, res) => {
    const chatId = Number(req.params.chatId)
    const messageId = Number(req.params.id)

    const messages = getMessagesByChatId(chatId)

    const message = messages.find(m => m.id === messageId)

    res.json(message)
})

router.get('/:id', ChatController.getChatById)

router.delete('/:id', ChatController.deleteChat)

export default router
