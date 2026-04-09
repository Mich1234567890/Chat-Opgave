import express from 'express'
import session from 'express-session'

import UserController from './controller/usercontroller.js'
import userRouter from './routes/userRouter.js'
import chatRouter from './routes/chatRouter.js'

const app = express();

// STARTUP
UserController.startUp()

// SETUP
app.set('view engine', 'pug')

// MIDDLEWARE
app.use(express.static('assets'))
app.use(express.urlencoded())
app.use(express.json())

app.use(session({
    secret: 'secret@chat',
    saveUninitialized: true,
    resave: true
}))

//ROUTES
app.use("/users", userRouter)
app.use("/chats", chatRouter)

app.get('/', (request, response) => {
    const user = request.session.user
    if (!user) {
        response.redirect('/users/login')
    } else {
        response.render('frontpage', { user, chats: UserController.chats })
    }
})

// middleware der fanger resterende requests
app.use((request, response) => {
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, () => {
    console.log("🚅 nu kører toget")
})