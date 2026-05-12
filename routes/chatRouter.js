import express from 'express'
import ChatController from "../controller/chatcontroller.js"
import UserController from "../controller/usercontroller.js"

const router = express.Router()

router.get('/', ChatController.getAllChats)

router.post('/', (req, res) => {
    const name = req.body.name
    const user = req.session.user
    ChatController.createChat(name, user, res)
})

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
    const chatId = Number(req.params.id)

    const chat = UserController.chats.find(c => c.id === chatId)

    res.render('chat', {
        chat: chat,
        users: UserController.users
    })
})

router.post('/:id/messages', (req, res) => {
    const chatid = Number(req.params.id)
    const {text} = req.body
    const user = req.session.user
    ChatController.createMessage(chatid, text, user, res)
})

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    const user = req.session.user
    ChatController.deleteChat(id, user,res)
})

router.get('/:id', ChatController.getChatById)

//router.post('/:id/update', ChatController.updateChat)

//router.post('/:id/delete', ChatController.deleteChat)

export default router