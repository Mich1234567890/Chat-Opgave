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

export default userRouter