import chat from "./chat"

const messages = []

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
    return messages.filter(m => m.chatId == chatId)
}

function getMessagesByUserId(userId){
    return messages.filter(u => u.userId == userId)
}

export {Message, getMessagesByChatId, getMessagesByUserId}