import UserController from "../controller/usercontroller.js"

class Message {
    static id = 1

    constructor(text, userId, chatId) {
        this.id = Message.id++
        this.text = text
        this.userId = userId
        this.chatId = chatId
        this.createdAt = new Date()
    }
}

function getMessagesByChatId(chatId){
    const chat = UserController.chats.find(c => c.id === chatId)
    return chat ? chat.messages : []
}

function getMessagesByUserId(userId){
    return UserController.chats.flatMap(c => c.messages).filter(m => m.userId === userId)
}

export {Message, getMessagesByChatId, getMessagesByUserId}