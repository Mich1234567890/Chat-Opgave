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

    static async createChat(name, user, res) {
        if (!user) {
            return res.status(401).send("Not logged in")
        }

        if (!name) {
            return res.status(400).send("Missing name")
        }

        if (user.level < 2) {
            return res.status(403).send("No permission")
        }

        const newChat = new Chat(name, user.id)

        UserController.chats.push(newChat)

        await Archive.writeFile("./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
        )

        res.redirect('/')
    }

    static async deleteChat(id, user, res) {
        console.log("id fra params:", id, typeof id)
        console.log("chats ids:", UserController.chats.map(c => ({ id: c.id, type: typeof c.id })))

        const chat = UserController.chats.find(c => c.id === id)
        console.log("fundet chat", chat);
        console.log("User:", user);


        if (!chat) {
            return res.status(404).send("Chat not found")
        }

        if (user.level === 3 || (user.level === 2 && chat.ownerId === user.id)) {
            console.log("har rettigheder - sletter nu");


            UserController.chats = UserController.chats.filter(c => c.id !== id)

            await Archive.writeFile("./data/chats.json",
                JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2)
            )
            console.log("fil gemt - redirecter nu");

            return res.status(200).json({ message: "deleted" })
        }

        return res.status(403).send("No permission")
    }

    static async createMessage(chatId, text, user, res) {

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