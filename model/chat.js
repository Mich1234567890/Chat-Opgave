import Archive from "../archive.js"

const FIL = 'data/chats.json'

class Chat {
    static id = 1

    constructor(name, userId) {
        this.id = Chat.id++
        this.name = name
        this.createdAt = new Date()
        this.userId = userId
        this.messages = []
    }
}

export default chat