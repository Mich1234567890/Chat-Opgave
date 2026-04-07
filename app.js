const express = require("express");
const session = require("express-session");
const path = require("path");
import UserController from './controller/userController.js'

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

app.get('/', (request, response)=>{
    const isItAValidUser = request.session.isItAValidUser
    if (!isItAValidUser) {
        response.redirect('/users/login')
    } else {
        response.render('frontpage', {isItAValidUser})
    }
})

app.get('/noget/:id', (request, response)=>{
    const id = request.params.id
    if (id === 'hatogbriller'){
        response.redirect('/frontpage.html')
    }
    else {
        response.send('Fedt nok. Du vinder')
    }
})

// middleware der fanger resterende requests
app.use((request, response, next)=>{
    response.status(404).send('404 - Du tabte')
})

app.listen(8000, ()=>{
    console.log("🚅 nu kører toget")
})