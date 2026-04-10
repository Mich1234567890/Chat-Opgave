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
        if (!name) {
            return response.status(400).send("Missing name")
        }
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

        response.redirect('/')
    }

    static async deleteChat(req, res) {
        console.log("🔥 DELETE ROUTE RAMT 🔥")
        const id = Number(req.params.id)
        const user = req.session.user

        const chat = UserController.chats.find(c => c.id === id)

        if (!chat) {
            return res.status(404).send("Chat not found")
        }

        if (user.level === 3 || (user.level === 2 && chat.ownerId === user.id)) {

            console.log("SLETTER ID:", id)
            console.log("ALLE IDS:", UserController.chats.map(c => c.id))

            console.log("FØR:", UserController.chats.map(c => c.id))

            UserController.chats = UserController.chats.filter(c => Number(c.id) !== id)

             UserController.chats = UserController.chats.filter(c => c.id !== id)

            await Archive.writeFile("./data/chats.json",
                JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
            )

            return res.status(200).json({ message: "deleted" })
        }

        return res.status(403).send("No permission")
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

        res.redirect('/chats/' + chatId + '/view')
    }

    static async updateChat(request, response) {
        const user = request.session.user

        if (!user) {
            return response.status(401).send("Not logged in")
        }

        const id = parseInt(request.params.id)
        const { name } = request.body

        const chat = UserController.chats.find(c => c.id === id)

        if (!chat) {
            return response.status(404).send("Chat not found")
        }

        if (user.level === 1) {
            return response.status(403).send("No permission")
        }

        if (user.level === 2 && chat.ownerId !== user.id) {
            return response.status(403).send("You can only edit your own chats")
        }

        chat.name = name

        await Archive.writeFile(
            "./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
        )

        response.redirect('/')
    }

}

export default ChatController