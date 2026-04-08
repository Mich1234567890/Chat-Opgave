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
            return response.status(404).json({error: "Chat not found"})
        }

        response.json(chat)
    }

    static async createChat(request, response) {
        const {name} = request.body
        const user = request.session.user

        if(!user) {
            return response.status(401).send("Not logged in")
        }

        const newChat = new Chat(name, user.id)

        UserController.chats.push(newChat)

        await Archive.writeFile("./data/chats.json",
            JSON.stringify({users: UserController.users, chats: UserController.chats}, null, 2)
        )

        response.json(newChat)
    }

    static async deleteChat(request,response){
        const id = parseInt(request.params.id)

        UserController.chats = UserController.chats.filter(
            chat => chat.id !== id
        )

        await Archive.writeFile("./data/chats.json", 
            JSON.stringify({users: UserController.users, chats: UserController.chats}, null, 2)
        )
        response.send("Chat deleted")
    }
}

export default ChatController