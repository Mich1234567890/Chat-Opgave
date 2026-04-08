import express from "express"
import UserController from "../controller/usercontroller.js"

const userRouter = express.Router()

// LOGIN SIDE
userRouter.get('/login', UserController.getLogin)

// LOGIN
userRouter.post('/login', UserController.login)

// LOGOUT
userRouter.get('/logout', UserController.logout)

// OPRET BRUGER
userRouter.post('/adduser', async (req, res) => {
    const { username, password } = req.body
    await UserController.addUser(username, password)
    res.redirect('/users/login')
})

// GET alle users
userRouter.get('/', UserController.getAllUsers)

// GET user by id
userRouter.get('/:id', UserController.getUserById)

export default userRouter