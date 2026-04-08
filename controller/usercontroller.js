import User from "../model/user.js"
import Archive from "../archive.js"

class UserController {
    static users = []
    static chats = []

    get users() {
        // konverter intern rep af users til et array af users
        return UserController.users
    }

    static async addUser(username, password) {
        UserController.users.push(new User(username, password))
        await Archive.writeFile("./data/chats.json",
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2))
    }

    static async deleteUser(id) {
        UserController.users = UserController.users.filter(user => user.id != id)
        await Archive.writeFile('./data/chats.json',
            JSON.stringify({ users: UserController.users, chats: UserController.chats }, null, 2))
    }

    static async startUp() {
        let data = await Archive.readFile('./data/chats.json')

        if (data) {
            const parsed = JSON.parse(data)

            UserController.users = parsed.users || []
            UserController.chats = parsed.chats || []

            const biggestID = UserController.users.reduce((accumulator, user) => {
                return user.id >= accumulator ? user.id : accumulator
            }, 0)

            User.id = biggestID + 1
        }
    }

    static validateUser(username, password) {
        return UserController.users.find(user => user.username === username && user.password === password)
    }

    static login(req, res) {
        const { username, password } = req.body

        const user = UserController.validateUser(username, password)

        if (!user) {
            return res.send("Forkert login")
        }

        req.session.user = user

        res.redirect('/')
    }

    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/users/login')
        })
    }

    static getLogin(req, res) {
        res.render('login')
    }

static getAllUsers(req, res) {
    res.json(UserController.users)
}

static getUserById(req, res) {
    const id = Number(req.params.id)

    const user = UserController.users.find(u => u.id === id)

    if (!user) {
        return res.status(404).send("User not found")
    }

    res.json(user)
}
}

export default UserController
