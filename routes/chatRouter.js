import express from 'express'
import ChatController from "../controller/chatcontroller.js"
import UserController from "../controller/usercontroller.js"

const router = express.Router()

router.get('/', ChatController.getAllChats)

router.post('/', ChatController.createChat)

router.get('/:id/messages', (req, res) => {
    const id = Number(req.params.id)

    const chat = UserController.chats.find(c => c.id === id)

    if (!chat) {
        return res.status(404).send("Chat not found")
    }

    const messagesWithUsernames = chat.messages.map(m => {
        const user = UserController.users.find(u => u.id === m.userId)

        return {
            ...m,
            username: user ? user.username : "Ukendt"
        }
    })

    res.json(messagesWithUsernames)
})

router.get('/:id/view', (req, res) => {
    const id = Number(req.params.id)
    const chat = UserController.chats.find(c => c.id === id)

    if (!chat) {
        return res.status(404).send("Chat not found")
    }

    res.render('chat', {
        chat,
        users: UserController.users
    })
})

router.post('/:id/messages', ChatController.createMessage)

router.get('/:id', ChatController.getChatById)

router.delete('/:id', ChatController.deleteChat)

router.post('/:id/update', ChatController.updateChat)

router.post('/:id/delete', ChatController.deleteChat)

export default router