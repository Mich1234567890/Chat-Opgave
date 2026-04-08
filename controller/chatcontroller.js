import Chat from "../model/chat.js"
import Archive from "../archive.js"
import UserController from "./usercontroller.js"

class ChatController {

    static getAllChats(request, response) {
        response.json(UserController.chats)
    }

    static getChatById(request, response) {
        const id = parseInt(request.params.id)

        const chat = UserController.chats.find(c => c.id === id)

        if (!chat) {
            return response.status(404).json({ error: "Chat not found" })
        }

        response.json(chat)
    }

    static async createChat(request, response) {
        const { name } = request.body
        const user = request.session.user

        if (user.level < 2) {
            return response.status(403).send("No permission")
        }

        if (!user) {
            return response.status(401).send("Not logged in")
        }

        const newChat = new Chat(name, user.id)

        UserController.chats.push(newChat)

        await Archive.writeFile("./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
        )

        response.json(newChat)
    }

    static async deleteChat(request, response) {
        const user = request.session.user

        if (!user || user.level < 3) {
            return response.status(403).send("No permission")
        }

        const id = parseInt(request.params.id)

        UserController.chats = UserController.chats.filter(
            chat => chat.id !== id
        )

        await Archive.writeFile("./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
        )
        response.send("Chat deleted")
    }

    static async createMessage(req, res) {
        const chatId = Number(req.params.id)
        const { text } = req.body
        const user = req.session.user

        if (!user) {
            return res.status(401).send("Not logged in")
        }

        const chat = UserController.chats.find(c => c.id === chatId)

        if (!chat) {
            return res.status(404).send("Chat not found")
        }

        const newMessage = {
            id: Date.now(),
            text,
            userId: user.id,
            chatId,
            createdAt: new Date()
        }

        chat.messages.push(newMessage)

        await Archive.writeFile("./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
        )

        res.json(newMessage)
    }
}

export default ChatController